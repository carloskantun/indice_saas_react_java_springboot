import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Columns3,
  Edit,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  Wallet,
} from 'lucide-react';
import { AgregarColaboradorModal } from '../../../components/AgregarColaboradorModal';
import type { ColaboradorData } from '../../../components/AgregarColaboradorModal';
import { LoadingBarOverlay, runWithMinimumDuration } from '../../../components/LoadingBarOverlay';
import { SuccessToast } from '../../../components/SuccessToast';
import { TerminarContratoModal, type ContractTerminationFormData } from '../../../components/TerminarContratoModal';
import {
  ColumnasConfigModal,
  type ColumnConfig,
} from '../../../components/rh/ColumnasConfigModal';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { Skeleton } from '../../../components/ui/skeleton';
import { useLanguage } from '../../../shared/context';
import { dashboardApi } from '../../../api/dashboard';
import { humanResourcesApi, type BackendEmployee } from '../../../api/humanResources';

type EmployeeStatus = 'active' | 'inactive' | 'terminated';
type EmployeePayPeriod = 'weekly' | 'biweekly' | 'monthly';

interface EmployeeViewModel {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  unitId: string;
  unitLabel: string;
  businessId: string;
  businessLabel: string;
  joinDate: string;
  salary: number;
  payPeriod: EmployeePayPeriod;
  salaryType: 'daily' | 'hourly';
  hourlyRate: number;
  contractType: 'permanent' | 'temporary';
  contractStartDate: string;
  contractEndDate: string;
  status: EmployeeStatus;
}

