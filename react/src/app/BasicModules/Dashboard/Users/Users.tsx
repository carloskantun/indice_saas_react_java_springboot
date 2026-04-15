import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  Mail,
  Search,
  ToggleRight,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useLanguage } from '../../../shared/context';
import {
  configCenterApi,
  type ConfigCenterCatalogModule,
  type ConfigCenterUser,
} from '../../../api/configCenter';
import {
  backendSlugForRoute,
  buildDefaultModuleCatalog,
  mapBackendModuleToCard,
  routeForBackendSlug,
  type DashboardModuleCategory,
  type DashboardModuleColor,
} from '../../../config/moduleCatalog';
import { validateEmail } from '../../../shared/validation/email';
import { BusinessUnitsModal } from './components/BusinessUnitsModal';
import { InviteUserModal } from './components/InviteUserModal';
import { ReportingUsersModal } from './components/ReportingUsersModal';
import { UserModulesModal } from './components/UserModulesModal';
import {
  buildBusinessUnitsData,
  buildReportingUsersData,
  ensureUserUiState,
  type BusinessUnitOption,
  type ReportingUserOption,
  type UserUiState,
} from './components/usersUiData';

interface User {
  id: string;
  backendId: number;
  source: 'user' | 'invitation';
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'User';
  status: 'active' | 'pending' | 'inactive';
  modules: string[];
  isProtected: boolean;
}

interface DisplayUser extends User {
  units: string[];
  businesses: string[];
  reportingUsers: string[];
}

interface AvailableModule {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  color: DashboardModuleColor;
  category: DashboardModuleCategory;
}

type SortField = 'name' | 'role' | 'status' | 'modules' | 'businesses' | 'reportingUsers';

const inputClassName =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-purple-500';

const uiStorageKey = 'dashboard-users-ui-state-v2';

