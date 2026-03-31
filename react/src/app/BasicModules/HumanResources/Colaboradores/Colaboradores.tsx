import { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Columns3,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '../../../shared/context';
import { Button } from '../../../components/ui/button';
import { AgregarColaboradorModal } from '../../../components/AgregarColaboradorModal';
import { TerminarContratoModal } from '../../../components/TerminarContratoModal';
import {
  ColumnasConfigModal,
  type ColumnConfig,
} from '../../../components/rh/ColumnasConfigModal';
import { Checkbox } from '../../../components/ui/checkbox';
import { RHColaborador, rhColaboradores } from '../mockData';
import { humanResourcesApi, type BackendEmployee } from '../../../api/humanResources';
import { dashboardApi } from '../../../api/dashboard';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatJoinedDate = (dateValue: string, locale: string) => {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
};

const getStatusClasses = (estado: RHColaborador['estado']) => {
  const styles = {
    Activo: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Vacaciones: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Capacitacion: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    Inactivo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return styles[estado];
};

const translatedValueMap = {
  departments: {
    Operaciones: { en: 'Operations', es: 'Operaciones' },
    Operations: { en: 'Operations', es: 'Operaciones' },
    Administracion: { en: 'Administration', es: 'Administración' },
    Administración: { en: 'Administration', es: 'Administración' },
    Administration: { en: 'Administration', es: 'Administración' },
    Ventas: { en: 'Sales', es: 'Ventas' },
    Sales: { en: 'Sales', es: 'Ventas' },
    'Recursos Humanos': { en: 'Human Resources', es: 'Recursos Humanos' },
    'Human Resources': { en: 'Human Resources', es: 'Recursos Humanos' },
    Mantenimiento: { en: 'Maintenance', es: 'Mantenimiento' },
    Maintenance: { en: 'Maintenance', es: 'Mantenimiento' },
    Lavanderia: { en: 'Laundry', es: 'Lavandería' },
    Lavandería: { en: 'Laundry', es: 'Lavandería' },
    Laundry: { en: 'Laundry', es: 'Lavandería' },
    Limpieza: { en: 'Housekeeping', es: 'Limpieza' },
    Housekeeping: { en: 'Housekeeping', es: 'Limpieza' },
  },
  businesses: {
    'Negocio A': { en: 'Business A', es: 'Negocio A' },
    'Business A': { en: 'Business A', es: 'Negocio A' },
    'Negocio B': { en: 'Business B', es: 'Negocio B' },
    'Business B': { en: 'Business B', es: 'Negocio B' },
    'Negocio C': { en: 'Business C', es: 'Negocio C' },
    'Business C': { en: 'Business C', es: 'Negocio C' },
  },
  positions: {
    'Coordinadora de Operaciones': { en: 'Operations Coordinator', es: 'Coordinadora de Operaciones' },
    'Operations Coordinator': { en: 'Operations Coordinator', es: 'Coordinadora de Operaciones' },
    'Supervisor de Turno': { en: 'Shift Supervisor', es: 'Supervisor de Turno' },
    'Shift Supervisor': { en: 'Shift Supervisor', es: 'Supervisor de Turno' },
    'Analista de RH': { en: 'HR Analyst', es: 'Analista de RH' },
    'HR Analyst': { en: 'HR Analyst', es: 'Analista de RH' },
    'Encargada de Limpieza': { en: 'Housekeeping Lead', es: 'Encargada de Limpieza' },
    'Housekeeping Lead': { en: 'Housekeeping Lead', es: 'Encargada de Limpieza' },
    'Tecnico de Mantenimiento': { en: 'Maintenance Technician', es: 'Tecnico de Mantenimiento' },
    'Maintenance Technician': { en: 'Maintenance Technician', es: 'Tecnico de Mantenimiento' },
    'Auxiliar Administrativo': { en: 'Administrative Assistant', es: 'Auxiliar Administrativo' },
    'Administrative Assistant': { en: 'Administrative Assistant', es: 'Auxiliar Administrativo' },
    'Operador de Kiosco': { en: 'Kiosk Operator', es: 'Operador de Kiosco' },
    'Kiosk Operator': { en: 'Kiosk Operator', es: 'Operador de Kiosco' },
    'Auxiliar de Lavanderia': { en: 'Laundry Assistant', es: 'Auxiliar de Lavandería' },
    'Auxiliar de Lavandería': { en: 'Laundry Assistant', es: 'Auxiliar de Lavandería' },
    'Laundry Assistant': { en: 'Laundry Assistant', es: 'Auxiliar de Lavandería' },
    Coordinador: { en: 'Coordinator', es: 'Coordinador' },
    Coordinator: { en: 'Coordinator', es: 'Coordinador' },
    Camarista: { en: 'Room attendant', es: 'Camarista' },
    'Room attendant': { en: 'Room attendant', es: 'Camarista' },
    Mantenimiento: { en: 'Maintenance', es: 'Mantenimiento' },
    Maintenance: { en: 'Maintenance', es: 'Mantenimiento' },
    'Sin asignar': { en: 'Unassigned', es: 'Sin asignar' },
    Unassigned: { en: 'Unassigned', es: 'Sin asignar' },
  },
} as const;

const translateDisplayValue = (
  value: string,
  languageKey: 'en' | 'es',
  category: keyof typeof translatedValueMap,
) => translatedValueMap[category][value as keyof (typeof translatedValueMap)[typeof category]]?.[languageKey] ?? value;

const toModalSeed = (colaborador: RHColaborador) => {
  const [nombre = '', ...apellidos] = colaborador.nombre.split(' ');

  return {
    nombre,
    apellidos: apellidos.join(' '),
    correo: colaborador.correo,
    fechaNacimiento: '',
    direccion: '',
    curp: '',
    rfc: '',
    nss: '',
    telefonoMovil: colaborador.telefono,
    telefonoAlterno: '',
    nombreContactoEmergencia: '',
    relacionContacto: '',
    telefonoEmergencia: '',
    departamento: colaborador.departamento,
    puesto: colaborador.puesto,
    unidadNegocio: `Unidad ${colaborador.unidad}`,
    negocio: colaborador.negocio,
    paisRegistro: 'Mexico',
    provinciaEstado: 'Nuevo Leon',
    fechaIngreso: colaborador.fechaIngreso,
    tipoSalario: 'daily',
    horasJornada: 8,
    salario: String(colaborador.salario),
    sueldoPorHora: '',
    periodoPago: colaborador.periodoPago,
    tipoContrato: 'permanent',
    fechaInicioContrato: colaborador.fechaIngreso,
    fechaFinContrato: '',
    actaNacimiento: null,
    identificacion: null,
    comprobanteDomicilio: null,
    cv: null,
    fotoPerfil: null,
    rol: 'employee',
    accesos: [],
  };
};

const employeePageTranslations = {
  en: {
    title: 'Employees',
    subtitle: 'Manage your team and workforce details',
    configureColumns: 'Columns',
    addEmployee: 'Add employee',
    cards: {
      teamTotal: 'Team total',
      teamTotalHint: 'Registered HR employees',
      active: 'Active',
      activeHint: 'Employees operating today',
      training: 'Training',
      trainingHint: 'Onboarding and enablement',
      activeAreas: 'Active areas',
      activeAreasHint: (count: number) =>
        count === 1 ? '1 employee currently on vacation' : `${count} employees currently on vacation`,
    },
    filters: {
      title: 'Filters',
      searchLabel: 'Search employee',
      searchPlaceholder: 'Name or code...',
      unit: 'Unit',
      business: 'Business',
      department: 'Department',
      status: 'Status',
      all: 'All',
    },
    table: {
      selectAllVisible: 'Select all visible employees',
      selectEmployee: (name: string) => `Select ${name}`,
      emptyState: 'No employees matched the current filters.',
      defaultNewEmployee: 'New employee',
      defaultUnassignedRole: 'Unassigned',
      defaultBusiness: 'Business A',
    },
    columns: {
      selection: 'Selection',
      collaborator: 'Name',
      lastName: 'Last name',
      email: 'Email',
      position: 'Position',
      department: 'Department',
      unit: 'Unit',
      business: 'Business',
      status: 'Status',
      salary: 'Salary',
      payPeriod: 'Pay period',
      contact: 'Contact',
      joinDate: 'Join date',
      birthDate: 'Date of birth',
      address: 'Address',
      curp: 'National ID',
      rfc: 'Tax ID',
      nss: 'Social security',
      actions: 'Actions',
    },
    statusLabels: {
      Activo: 'Active',
      Vacaciones: 'Vacation',
      Capacitacion: 'Training',
      Inactivo: 'Inactive',
    },
    paymentPeriods: {
      weekly: 'Weekly',
      biweekly: 'Biweekly',
      monthly: 'Monthly',
    },
  },
  es: {
    title: 'Colaboradores',
    subtitle: 'Gestiona tu equipo de trabajo',
    configureColumns: 'Columnas',
    addEmployee: 'Agregar colaborador',
    cards: {
      teamTotal: 'Total del equipo',
      teamTotalHint: 'Personal registrado en RH',
      active: 'Activos',
      activeHint: 'Colaboradores operando hoy',
      training: 'Capacitación',
      trainingHint: 'Integración y onboarding',
      activeAreas: 'Áreas activas',
      activeAreasHint: (count: number) =>
        count === 1 ? '1 persona en vacaciones actualmente' : `${count} en vacaciones actualmente`,
    },
    filters: {
      title: 'Filtros',
      searchLabel: 'Buscar colaborador',
      searchPlaceholder: 'Nombre o código...',
      unit: 'Unidad',
      business: 'Negocio',
      department: 'Departamento',
      status: 'Estado',
      all: 'Todos',
    },
    table: {
      selectAllVisible: 'Seleccionar todos los colaboradores visibles',
      selectEmployee: (name: string) => `Seleccionar a ${name}`,
      emptyState: 'No se encontraron colaboradores con los filtros actuales.',
      defaultNewEmployee: 'Nuevo colaborador',
      defaultUnassignedRole: 'Sin asignar',
      defaultBusiness: 'Negocio A',
    },
    columns: {
      selection: 'Selección',
      collaborator: 'Nombre',
      lastName: 'Apellidos',
      email: 'Correo electrónico',
      position: 'Puesto',
      department: 'Departamento',
      unit: 'Unidad',
      business: 'Negocio',
      status: 'Estado',
      salary: 'Salario',
      payPeriod: 'Periodo de pago',
      contact: 'Contacto',
      joinDate: 'Ingreso',
      birthDate: 'Fecha de nacimiento',
      address: 'Dirección',
      curp: 'CURP',
      rfc: 'RFC',
      nss: 'NSS',
      actions: 'Acciones',
    },
    statusLabels: {
      Activo: 'Activo',
      Vacaciones: 'Vacaciones',
      Capacitacion: 'Capacitación',
      Inactivo: 'Inactivo',
    },
    paymentPeriods: {
      weekly: 'Semanal',
      biweekly: 'Quincenal',
      monthly: 'Mensual',
    },
  },
} as const;

type EmployeePageCopy =
  | typeof employeePageTranslations.en
  | typeof employeePageTranslations.es;

const createDefaultColumns = (
  copy: EmployeePageCopy,
): ColumnConfig[] => [
  { id: 'colaborador', label: copy.columns.collaborator, visible: true, locked: true },
  { id: 'apellidos', label: copy.columns.lastName, visible: false },
  { id: 'correo', label: copy.columns.email, visible: false },
  { id: 'puesto', label: copy.columns.position, visible: true },
  { id: 'departamento', label: copy.columns.department, visible: false },
  { id: 'unidad', label: copy.columns.unit, visible: true },
  { id: 'negocio', label: copy.columns.business, visible: false },
  { id: 'estado', label: copy.columns.status, visible: true },
  { id: 'salario', label: copy.columns.salary, visible: true },
  { id: 'periodoPago', label: copy.columns.payPeriod, visible: true },
  { id: 'contacto', label: copy.columns.contact, visible: false },
  { id: 'ingreso', label: copy.columns.joinDate, visible: false },
  { id: 'fechaNacimiento', label: copy.columns.birthDate, visible: false },
  { id: 'direccion', label: copy.columns.address, visible: false },
  { id: 'curp', label: copy.columns.curp, visible: false },
  { id: 'rfc', label: copy.columns.rfc, visible: false },
  { id: 'nss', label: copy.columns.nss, visible: false },
  { id: 'acciones', label: copy.columns.actions, visible: true, locked: true },
];

const columnsStorageKey = 'rh-colaboradores-columns-v2';
const defaultStatusFilter = 'Activo';
const allFilterValue = 'all';
const filterControlClassName =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors focus:border-[#143675] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white';
const searchControlClassName = `${filterControlClassName} pl-10 pr-4`;
const statusOptions: Array<RHColaborador['estado']> = [
  'Activo',
  'Vacaciones',
  'Capacitacion',
  'Inactivo',
];

const parseSalary = (salaryValue: string | number) => {
  const normalizedValue = String(salaryValue).replace(/[^\d.]/g, '');
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const mapBackendEmployeeToColaborador = (employee: BackendEmployee): RHColaborador => ({
  id: employee.id,
  codigo: employee.employee_number?.trim() || `RH-${String(employee.id).padStart(3, '0')}`,
  nombre: employee.full_name || 'Sin nombre',
  puesto: employee.position_title?.trim() || 'Sin asignar',
  departamento: employee.department?.trim() || 'General',
  unidad: 0,
  negocio: 'Sin asignar',
  correo: employee.email || '',
  telefono: employee.phone || '',
  fechaIngreso: employee.hire_date ? String(employee.hire_date) : '',
  salario: typeof employee.salary === 'number' ? employee.salary : 0,
  periodoPago: 'weekly',
  estado: mapBackendEmployeeStatus(employee.status),
});

const mapBackendEmployeeStatus = (status: string): RHColaborador['estado'] => {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'inactive' || normalized === 'inactivo') {
    return 'Inactivo';
  }
  return 'Activo';
};

const getLastNames = (fullName: string) => {
  const [, ...lastNames] = fullName.trim().split(/\s+/);
  return lastNames.join(' ');
};

const getInitialColumns = (defaultColumns: ColumnConfig[]): ColumnConfig[] => {
  if (typeof window === 'undefined') {
    return defaultColumns;
  }

  try {
    const rawColumns = window.localStorage.getItem(columnsStorageKey);
    if (!rawColumns) {
      return defaultColumns;
    }

    const parsedColumns = JSON.parse(rawColumns) as Array<Partial<ColumnConfig>>;
    if (!Array.isArray(parsedColumns)) {
      return defaultColumns;
    }

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

export default function Colaboradores() {
  const { currentLanguage } = useLanguage();
  const languageKey = currentLanguage.code.startsWith('es') ? 'es' : 'en';
  const copy =
    (languageKey === 'es'
      ? employeePageTranslations.es
      : employeePageTranslations.en) as EmployeePageCopy;
  const defaultColumns = createDefaultColumns(copy);
  const fixedColumns: ColumnConfig[] = [
    { id: 'selection', label: copy.columns.selection, visible: true, locked: true },
  ];
  const [colaboradores, setColaboradores] = useState<RHColaborador[]>(rhColaboradores);
  const [unitSelectOptions, setUnitSelectOptions] = useState<Array<{ value: string; label: string }>>([
    { value: 'all-units', label: languageKey === 'es' ? 'Todas las unidades' : 'All units' },
  ]);
  const [businessSelectOptions, setBusinessSelectOptions] = useState<Array<{ value: string; label: string }>>([
    { value: 'all-businesses', label: languageKey === 'es' ? 'Todos los negocios' : 'All businesses' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [unidadFilter, setUnidadFilter] = useState(allFilterValue);
  const [negocioFilter, setNegocioFilter] = useState(allFilterValue);
  const [departmentFilter, setDepartmentFilter] = useState(allFilterValue);
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const [columns, setColumns] = useState<ColumnConfig[]>(() => getInitialColumns(defaultColumns));
  const [selectedColaboradorIds, setSelectedColaboradorIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<RHColaborador | null>(null);
  const [terminatingColaborador, setTerminatingColaborador] = useState<RHColaborador | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const unidadOptions = [...new Set(colaboradores.map((colaborador) => colaborador.unidad))].sort(
    (left, right) => left - right,
  );
  const negocioOptions = [...new Set(colaboradores.map((colaborador) => colaborador.negocio))].sort();
  const departmentOptions = [
    ...new Set(colaboradores.map((colaborador) => colaborador.departamento)),
  ].sort();
  const visibleColumns = columns.filter((column) => column.visible);

  useEffect(() => {
    setColumns((currentColumns) => {
      const translatedColumns = getInitialColumns(defaultColumns);
      const hasDifferentLabels = translatedColumns.some((translatedColumn) => {
        const currentColumn = currentColumns.find((column) => column.id === translatedColumn.id);
        return currentColumn?.label !== translatedColumn.label;
      });

      return hasDifferentLabels ? translatedColumns : currentColumns;
    });
  }, [defaultColumns]);

  useEffect(() => {
    window.localStorage.setItem(columnsStorageKey, JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    setSelectedColaboradorIds((prevSelectedIds) =>
      prevSelectedIds.filter((id) => colaboradores.some((colaborador) => colaborador.id === id)),
    );
  }, [colaboradores]);

  useEffect(() => {
    let active = true;

    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        setLoadError('');

        const [employeesResponse, units, businesses] = await Promise.all([
          humanResourcesApi.listEmployees(),
          dashboardApi.listUnits().catch(() => []),
          dashboardApi.listBusinesses().catch(() => []),
        ]);

        if (!active) {
          return;
        }

        setColaboradores(employeesResponse.items.map(mapBackendEmployeeToColaborador));
        setUnitSelectOptions([
          { value: 'all-units', label: languageKey === 'es' ? 'Todas las unidades' : 'All units' },
          ...units.map((unit) => ({ value: String(unit.id), label: unit.name })),
        ]);
        setBusinessSelectOptions([
          { value: 'all-businesses', label: languageKey === 'es' ? 'Todos los negocios' : 'All businesses' },
          ...businesses.map((business) => ({ value: business.name, label: business.name })),
        ]);
      } catch (error) {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : 'Unable to load employees.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadEmployees();

    return () => {
      active = false;
    };
  }, [languageKey]);

  const filteredColaboradores = colaboradores.filter((colaborador) => {
    const matchesSearch =
      colaborador.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      colaborador.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      colaborador.puesto.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnidad =
      unidadFilter === allFilterValue || String(colaborador.unidad) === unidadFilter;
    const matchesNegocio = negocioFilter === allFilterValue || colaborador.negocio === negocioFilter;
    const matchesDepartment =
      departmentFilter === allFilterValue || colaborador.departamento === departmentFilter;
    const matchesStatus = statusFilter === allFilterValue || colaborador.estado === statusFilter;

    return (
      matchesSearch &&
      matchesUnidad &&
      matchesNegocio &&
      matchesDepartment &&
      matchesStatus
    );
  });

  const filteredColaboradorIds = filteredColaboradores.map((colaborador) => colaborador.id);
  const allFilteredSelected =
    filteredColaboradorIds.length > 0 &&
    filteredColaboradorIds.every((id) => selectedColaboradorIds.includes(id));
  const someFilteredSelected =
    !allFilteredSelected &&
    filteredColaboradorIds.some((id) => selectedColaboradorIds.includes(id));

  const refreshEmployees = async () => {
    const response = await humanResourcesApi.listEmployees();
    setColaboradores(response.items.map(mapBackendEmployeeToColaborador));
  };

  const handleSaveColaborador = async (data: any) => {
    const payload = {
      first_name: String(data.nombre ?? ''),
      last_name: String(data.apellidos ?? ''),
      email: String(data.correo ?? ''),
      position: String(data.puesto ?? ''),
      department: String(data.departamento ?? ''),
      phone: String(data.telefonoMovil ?? ''),
      salary: String(data.salario ?? data.sueldoPorHora ?? ''),
      hire_date: String(data.fechaIngreso ?? ''),
    };

    try {
      setLoadError('');

      if (editingColaborador) {
        await humanResourcesApi.updateEmployee(editingColaborador.id, {
          ...payload,
        });
      } else {
        await humanResourcesApi.createEmployee(payload);
      }

      await refreshEmployees();
      setEditingColaborador(null);
      setIsModalOpen(false);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to save employee.');
      throw error;
    }
  };

  const toggleColaboradorSelection = (colaboradorId: number) => {
    setSelectedColaboradorIds((prevSelectedIds) =>
      prevSelectedIds.includes(colaboradorId)
        ? prevSelectedIds.filter((id) => id !== colaboradorId)
        : [...prevSelectedIds, colaboradorId],
    );
  };

  const toggleAllVisibleSelections = () => {
    setSelectedColaboradorIds((prevSelectedIds) => {
      if (allFilteredSelected) {
        return prevSelectedIds.filter((id) => !filteredColaboradorIds.includes(id));
      }

      return Array.from(new Set([...prevSelectedIds, ...filteredColaboradorIds]));
    });
  };

  const handleDeleteColaborador = (colaboradorId: number) => {
    const collaboratorToDelete = colaboradores.find((colaborador) => colaborador.id === colaboradorId);

    if (!collaboratorToDelete) {
      return;
    }

    if (collaboratorToDelete.estado === 'Inactivo') {
      void humanResourcesApi.deleteEmployee(colaboradorId)
        .then(() => refreshEmployees())
        .catch((error) => {
          setLoadError(error instanceof Error ? error.message : 'Unable to delete employee.');
        });
      return;
    }

    setTerminatingColaborador(collaboratorToDelete);
  };

  const handleConfirmTermination = async () => {
    if (!terminatingColaborador) {
      return;
    }

    try {
      await humanResourcesApi.terminateEmployee(terminatingColaborador.id);
      await refreshEmployees();
      setTerminatingColaborador(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to terminate employee.');
    }
  };

  const renderColumnCell = (colaborador: RHColaborador, columnId: string) => {
    switch (columnId) {
      case 'colaborador':
        return (
          <td key={columnId} className="px-6 py-4 align-top">
            <p className="min-w-[190px] text-sm font-medium text-gray-700 dark:text-gray-200">
              {colaborador.nombre}
            </p>
          </td>
        );
      case 'puesto':
        return (
          <td key={columnId} className="px-6 py-4 align-top">
            <p className="min-w-[180px] text-sm text-gray-600 dark:text-gray-300">
              {translateDisplayValue(colaborador.puesto, languageKey, 'positions')}
            </p>
          </td>
        );
      case 'apellidos':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {getLastNames(colaborador.nombre) || '—'}
          </td>
        );
      case 'correo':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            <span className="inline-flex min-w-[220px] items-center gap-2 break-all">
              <Mail className="h-4 w-4 text-gray-400" />
              {colaborador.correo || '—'}
            </span>
          </td>
        );
      case 'departamento':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {translateDisplayValue(colaborador.departamento, languageKey, 'departments')}
          </td>
        );
      case 'contacto':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-400">
            <div className="space-y-2 min-w-[240px]">
              <p className="flex items-center gap-2 leading-tight break-all">
                <Mail className="h-4 w-4 text-gray-400" />
                {colaborador.correo}
              </p>
              <p className="flex items-center gap-2 leading-tight">
                <Phone className="h-4 w-4 text-gray-400" />
                {colaborador.telefono}
              </p>
            </div>
          </td>
        );
      case 'unidad':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-400">
            {colaborador.unidad}
          </td>
        );
      case 'negocio':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {translateDisplayValue(colaborador.negocio, languageKey, 'businesses')}
          </td>
        );
      case 'ingreso':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              {formatJoinedDate(colaborador.fechaIngreso, currentLanguage.code)}
            </span>
          </td>
        );
      case 'estado':
        return (
          <td key={columnId} className="px-6 py-4 align-top">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium lowercase ${getStatusClasses(
                colaborador.estado,
              )}`}
            >
              {copy.statusLabels[colaborador.estado].toLowerCase()}
            </span>
          </td>
        );
      case 'salario':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm font-medium text-gray-800 dark:text-gray-100">
            {currencyFormatter.format(colaborador.salario)}
          </td>
        );
      case 'periodoPago':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-400">
            {copy.paymentPeriods[colaborador.periodoPago]}
          </td>
        );
      case 'fechaNacimiento':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {colaborador.fechaNacimiento
              ? formatJoinedDate(colaborador.fechaNacimiento, currentLanguage.code)
              : '—'}
          </td>
        );
      case 'direccion':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            <span className="inline-block min-w-[220px]">{colaborador.direccion || '—'}</span>
          </td>
        );
      case 'curp':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {colaborador.curp || '—'}
          </td>
        );
      case 'rfc':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {colaborador.rfc || '—'}
          </td>
        );
      case 'nss':
        return (
          <td key={columnId} className="px-6 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
            {colaborador.nss || '—'}
          </td>
        );
      case 'acciones':
        return (
          <td key={columnId} className="px-6 py-4 align-top">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-[#4338ca] hover:bg-[#4338ca]/10"
                onClick={() => {
                  setEditingColaborador(colaborador);
                  setIsModalOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => handleDeleteColaborador(colaborador.id)}
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
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-700/30 dark:bg-blue-900/20 dark:text-blue-300">
        Employees in this screen are now loaded from the Spring backend. Create, update, terminate, and delete actions are also connected.
      </div>

      {isLoading ? (
        <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700 dark:border-purple-700/30 dark:bg-purple-900/20 dark:text-purple-300">
          Loading employees...
        </div>
      ) : null}

      {loadError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-300">
          {loadError}
        </div>
      ) : null}

      <div className="bg-[#143675]/5 dark:bg-[#143675]/10 rounded-lg p-6 mb-6 border border-[#143675]/20 dark:border-[#143675]/30">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">👥</span>
              {copy.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {copy.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
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
                setEditingColaborador(null);
                setIsModalOpen(true);
              }}
              className="bg-[#143675] hover:bg-[#0f2855] text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              {copy.addEmployee}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{copy.filters.title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {copy.filters.searchLabel}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={copy.filters.searchPlaceholder}
                className={searchControlClassName}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {copy.filters.unit}
            </label>
            <select
              value={unidadFilter}
              onChange={(event) => setUnidadFilter(event.target.value)}
              className={filterControlClassName}
            >
              <option value={allFilterValue}>{copy.filters.all}</option>
              {unidadOptions.map((value) => (
                <option key={value} value={String(value)}>
                  {copy.filters.unit} {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {copy.filters.business}
            </label>
            <select
              value={negocioFilter}
              onChange={(event) => setNegocioFilter(event.target.value)}
              className={filterControlClassName}
            >
              <option value={allFilterValue}>{copy.filters.all}</option>
              {negocioOptions.map((value) => (
                <option key={value} value={value}>
                  {translateDisplayValue(value, languageKey, 'businesses')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {copy.filters.department}
            </label>
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className={filterControlClassName}
            >
              <option value={allFilterValue}>{copy.filters.all}</option>
              {departmentOptions.map((value) => (
                <option key={value} value={value}>
                  {translateDisplayValue(value, languageKey, 'departments')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {copy.filters.status}
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={filterControlClassName}
            >
              <option value={allFilterValue}>{copy.filters.all}</option>
              {statusOptions.map((value) => (
                <option key={value} value={value}>
                  {copy.statusLabels[value]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
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
                    className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-[0.08em]"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredColaboradores.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {copy.table.emptyState}
                  </td>
                </tr>
              ) : (
                filteredColaboradores.map((colaborador) => (
                  <tr
                    key={colaborador.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <td className="px-5 py-4 align-top">
                      <Checkbox
                        checked={selectedColaboradorIds.includes(colaborador.id)}
                        onCheckedChange={() => toggleColaboradorSelection(colaborador.id)}
                        aria-label={copy.table.selectEmployee(colaborador.nombre)}
                      />
                    </td>
                    {visibleColumns.map((column) => renderColumnCell(colaborador, column.id))}
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
          setEditingColaborador(null);
        }}
        onSave={handleSaveColaborador}
        colaboradorData={editingColaborador ? (toModalSeed(editingColaborador) as any) : null}
        mode={editingColaborador ? 'edit' : 'create'}
        unitOptions={unitSelectOptions}
        businessOptions={businessSelectOptions}
      />

      <TerminarContratoModal
        isOpen={terminatingColaborador !== null}
        onClose={() => setTerminatingColaborador(null)}
        onConfirm={handleConfirmTermination}
        employeeName={terminatingColaborador?.nombre ?? ''}
      />
    </>
  );
}