interface EmployeeSummary {
  total_count: number;
  active_count: number;
  inactive_count: number;
  terminated_count: number;
  total_payroll_amount_monthly: number;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const employeePageCopy = {
  en: {
    title: 'Employees',
    subtitle: 'Persisted employee records, assignments, and contracts',
    addEmployee: 'Add employee',
    configureColumns: 'Columns',
    loadingTitle: 'Saving employee changes',
    loadingDescription: 'We are updating the HR record and refreshing the employee table.',
    terminateLoadingTitle: 'Terminating employee',
    terminateLoadingDescription: 'We are recording the termination details and refreshing attendance access.',
    deleteLoadingTitle: 'Deleting employee',
    deleteLoadingDescription: 'We are removing the terminated employee record.',
    successMessages: {
      created: 'Employee created successfully.',
      updated: 'Employee updated successfully.',
      terminated: 'Employee terminated successfully.',
      deleted: 'Employee deleted successfully.',
    },
    summary: {
      total: 'Total employees',
      active: 'Active',
      inactive: 'Inactive',
      payroll: 'Monthly payroll',
    },
    filters: {
      title: 'Filters',
      searchLabel: 'Search employee',
      searchPlaceholder: 'Name, code, or role',
      unit: 'Unit',
      business: 'Business',
      department: 'Department',
      status: 'Status',
      all: 'All',
    },
    statusLabels: {
      active: 'Active',
      inactive: 'Inactive',
      terminated: 'Terminated',
    },
    columns: {
      selection: 'Selection',
      employee: 'Employee',
      email: 'Email',
      position: 'Position',
      department: 'Department',
      unit: 'Unit',
      business: 'Business',
      status: 'Status',
      salary: 'Salary',
      payPeriod: 'Pay period',
      joinDate: 'Join date',
      actions: 'Actions',
    },
    table: {
      emptyState: 'No employees match the current filters.',
      selectAllVisible: 'Select all visible employees',
      selectEmployee: (name: string) => `Select ${name}`,
      deleteConfirm: 'Delete this terminated employee permanently?',
    },
    businessFallback: 'Unassigned',
    unitFallback: 'Unassigned',
    dateFallback: 'No date',
  },
  es: {
    title: 'Colaboradores',
    subtitle: 'Expedientes persistidos, asignaciones y contratos del personal',
    addEmployee: 'Agregar colaborador',
    configureColumns: 'Columnas',
    loadingTitle: 'Guardando colaborador',
    loadingDescription: 'Estamos actualizando el expediente y refrescando la tabla.',
    terminateLoadingTitle: 'Terminando contrato',
    terminateLoadingDescription: 'Estamos guardando la baja y actualizando el acceso a asistencia.',
    deleteLoadingTitle: 'Eliminando colaborador',
    deleteLoadingDescription: 'Estamos removiendo el expediente terminado.',
    successMessages: {
      created: 'Colaborador creado correctamente.',
      updated: 'Colaborador actualizado correctamente.',
      terminated: 'Contrato terminado correctamente.',
      deleted: 'Colaborador eliminado correctamente.',
    },
    summary: {
      total: 'Total de colaboradores',
      active: 'Activos',
      inactive: 'Inactivos',
      payroll: 'Nómina mensual',
    },
    filters: {
      title: 'Filtros',
      searchLabel: 'Buscar colaborador',
      searchPlaceholder: 'Nombre, código o puesto',
      unit: 'Unidad',
      business: 'Negocio',
      department: 'Departamento',
      status: 'Estado',
      all: 'Todos',
    },
    statusLabels: {
      active: 'Activo',
      inactive: 'Inactivo',
      terminated: 'Terminado',
    },
    columns: {
      selection: 'Selección',
      employee: 'Colaborador',
      email: 'Correo',
      position: 'Puesto',
      department: 'Departamento',
      unit: 'Unidad',
      business: 'Negocio',
      status: 'Estado',
      salary: 'Salario',
      payPeriod: 'Periodo de pago',
      joinDate: 'Ingreso',
      actions: 'Acciones',
    },
    table: {
      emptyState: 'No hay colaboradores con los filtros actuales.',
      selectAllVisible: 'Seleccionar todos los colaboradores visibles',
      selectEmployee: (name: string) => `Seleccionar a ${name}`,
      deleteConfirm: '¿Eliminar permanentemente este colaborador terminado?',
    },
    businessFallback: 'Sin asignar',
    unitFallback: 'Sin asignar',
    dateFallback: 'Sin fecha',
  },
} as const;

const columnsStorageKey = 'rh-colaboradores-columns-v3';
const allFilterValue = 'all';

const createDefaultColumns = (copy: typeof employeePageCopy.en | typeof employeePageCopy.es): ColumnConfig[] => [
  { id: 'employee', label: copy.columns.employee, visible: true, locked: true },
  { id: 'email', label: copy.columns.email, visible: true },
  { id: 'position', label: copy.columns.position, visible: true },
  { id: 'department', label: copy.columns.department, visible: true },
  { id: 'unit', label: copy.columns.unit, visible: true },
  { id: 'business', label: copy.columns.business, visible: false },
  { id: 'status', label: copy.columns.status, visible: true },
  { id: 'salary', label: copy.columns.salary, visible: true },
  { id: 'payPeriod', label: copy.columns.payPeriod, visible: true },
  { id: 'joinDate', label: copy.columns.joinDate, visible: false },
  { id: 'actions', label: copy.columns.actions, visible: true, locked: true },
];

const getInitialColumns = (defaultColumns: ColumnConfig[]) => {
  if (typeof window === 'undefined') {
    return defaultColumns;
  }

  try {
    const rawColumns = window.localStorage.getItem(columnsStorageKey);
    if (!rawColumns) {
      return defaultColumns;
    }

    const parsedColumns = JSON.parse(rawColumns) as Array<Partial<ColumnConfig>>;
    const defaultColumnMap = new Map(defaultColumns.map((column) => [column.id, column]));

    const restoredColumns = parsedColumns
      .map((column) => {
        if (!column?.id || !defaultColumnMap.has(column.id)) {
          return null;
        }

        const baseColumn = defaultColumnMap.get(column.id)!;
        return {
          ...baseColumn,
          visible: typeof column.visible === 'boolean' ? column.visible : baseColumn.visible,
        };
      })
      .filter((column): column is ColumnConfig => column !== null);

    const missingColumns = defaultColumns.filter(
      (column) => !restoredColumns.some((restored) => restored.id === column.id),
    );

    return restoredColumns.length > 0 ? [...restoredColumns, ...missingColumns] : defaultColumns;
  } catch {
    return defaultColumns;
  }
};

const formatDate = (value: string, locale: string, fallback: string) => {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};

const getStatusClasses = (status: EmployeeStatus) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    case 'inactive':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'terminated':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
};