export default function Users() {
  const { currentLanguage, t } = useLanguage();
  const isEnglish = currentLanguage.code === 'en-US' || currentLanguage.code === 'en-CA';
  const uiText = {
    title: isEnglish ? 'User Management' : 'Gestión de usuarios',
    subtitle: isEnglish ? 'Manage users and their access permissions' : 'Administra los usuarios y sus permisos de acceso',
    invite: isEnglish ? 'Invite User' : 'Invitar usuario',
    loadingUsers: isEnglish ? 'Loading users...' : 'Cargando usuarios...',
    usersLoadError: isEnglish ? 'Unable to load users.' : 'No se pudieron cargar los usuarios.',
    searchLabel: isEnglish ? 'Search' : 'Buscar',
    searchPlaceholder: isEnglish ? 'Search by name or email...' : 'Buscar por nombre o email...',
    roleLabel: isEnglish ? 'Role' : 'Rol',
    statusLabel: isEnglish ? 'Status' : 'Estado',
    allRoles: isEnglish ? 'All roles' : 'Todos los roles',
    allStatuses: isEnglish ? 'All statuses' : 'Todos los estados',
    total: isEnglish ? 'total' : 'total',
    activePlural: isEnglish ? 'active' : 'activos',
    pendingPlural: isEnglish ? 'pending' : 'pendientes',
    inactivePlural: isEnglish ? 'inactive' : 'inactivos',
    showingUsers: isEnglish ? 'Showing' : 'Mostrando',
    ofUsers: isEnglish ? 'of' : 'de',
    usersPlural: isEnglish ? 'users' : 'usuarios',
    userColumn: isEnglish ? 'User' : 'Usuario',
    modulesColumn: isEnglish ? 'Modules' : 'Módulos',
    unitsBusinessesColumn: isEnglish ? 'Units/Businesses' : 'Unidades/Negocios',
    reportingUsersColumn: isEnglish ? 'Reporting Users' : 'Usuarios Reportantes',
    actionsColumn: isEnglish ? 'Actions' : 'Acciones',
    noResults: isEnglish ? 'No users found with the selected filters.' : 'No se encontraron usuarios con los filtros seleccionados.',
    updateStatusError: isEnglish ? 'Unable to update the user status.' : 'No se pudo actualizar el estado del usuario.',
    updateRoleError: isEnglish ? 'Unable to update the user role.' : 'No se pudo actualizar el rol del usuario.',
    inviteError: isEnglish ? 'Name and email are required.' : 'Nombre y correo son obligatorios.',
    inviteFailed: isEnglish ? 'Unable to send the invitation.' : 'No se pudo enviar la invitación.',
    resendFailed: isEnglish ? 'Unable to resend the invitation.' : 'No se pudo reenviar la invitación.',
    saveModulesFailed: isEnglish ? 'Unable to save modules.' : 'No se pudieron guardar los módulos.',
    resendTitle: isEnglish ? 'Resend invitation' : 'Reenviar invitación',
    newEmailOptional: isEnglish ? 'New email (optional)' : 'Nuevo email (opcional)',
    inviteResent: isEnglish ? 'Invitation resent successfully.' : 'Invitación reenviada correctamente.',
    invitationLink: isEnglish ? 'Invitation link' : 'Enlace de invitación',
    copy: isEnglish ? 'Copy' : 'Copiar',
    copied: isEnglish ? 'Copied' : 'Copiado',
    cancel: isEnglish ? 'Cancel' : 'Cancelar',
    close: isEnglish ? 'Close' : 'Cerrar',
    resend: isEnglish ? 'Resend' : 'Reenviar',
    activate: isEnglish ? 'Activate user' : 'Activar usuario',
    deactivate: isEnglish ? 'Deactivate user' : 'Desactivar usuario',
    delete: isEnglish ? 'Delete user' : 'Eliminar usuario',
    review: isEnglish ? 'Review user' : 'Revisar usuario',
    superAdmin: t.panelInicial.users.roles.superAdmin,
    admin: t.panelInicial.users.roles.admin,
    user: t.panelInicial.users.roles.user,
    activeStatus: t.panelInicial.users.status.active,
    pendingStatus: t.panelInicial.users.status.pending,
    inactiveStatus: t.panelInicial.users.status.inactive,
  };
  const [users, setUsers] = useState<User[]>([]);
  const [availableModules, setAvailableModules] = useState<AvailableModule[]>(() => buildAvailableModules(t));
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitOption[]>(() => buildBusinessUnitsData());
  const [availableReportingUsers, setAvailableReportingUsers] = useState<ReportingUserOption[]>(() => buildReportingUsersData(buildBusinessUnitsData()));
  const [userUiState, setUserUiState] = useState<Record<string, UserUiState>>(() => loadStoredUserUiState());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isInviteSubmitting, setIsInviteSubmitting] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [selectedUserForResend, setSelectedUserForResend] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedUserForModules, setSelectedUserForModules] = useState<string | null>(null);
  const [selectedUserForBusiness, setSelectedUserForBusiness] = useState<string | null>(null);
  const [selectedUserForReporting, setSelectedUserForReporting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const displayUsers = useMemo<DisplayUser[]>(() => users
    .map((user) => {
      const uiState = userUiState[user.id] ?? { units: [], businesses: [], reportingUsers: [] };
      return {
        ...user,
        role: uiState.role ?? user.role,
        status: uiState.status ?? user.status,
        modules: uiState.modules ?? user.modules,
        units: uiState.units ?? [],
        businesses: uiState.businesses ?? [],
        reportingUsers: uiState.reportingUsers ?? [],
      };
    })
    .filter((user) => !userUiState[user.id]?.hidden), [users, userUiState]);

  const selectedUserForModulesData = displayUsers.find((user) => user.id === selectedUserForModules) ?? null;
  const selectedUserForBusinessData = displayUsers.find((user) => user.id === selectedUserForBusiness) ?? null;
  const selectedUserForReportingData = displayUsers.find((user) => user.id === selectedUserForReporting) ?? null;
  const resendUser = displayUsers.find((user) => user.id === selectedUserForResend) ?? null;

  const filteredUsers = useMemo(() => displayUsers
    .filter((user) => {
      const matchesSearch = searchTerm.trim() === ''
        || user.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        || user.email.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((left, right) => {
      if (!sortField) {
        return 0;
      }

      const leftValue = getSortableValue(left, sortField);
      const rightValue = getSortableValue(right, sortField);
      const comparison = leftValue.localeCompare(rightValue, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? comparison : -comparison;
    }), [displayUsers, roleFilter, searchTerm, sortDirection, sortField, statusFilter]);

  const summary = useMemo(() => ({
    total: displayUsers.length,
    active: displayUsers.filter((user) => user.status === 'active').length,
    pending: displayUsers.filter((user) => user.status === 'pending').length,
    inactive: displayUsers.filter((user) => user.status === 'inactive').length,
  }), [displayUsers]);

  useEffect(() => {
    const fallbackModules = buildAvailableModules(t);
    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError('');
        setAvailableModules(fallbackModules);

        const usersResponse = await configCenterApi.getUsers();

        if (!active) {
          return;
        }

        const mappedCatalogModules = usersResponse.catalog.modules
          .map((module) => mapCatalogModule(module, t))
          .filter((module): module is AvailableModule => module !== null);
        const mergedModules = mappedCatalogModules.length > 0
          ? mergeAvailableModules(mappedCatalogModules, fallbackModules)
          : fallbackModules;

        const mappedUsers = usersResponse.users.map((user) => mapBackendUser(user, mergedModules));
        const nextBusinessUnits = buildBusinessUnitsData();
        const nextReportingUsers = buildReportingUsersData(nextBusinessUnits);

        setAvailableModules(mergedModules);
        setUsers(mappedUsers);
        setBusinessUnits(nextBusinessUnits);
        setAvailableReportingUsers(nextReportingUsers);
      } catch (error) {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : uiText.usersLoadError);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    if (users.length === 0) {
      return;
    }

    setUserUiState((current) => ensureUserUiState(
      current,
      users.map((user) => user.id),
      businessUnits,
      availableReportingUsers,
    ));
  }, [availableReportingUsers, businessUnits, users]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(uiStorageKey, JSON.stringify(userUiState));
  }, [userUiState]);

  const refreshUsers = async (fallbackModules: AvailableModule[] = buildAvailableModules(t)) => {
    const response = await configCenterApi.getUsers();
    const mappedModules = response.catalog.modules
      .map((module) => mapCatalogModule(module, t))
      .filter((module): module is AvailableModule => module !== null);
    const mergedModules = mappedModules.length > 0
      ? mergeAvailableModules(mappedModules, fallbackModules)
      : fallbackModules;
    const mappedUsers = response.users.map((user) => mapBackendUser(user, mergedModules));

    setAvailableModules(mergedModules);
    setUsers(mappedUsers);
  };

  const updateUserUiState = (userId: string, nextState: Partial<UserUiState>) => {
    setUserUiState((current) => ({
      ...current,
      [userId]: {
        units: [],
        businesses: [],
        reportingUsers: [],
        ...current[userId],
        ...nextState,
      },
    }));
  };

  const toggleUserStatus = async (user: DisplayUser) => {
    const nextStatus: User['status'] = user.status === 'active' ? 'inactive' : 'active';

    if (user.source === 'user') {
      try {
        setLoadError('');
        await configCenterApi.updateUser(user.backendId, {
          role: toBackendRole(user.role),
          status: nextStatus,
          module_slugs: mapModulesToBackendSlugs(user.modules),
        });
        updateUserUiState(user.id, { status: undefined });
        await refreshUsers(availableModules);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : uiText.updateStatusError);
      }
      return;
    }

    updateUserUiState(user.id, { status: nextStatus });
  };

  const changeUserRole = async (user: DisplayUser, newRole: User['role']) => {
    if (user.source === 'user') {
      try {
        setLoadError('');
        await configCenterApi.updateUser(user.backendId, {
          role: toBackendRole(newRole),
          status: user.status,
          module_slugs: mapModulesToBackendSlugs(user.modules),
        });
        updateUserUiState(user.id, { role: undefined });
        await refreshUsers(availableModules);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : uiText.updateRoleError);
      }
      return;
    }

    updateUserUiState(user.id, { role: newRole });
  };

  const handleInviteUser = async (data: { name: string; email: string; role: string }) => {
    const trimmedName = data.name.trim();
    const trimmedEmail = data.email.trim();
    const validation = validateEmail(trimmedEmail);

    if (!trimmedName || !validation.ok) {
      setLoadError(validation.ok ? uiText.inviteError : t.loginPage.emailError);
      return;
    }

    try {
      setIsInviteSubmitting(true);
      setLoadError('');
      await configCenterApi.inviteUser({
        name: trimmedName,
        email: validation.normalized,
        role: toBackendRole(data.role as User['role']),
      });
      await refreshUsers(availableModules);
      setShowInviteModal(false);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : uiText.inviteFailed);
    } finally {
      setIsInviteSubmitting(false);
    }
  };

  const handleOpenResend = (user: DisplayUser) => {
    setSelectedUserForResend(user.id);
    setShowResendModal(true);
    setInviteLink('');
    setCopiedLink(false);
    setNewEmail('');
  };

  const handleResendInvite = async () => {
    if (!resendUser || resendUser.source !== 'invitation') {
      return;
    }

    const trimmedEmail = newEmail.trim();
    const validation = trimmedEmail ? validateEmail(trimmedEmail) : null;
    if (trimmedEmail && !validation?.ok) {
      setLoadError(t.loginPage.emailError);
      return;
    }

    try {
      setLoadError('');
      const response = await configCenterApi.resendInvitation(
        resendUser.backendId,
        validation?.ok ? validation.normalized : undefined,
      );
      setInviteLink(response.invite_link);
      await refreshUsers(availableModules);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : uiText.resendFailed);
    }
  };

  const handleSaveModules = async (userId: string, modules: string[]) => {
    const user = displayUsers.find((item) => item.id === userId);
    if (!user) {
      return;
    }

    if (user.source === 'user') {
      try {
        setLoadError('');
        await configCenterApi.updateUser(user.backendId, {
          role: toBackendRole(user.role),
          status: user.status,
          module_slugs: mapModulesToBackendSlugs(modules),
        });
        updateUserUiState(user.id, { modules: undefined });
        await refreshUsers(availableModules);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : uiText.saveModulesFailed);
      }
      return;
    }

    updateUserUiState(user.id, { modules });
  };

  const handleSaveBusinessUnits = (userId: string, data: { units: string[]; businesses: string[] }) => {
    updateUserUiState(userId, {
      units: data.units,
      businesses: data.businesses,
    });
  };

  const handleSaveReportingUsers = (userId: string, reportingUsers: string[]) => {
    updateUserUiState(userId, { reportingUsers });
  };

  const deleteUser = (userId: string) => {
    updateUserUiState(userId, { hidden: true });
  };

  const copyToClipboard = async (value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      }
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="h-4 w-4 text-purple-600" />
      : <ArrowDown className="h-4 w-4 text-purple-600" />;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) => current === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortField(field);
    setSortDirection('asc');
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700">
          {uiText.loadingUsers}
        </div>
      ) : null}

      {loadError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-gray-900">
              <span className="text-2xl">👥</span>
              {uiText.title}
            </h2>
            <p className="text-sm text-gray-600">{uiText.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            <UserPlus className="h-4 w-4" />
            {uiText.invite}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_0.7fr_0.7fr]">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">{uiText.searchLabel}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={uiText.searchPlaceholder}
                className={`pl-10 ${inputClassName}`}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">{uiText.roleLabel}</label>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as 'all' | User['role'])}
              className={inputClassName}
            >
              <option value="all">{uiText.allRoles}</option>
              <option value="Super Admin">{uiText.superAdmin}</option>
              <option value="Admin">{uiText.admin}</option>
              <option value="User">{uiText.user}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">{uiText.statusLabel}</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | User['status'])}
              className={inputClassName}
            >
              <option value="all">{uiText.allStatuses}</option>
              <option value="active">{uiText.activeStatus}</option>
              <option value="pending">{uiText.pendingStatus}</option>
              <option value="inactive">{uiText.inactiveStatus}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">👥 <span className="font-medium text-gray-900">{summary.total}</span> {uiText.total}</span>
        <span className="text-gray-300">•</span>
        <span className="flex items-center gap-1.5">✓ <span className="font-medium text-green-600">{summary.active}</span> {uiText.activePlural}</span>
        <span className="text-gray-300">•</span>
        <span className="flex items-center gap-1.5">⏳ <span className="font-medium text-yellow-600">{summary.pending}</span> {uiText.pendingPlural}</span>
        <span className="text-gray-300">•</span>
        <span className="flex items-center gap-1.5">✕ <span className="font-medium text-gray-600">{summary.inactive}</span> {uiText.inactivePlural}</span>
      </div>

      <div className="text-sm text-gray-600">
        {uiText.showingUsers} {filteredUsers.length} {uiText.ofUsers} {displayUsers.length} {uiText.usersPlural}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button type="button" onClick={() => handleSort('name')} className="flex items-center gap-2 transition-colors hover:text-purple-600">
                    {uiText.userColumn}
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button type="button" onClick={() => handleSort('role')} className="flex items-center gap-2 transition-colors hover:text-purple-600">
                    Rol
                    {getSortIcon('role')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button type="button" onClick={() => handleSort('status')} className="flex items-center gap-2 transition-colors hover:text-purple-600">
                    Estado
                    {getSortIcon('status')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button type="button" onClick={() => handleSort('modules')} className="flex items-center gap-2 transition-colors hover:text-purple-600">
                    {uiText.modulesColumn}
                    {getSortIcon('modules')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button type="button" onClick={() => handleSort('businesses')} className="flex items-center gap-2 transition-colors hover:text-purple-600">
                    {uiText.unitsBusinessesColumn}
                    {getSortIcon('businesses')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button type="button" onClick={() => handleSort('reportingUsers')} className="flex items-center gap-2 transition-colors hover:text-purple-600">
                    {uiText.reportingUsersColumn}
                    {getSortIcon('reportingUsers')}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{uiText.actionsColumn}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(event) => changeUserRole(user, event.target.value as User['role'])}
                      disabled={user.isProtected}
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <option value="Super Admin">{uiText.superAdmin}</option>
                      <option value="Admin">{uiText.admin}</option>
                      <option value="User">{uiText.user}</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadgeClasses(user.status)}>
                      {statusLabel(user.status, uiText)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedUserForModules(user.id)}
                      className="text-sm font-medium text-fuchsia-600 transition-colors hover:underline"
                    >
                      {formatCount(user.modules.length, isEnglish ? 'module' : 'módulo', isEnglish ? 'modules' : 'módulos')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedUserForBusiness(user.id)}
                      className="text-sm font-medium text-fuchsia-600 transition-colors hover:underline"
                    >
                      {formatCount(user.units.length, isEnglish ? 'unit' : 'unidad', isEnglish ? 'units' : 'unidades')}, {formatCount(user.businesses.length, isEnglish ? 'business' : 'negocio', isEnglish ? 'businesses' : 'negocios')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedUserForReporting(user.id)}
                      className="text-sm font-medium text-fuchsia-600 transition-colors hover:underline"
                    >
                      {formatCount(user.reportingUsers.length, isEnglish ? 'user' : 'usuario', isEnglish ? 'users' : 'usuarios')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      {user.status === 'active' ? (
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user)}
                          className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
                          title={uiText.deactivate}
                        >
                          <ToggleRight className="h-5 w-5 text-green-500" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user)}
                          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                          title={user.status === 'pending' ? uiText.review : uiText.activate}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}

                      {user.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenResend(user)}
                          className="rounded-lg p-1.5 text-purple-600 transition-colors hover:bg-purple-50"
                          title={t.panelInicial.users.actions.resend}
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      ) : null}

                      {!user.isProtected ? (
                        <button
                          type="button"
                          onClick={() => deleteUser(user.id)}
                          className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                          title={uiText.delete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                    {uiText.noResults}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <InviteUserModal
        isOpen={showInviteModal}
        isSubmitting={isInviteSubmitting}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteUser}
      />

      {selectedUserForModulesData ? (
        <UserModulesModal
          isOpen
          onClose={() => setSelectedUserForModules(null)}
          userName={selectedUserForModulesData.name}
          availableModules={availableModules}
          selectedModules={selectedUserForModulesData.modules}
          onSave={(modules) => handleSaveModules(selectedUserForModulesData.id, modules)}
        />
      ) : null}

      {selectedUserForBusinessData ? (
        <BusinessUnitsModal
          isOpen
          onClose={() => setSelectedUserForBusiness(null)}
          userName={selectedUserForBusinessData.name}
          businessUnits={businessUnits}
          selectedUnits={selectedUserForBusinessData.units}
          selectedBusinesses={selectedUserForBusinessData.businesses}
          onSave={(data) => handleSaveBusinessUnits(selectedUserForBusinessData.id, data)}
        />
      ) : null}

      {selectedUserForReportingData ? (
        <ReportingUsersModal
          isOpen
          onClose={() => setSelectedUserForReporting(null)}
          userName={selectedUserForReportingData.name}
          currentUserId={selectedUserForReportingData.id}
          businessUnits={businessUnits}
          availableReportingUsers={availableReportingUsers}
          selectedReportingUsers={selectedUserForReportingData.reportingUsers}
          onSave={(reportingUsers) => handleSaveReportingUsers(selectedUserForReportingData.id, reportingUsers)}
        />
      ) : null}

      {showResendModal && resendUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{uiText.resendTitle}</h3>
                <p className="mt-1 text-sm text-gray-500">{resendUser.name}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowResendModal(false);
                  setSelectedUserForResend(null);
                  setInviteLink('');
                  setCopiedLink(false);
                  setNewEmail('');
                }}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              {!inviteLink ? (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">{t.panelInicial.users.modal.email}</label>
                    <input
                      type="text"
                      value={resendUser.email}
                      disabled
                      className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">{uiText.newEmailOptional}</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(event) => setNewEmail(event.target.value)}
                      placeholder="email@company.com"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {uiText.inviteResent}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">{uiText.invitationLink}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900"
                      />
                      <Button
                        type="button"
                        onClick={() => copyToClipboard(inviteLink)}
                        className="bg-purple-600 text-white hover:bg-purple-700"
                      >
                        {copiedLink ? uiText.copied : uiText.copy}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              {!inviteLink ? (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowResendModal(false);
                      setSelectedUserForResend(null);
                      setInviteLink('');
                      setCopiedLink(false);
                      setNewEmail('');
                    }}
                    className="bg-white text-gray-800 shadow-none ring-1 ring-gray-300 hover:bg-gray-100"
                  >
                    {uiText.cancel}
                  </Button>
                  <Button type="button" onClick={handleResendInvite} className="bg-purple-600 text-white hover:bg-purple-700">
                    {uiText.resend}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setShowResendModal(false);
                    setSelectedUserForResend(null);
                    setInviteLink('');
                    setCopiedLink(false);
                    setNewEmail('');
                  }}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                    {uiText.close}
                  </Button>
                )}
              </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function loadStoredUserUiState(): Record<string, UserUiState> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(uiStorageKey);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, UserUiState> : {};
  } catch {
    return {};
  }
}