const mapEmployee = (
  employee: BackendEmployee,
  fallbackUnitLabel: string,
  fallbackBusinessLabel: string,
): EmployeeViewModel => ({
  id: employee.id,
  code: employee.employee_number?.trim() || `RH-${String(employee.id).padStart(3, '0')}`,
  firstName: employee.first_name || '',
  lastName: employee.last_name || '',
  fullName: employee.full_name || `${employee.first_name} ${employee.last_name}`.trim(),
  email: employee.email || '',
  phone: employee.phone || '',
  position: employee.position_title || employee.position || '',
  department: employee.department || '',
  unitId: employee.unit_id ? String(employee.unit_id) : allFilterValue,
  unitLabel: employee.unit_name || fallbackUnitLabel,
  businessId: employee.business_id ? String(employee.business_id) : allFilterValue,
  businessLabel: employee.business_name || fallbackBusinessLabel,
  joinDate: employee.hire_date ? String(employee.hire_date) : '',
  salary: Number(employee.salary ?? 0),
  payPeriod: employee.pay_period,
  salaryType: employee.salary_type,
  hourlyRate: Number(employee.hourly_rate ?? 0),
  contractType: employee.contract_type,
  contractStartDate: employee.contract_start_date ? String(employee.contract_start_date) : '',
  contractEndDate: employee.contract_end_date ? String(employee.contract_end_date) : '',
  status: employee.status,
});

const toModalSeed = (employee: EmployeeViewModel) => ({
  nombre: employee.firstName,
  apellidos: employee.lastName,
  correo: employee.email,
  telefonoMovil: employee.phone,
  departamento: employee.department,
  puesto: employee.position,
  unidadNegocio: employee.unitId === allFilterValue ? '' : employee.unitId,
  negocio: employee.businessId === allFilterValue ? '' : employee.businessId,
  fechaIngreso: employee.joinDate,
  tipoSalario: employee.salaryType,
  salario: employee.salary ? String(employee.salary) : '',
  sueldoPorHora: employee.hourlyRate ? String(employee.hourlyRate) : '',
  periodoPago: employee.payPeriod,
  tipoContrato: employee.contractType,
  fechaInicioContrato: employee.contractStartDate,
  fechaFinContrato: employee.contractEndDate,
});

export default function Colaboradores() {
  const { currentLanguage } = useLanguage();
  const languageKey = currentLanguage.code.startsWith('es') ? 'es' : 'en';
  const copy = employeePageCopy[languageKey];

  const defaultColumns = useMemo(() => createDefaultColumns(copy), [copy]);
  const fixedColumns: ColumnConfig[] = [
    { id: 'selection', label: copy.columns.selection, visible: true, locked: true },
  ];

  const [employees, setEmployees] = useState<EmployeeViewModel[]>([]);
  const [summary, setSummary] = useState<EmployeeSummary>({
    total_count: 0,
    active_count: 0,
    inactive_count: 0,
    terminated_count: 0,
    total_payroll_amount_monthly: 0,
  });
  const [unitOptions, setUnitOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [businessOptions, setBusinessOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState(allFilterValue);
  const [businessFilter, setBusinessFilter] = useState(allFilterValue);
  const [departmentFilter, setDepartmentFilter] = useState(allFilterValue);
  const [statusFilter, setStatusFilter] = useState(allFilterValue);
  const [columns, setColumns] = useState<ColumnConfig[]>(() => getInitialColumns(defaultColumns));
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeViewModel | null>(null);
  const [terminatingEmployee, setTerminatingEmployee] = useState<EmployeeViewModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOverlayTitle, setLoadingOverlayTitle] = useState<string>(copy.loadingTitle);
  const [loadingOverlayDescription, setLoadingOverlayDescription] = useState<string>(copy.loadingDescription);
  const [loadError, setLoadError] = useState('');
  const [successToastMessage, setSuccessToastMessage] = useState('');

  const visibleColumns = columns.filter((column) => column.visible);
  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(employees.map((employee) => employee.department).filter(Boolean))).sort((left, right) =>
        left.localeCompare(right),
      ),
    [employees],
  );

  useEffect(() => {
    setColumns((currentColumns) => {
      const translated = getInitialColumns(defaultColumns);
      const needsLabelRefresh = translated.some((nextColumn) => {
        const currentColumn = currentColumns.find((column) => column.id === nextColumn.id);
        return currentColumn?.label !== nextColumn.label;
      });

      return needsLabelRefresh ? translated : currentColumns;
    });
  }, [defaultColumns]);

  useEffect(() => {
    window.localStorage.setItem(columnsStorageKey, JSON.stringify(columns));
  }, [columns]);

  const loadEmployees = async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const [employeesResponse, unitsResponse, businessesResponse] = await Promise.all([
        humanResourcesApi.listEmployees(),
        dashboardApi.listUnits().catch(() => []),
        dashboardApi.listBusinesses().catch(() => []),
      ]);

      setEmployees(
        employeesResponse.items.map((employee) =>
          mapEmployee(employee, copy.unitFallback, copy.businessFallback),
        ),
      );
      setSummary(employeesResponse.summary);
      setUnitOptions([
        { value: allFilterValue, label: copy.filters.all },
        ...unitsResponse.map((unit) => ({ value: String(unit.id), label: unit.name })),
      ]);
      setBusinessOptions([
        { value: allFilterValue, label: copy.filters.all },
        ...businessesResponse.map((business) => ({ value: String(business.id), label: business.name })),
      ]);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load employees.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, [copy.businessFallback, copy.filters.all, copy.unitFallback]);

  useEffect(() => {
    setSelectedEmployeeIds((currentIds) =>
      currentIds.filter((id) => employees.some((employee) => employee.id === id)),
    );
  }, [employees]);

  const filteredEmployees = employees.filter((employee) => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      employee.fullName.toLowerCase().includes(normalizedSearch) ||
      employee.code.toLowerCase().includes(normalizedSearch) ||
      employee.position.toLowerCase().includes(normalizedSearch);
    const matchesUnit = unitFilter === allFilterValue || employee.unitId === unitFilter;
    const matchesBusiness = businessFilter === allFilterValue || employee.businessId === businessFilter;
    const matchesDepartment = departmentFilter === allFilterValue || employee.department === departmentFilter;
    const matchesStatus = statusFilter === allFilterValue || employee.status === statusFilter;

    return matchesSearch && matchesUnit && matchesBusiness && matchesDepartment && matchesStatus;
  });

  const filteredEmployeeIds = filteredEmployees.map((employee) => employee.id);
  const allFilteredSelected =
    filteredEmployeeIds.length > 0 &&
    filteredEmployeeIds.every((employeeId) => selectedEmployeeIds.includes(employeeId));
  const someFilteredSelected =
    !allFilteredSelected && filteredEmployeeIds.some((employeeId) => selectedEmployeeIds.includes(employeeId));

  const toggleSelection = (employeeId: number) => {
    setSelectedEmployeeIds((currentIds) =>
      currentIds.includes(employeeId)
        ? currentIds.filter((id) => id !== employeeId)
        : [...currentIds, employeeId],
    );
  };

  const toggleAllVisibleSelections = () => {
    setSelectedEmployeeIds((currentIds) => {
      if (allFilteredSelected) {
        return currentIds.filter((id) => !filteredEmployeeIds.includes(id));
      }

      return Array.from(new Set([...currentIds, ...filteredEmployeeIds]));
    });
  };

  const runMutation = async ({
    title,
    description,
    task,
  }: {
    title: string;
    description: string;
    task: () => Promise<void>;
  }) => {
    setLoadingOverlayTitle(title);
    setLoadingOverlayDescription(description);
    setIsSubmitting(true);

    try {
      await runWithMinimumDuration(task(), 900);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshEmployees = async () => {
    const response = await humanResourcesApi.listEmployees();
    setEmployees(
      response.items.map((employee) => mapEmployee(employee, copy.unitFallback, copy.businessFallback)),
    );
    setSummary(response.summary);
  };

  const handleSaveEmployee = async (data: ColaboradorData) => {
    const parseForeignKeyValue = (value: string | undefined) => {
      const normalized = String(value ?? '').trim();
      return /^\d+$/.test(normalized) ? Number(normalized) : null;
    };

    const payload = {
      first_name: String(data.nombre ?? ''),
      last_name: String(data.apellidos ?? ''),
      email: String(data.correo ?? ''),
      phone: String(data.telefonoMovil ?? ''),
      position: String(data.puesto ?? ''),
      department: String(data.departamento ?? ''),
      unit_id: parseForeignKeyValue(data.unidadNegocio),
      business_id: parseForeignKeyValue(data.negocio),
      hire_date: String(data.fechaIngreso ?? ''),
      salary: String(data.salario ?? ''),
      pay_period: String(data.periodoPago ?? 'weekly'),
      salary_type: String(data.tipoSalario ?? 'daily'),
      hourly_rate: String(data.sueldoPorHora ?? ''),
      contract_type: String(data.tipoContrato ?? 'permanent'),
      contract_start_date: String(data.fechaInicioContrato ?? ''),
      contract_end_date: String(data.fechaFinContrato ?? ''),
      status: editingEmployee?.status ?? 'active',
    };

    try {
      await runMutation({
        title: copy.loadingTitle,
        description: copy.loadingDescription,
        task: async () => {
          if (editingEmployee) {
            await humanResourcesApi.updateEmployee(editingEmployee.id, payload);
          } else {
            await humanResourcesApi.createEmployee(payload);
          }

          await refreshEmployees();
        },
      });

      setSuccessToastMessage(editingEmployee ? copy.successMessages.updated : copy.successMessages.created);
      setEditingEmployee(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to save employee.');
      throw error;
    }
  };

  const handleDeleteEmployee = async (employee: EmployeeViewModel) => {
    if (employee.status !== 'terminated') {
      setTerminatingEmployee(employee);
      return;
    }

    if (!window.confirm(copy.table.deleteConfirm)) {
      return;
    }

    try {
      await runMutation({
        title: copy.deleteLoadingTitle,
        description: copy.deleteLoadingDescription,
        task: async () => {
          await humanResourcesApi.deleteEmployee(employee.id);
          await refreshEmployees();
        },
      });
      setSuccessToastMessage(copy.successMessages.deleted);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to delete employee.');
    }
  };

  const handleConfirmTermination = async (data: ContractTerminationFormData) => {
    if (!terminatingEmployee) {
      return;
    }

    try {
      await runMutation({
        title: copy.terminateLoadingTitle,
        description: copy.terminateLoadingDescription,
        task: async () => {
          await humanResourcesApi.terminateEmployee(terminatingEmployee.id, {
            exit_date: data.exitDate,
            last_working_day: data.lastWorkingDay,
            reason_type: data.reasonType || 'other',
            specific_reason: data.specificReason,
            summary: data.summary,
          });
          await refreshEmployees();
        },
      });

      setTerminatingEmployee(null);
      setSuccessToastMessage(copy.successMessages.terminated);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to terminate employee.');
    }
  };

  const renderSalaryValue = (employee: EmployeeViewModel) => {
    if (employee.salaryType === 'hourly') {
      return `${currencyFormatter.format(employee.hourlyRate)} / hr`;
    }

    return currencyFormatter.format(employee.salary);
  };

  const renderColumnCell = (employee: EmployeeViewModel, columnId: string) => {
    switch (columnId) {
      case 'employee':
        return (
          <td key={columnId} className="px-6 py-4 align-top">
            <div className="min-w-[220px]">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{employee.fullName}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{employee.code}</p>
            </div>
          </td>
        );
      case 'email':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            <div className="inline-flex min-w-[220px] items-center gap-2 break-all">
              <Mail className="h-4 w-4 text-gray-400" />
              {employee.email || '—'}
            </div>
          </td>
        );
      case 'position':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {employee.position || '—'}
          </td>
        );
      case 'department':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {employee.department || '—'}
          </td>
        );
      case 'unit':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {employee.unitLabel || copy.unitFallback}
          </td>
        );
      case 'business':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {employee.businessLabel || copy.businessFallback}
          </td>
        );
      case 'status':
        return (
          <td key={columnId} className="px-6 py-4 align-top">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                employee.status,
              )}`}
            >
              {copy.statusLabels[employee.status]}
            </span>
          </td>
        );
      case 'salary':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm font-medium text-gray-800 dark:text-gray-100">
            {renderSalaryValue(employee)}
          </td>
        );
      case 'payPeriod':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {employee.payPeriod}
          </td>
        );
      case 'joinDate':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              {formatDate(employee.joinDate, currentLanguage.code, copy.dateFallback)}
            </span>
          </td>
        );
      case 'actions':
        return (
          <td key={columnId} className="px-6 py-4 align-top">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#4338ca] hover:bg-[#4338ca]/10"
                onClick={() => {
                  setEditingEmployee(employee);
                  setIsModalOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => {
                  void handleDeleteEmployee(employee);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <LoadingBarOverlay
        isVisible={isSubmitting}
        title={loadingOverlayTitle}
        description={loadingOverlayDescription}
      />

      <SuccessToast
        isVisible={Boolean(successToastMessage)}
        message={successToastMessage}
        onClose={() => setSuccessToastMessage('')}
      />

      {loadError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-300">
          <div className="flex items-center justify-between gap-3">
            <span>{loadError}</span>
            <Button variant="outline" size="sm" onClick={() => void loadEmployees()}>
              Retry
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-6 rounded-lg border border-[#143675]/20 bg-[#143675]/5 p-6 dark:border-[#143675]/30 dark:bg-[#143675]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">👥</span>
              {copy.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{copy.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsColumnsModalOpen(true)}
              className="gap-2 border-[#143675] text-[#143675] hover:bg-[#143675] hover:text-white"
            >
              <Columns3 className="h-4 w-4" />
              {copy.configureColumns}
            </Button>
            <Button
              onClick={() => {
                setEditingEmployee(null);
                setIsModalOpen(true);
              }}
              className="bg-[#143675] text-white hover:bg-[#0f2855]"
            >
              <Plus className="mr-2 h-4 w-4" />
              {copy.addEmployee}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <Skeleton className="mb-3 h-4 w-24" />
              <Skeleton className="mb-2 h-8 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{copy.summary.total}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{summary.total_count}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{copy.summary.active}</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{summary.active_count}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{copy.summary.inactive}</p>
            <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
              {summary.inactive_count + summary.terminated_count}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{copy.summary.payroll}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-2xl font-bold text-[#143675] dark:text-[#6ea3f7]">
              <Wallet className="h-5 w-5" />
              {currencyFormatter.format(summary.total_payroll_amount_monthly)}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{copy.filters.title}</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {copy.filters.searchLabel}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={copy.filters.searchPlaceholder}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 focus:border-[#143675] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {copy.filters.unit}
            </label>
            <select
              value={unitFilter}
              onChange={(event) => setUnitFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#143675] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {copy.filters.business}
            </label>
            <select
              value={businessFilter}
              onChange={(event) => setBusinessFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#143675] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {businessOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {copy.filters.department}
            </label>
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#143675] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value={allFilterValue}>{copy.filters.all}</option>
              {departmentOptions.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {copy.filters.status}
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#143675] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value={allFilterValue}>{copy.filters.all}</option>
              <option value="active">{copy.statusLabels.active}</option>
              <option value="inactive">{copy.statusLabels.inactive}</option>
              <option value="terminated">{copy.statusLabels.terminated}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
              <tr>
                <th className="w-12 px-5 py-3.5 text-left">
                  <Checkbox
                    checked={allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false}
                    onCheckedChange={toggleAllVisibleSelections}
                    aria-label={copy.table.selectAllVisible}
                  />
                </th>
                {visibleColumns.map((column) => (
                  <th
                    key={column.id}
                    className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-300"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="px-5 py-4">
                      <Skeleton className="h-4 w-4" />
                    </td>
                    {visibleColumns.map((column) => (
                      <td key={column.id} className="px-6 py-4">
                        <Skeleton className="h-4 w-full max-w-[180px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    {copy.table.emptyState}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td className="px-5 py-4 align-top">
                      <Checkbox
                        checked={selectedEmployeeIds.includes(employee.id)}
                        onCheckedChange={() => toggleSelection(employee.id)}
                        aria-label={copy.table.selectEmployee(employee.fullName)}
                      />
                    </td>
                    {visibleColumns.map((column) => renderColumnCell(employee, column.id))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ColumnasConfigModal
        isOpen={isColumnsModalOpen}
        onClose={() => setIsColumnsModalOpen(false)}
        columns={columns}
        fixedColumns={fixedColumns}
        onSave={setColumns}
      />

      <AgregarColaboradorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        colaboradorData={editingEmployee ? (toModalSeed(editingEmployee) as any) : null}
        mode={editingEmployee ? 'edit' : 'create'}
        unitOptions={unitOptions}
        businessOptions={businessOptions}
      />

      <TerminarContratoModal
        isOpen={terminatingEmployee !== null}
        onClose={() => setTerminatingEmployee(null)}
        onConfirm={(data) => {
          void handleConfirmTermination(data);
        }}
        employeeName={terminatingEmployee?.fullName ?? ''}
      />
    </>
  );
}