function buildAvailableModules(t: any): AvailableModule[] {
  return buildDefaultModuleCatalog(t).map((module) => ({
    id: module.route,
    slug: module.slug,
    name: module.title,
    emoji: module.emoji,
    color: module.color,
    category: module.category,
  }));
}

function mapCatalogModule(module: ConfigCenterCatalogModule, t: any): AvailableModule | null {
  const mapped = mapBackendModuleToCard({
    slug: module.slug,
    name: module.name,
  }, t);

  if (!mapped) {
    return null;
  }

  return {
    id: mapped.route,
    slug: module.slug,
    name: mapped.title,
    emoji: mapped.emoji,
    color: mapped.color,
    category: mapped.category,
  };
}

function mergeAvailableModules(apiModules: AvailableModule[], fallbackModules: AvailableModule[]) {
  const merged = new Map<string, AvailableModule>();

  for (const module of apiModules) {
    merged.set(module.id, module);
  }

  for (const module of fallbackModules) {
    if (!merged.has(module.id)) {
      merged.set(module.id, module);
    }
  }

  return Array.from(merged.values());
}

function mapBackendUser(user: ConfigCenterUser, availableModules: AvailableModule[]): User {
  const fullName = `${user.nombres ?? ''} ${user.apellidos ?? ''}`.trim() || user.email;
  const validModuleIds = new Set(availableModules.map((module) => module.id));
  const backendId = user.source === 'invitation'
    ? (user.invitation_id ?? user.id)
    : user.id;

  return {
    id: `${user.source}:${backendId}`,
    backendId,
    source: user.source === 'invitation' ? 'invitation' : 'user',
    name: fullName,
    email: user.email,
    role: normalizeUserRole(user.role),
    status: normalizeUserStatus(user.status),
    modules: user.module_slugs
      .flatMap((slug) => {
        const route = routeForBackendSlug(slug);
        return route && validModuleIds.has(route) ? [route] : [];
      }),
    isProtected: Boolean(user.is_protected),
  };
}

function normalizeUserRole(role: string): User['role'] {
  const normalized = role.trim().toLowerCase();
  if (normalized === 'root' || normalized === 'superadmin') {
    return 'Super Admin';
  }
  if (normalized === 'admin' || normalized === 'owner' || normalized === 'manager') {
    return 'Admin';
  }
  return 'User';
}

function normalizeUserStatus(status: string): User['status'] {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'pending') {
    return 'pending';
  }
  if (normalized === 'inactive' || normalized === 'inactivo') {
    return 'inactive';
  }
  return 'active';
}

function toBackendRole(role: User['role']) {
  if (role === 'Super Admin') {
    return 'superadmin';
  }
  if (role === 'Admin') {
    return 'admin';
  }
  return 'user';
}

function mapModulesToBackendSlugs(modules: string[]) {
  return modules
    .map((route) => backendSlugForRoute(route as any))
    .filter((slug): slug is string => Boolean(slug));
}

function formatCount(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function statusLabel(status: User['status'], uiText: { activeStatus: string; pendingStatus: string; inactiveStatus: string }) {
  if (status === 'active') {
    return uiText.activeStatus;
  }
  if (status === 'pending') {
    return uiText.pendingStatus;
  }
  return uiText.inactiveStatus;
}

function getStatusBadgeClasses(status: User['status']) {
  if (status === 'active') {
    return 'rounded-full bg-green-100 px-2 py-1 text-xs text-green-700';
  }
  if (status === 'pending') {
    return 'rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700';
  }
  return 'rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700';
}

function getSortableValue(user: DisplayUser, field: SortField) {
  if (field === 'modules') {
    return String(user.modules.length).padStart(4, '0');
  }
  if (field === 'businesses') {
    return String(user.businesses.length + user.units.length).padStart(4, '0');
  }
  if (field === 'reportingUsers') {
    return String(user.reportingUsers.length).padStart(4, '0');
  }
  return String(user[field]);
}
