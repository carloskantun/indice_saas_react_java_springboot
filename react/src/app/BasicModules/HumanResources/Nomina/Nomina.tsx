import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Calculator,
  CreditCard,
  Download,
  FileSpreadsheet,
  Filter,
  Pencil,
  PlayCircle,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Wallet,
  XCircle,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { ApiClientError, buildApiUrl } from '../../../lib/apiClient';
import { dashboardApi, type BackendBusiness, type BackendUnit } from '../../../api/dashboard';
import {
  humanResourcesApi,
  type PayrollCreateRunsPayload,
  type PayrollLineItem,
  type PayrollManualItemPayload,
  type PayrollOverviewResponse,
  type PayrollPreferences,
  type PayrollRunDetailResponse,
  type PayrollRunLine,
  type PayrollRunSummary,
} from '../../../api/humanResources';
import { useLanguage } from '../../../shared/context';

const todayIsoDate = () => new Date().toISOString().slice(0, 10);
const firstDayOfMonth = () => `${todayIsoDate().slice(0, 8)}01`;

const payrollCopy = {
  en: {
    title: 'Payroll',
    subtitle: 'Generate, review, approve, pay, and export payroll runs using real employee and attendance data.',
    refresh: 'Refresh',
    retry: 'Retry',
    loading: 'Loading payroll',
    unauthorized: 'Your session is no longer authenticated. Sign in again and reload the module.',
    notFound: 'The running backend does not expose the payroll API yet. Restart the Spring server on the latest branch.',
    genericError: 'Unable to load payroll.',
    success: {
      preferences: 'Payroll preferences saved successfully.',
      runsCreated: 'Payroll runs generated successfully.',
      lineSaved: 'Payroll line updated successfully.',
      processed: 'Payroll run processed successfully.',
      approved: 'Payroll run approved successfully.',
      paid: 'Payroll run marked as paid.',
      cancelled: 'Payroll run cancelled successfully.',
    },
    statuses: {
      draft: 'Draft',
      processed: 'Processed',
      approved: 'Approved',
      paid: 'Paid',
      cancelled: 'Cancelled',
    },
    labels: {
      preferences: 'Payroll preferences',
      groupingMode: 'Grouping mode',
      defaultDailyHours: 'Default daily hours',
      payLeaveDays: 'Pay leave days',
      rates: 'Rates',
      controlPanel: 'Generate payroll',
      frequency: 'Frequency',
      periodStart: 'Period start',
      periodEnd: 'Period end',
      periodFrom: 'Period from',
      periodTo: 'Period to',
      filters: 'Run filters',
      status: 'Status',
      unit: 'Unit',
      business: 'Business',
      all: 'All',
      runs: 'Payroll runs',
      noRuns: 'No payroll runs match the current filters.',
      employees: 'Employees',
      gross: 'Gross',
      deductions: 'Deductions',
      employerContributions: 'Employer contributions',
      net: 'Net',
      employee: 'Employee',
      role: 'Role',
      department: 'Department',
      lineEditor: 'Line editor',
      noLineSelected: 'Select a payroll line to inspect and edit it.',
      includeFiscal: 'Apply fiscal deductions and employer contributions',
      notes: 'Notes',
      manualItems: 'Manual adjustments',
      category: 'Category',
      description: 'Description',
      amount: 'Amount',
      addManualEarning: 'Add earning',
      addManualDeduction: 'Add deduction',
      detail: 'Run detail',
      noItems: 'No detail items for this line.',
      exportCsv: 'Export CSV',
      exportPdf: 'Export PDF',
      process: 'Process',
      approve: 'Approve',
      pay: 'Mark paid',
      cancelRun: 'Cancel run',
      saveLine: 'Save line',
      close: 'Close',
      generatedRuns: 'Generated runs',
      currentRun: 'Current run',
      payPeriod: 'Pay period',
      noUnit: 'No unit',
      noBusiness: 'No business',
      salaryType: 'Salary type',
      daily: 'Daily',
      hourly: 'Hourly',
      regularHours: 'Regular hours',
      overtimeHours: 'Overtime hours',
      daysPayable: 'Payable days',
      leaveDays: 'Leave days',
      absenceDays: 'Absence days',
      lateCount: 'Late count',
      selectedRun: 'Selected run',
      generate: 'Generate payroll',
      save: 'Save',
      closeDetail: 'Close detail',
      employerCosts: 'Employer costs',
      openPreferences: 'Preferences',
      openRun: 'Open',
      editDraft: 'Edit draft',
      filterStatus: 'Status',
    },
    summary: {
      runs: 'Runs',
      draft: 'Draft',
      processed: 'Processed',
      approved: 'Approved',
      paid: 'Paid',
      cancelled: 'Cancelled',
      totalGross: 'Total gross',
      totalNet: 'Total net',
    },
    groupingModes: {
      single: 'Single payroll',
      unit: 'By unit',
      business: 'By business',
    },
    frequencies: {
      weekly: 'Weekly',
      biweekly: 'Biweekly',
      monthly: 'Monthly',
    },
    itemCategories: {
      earning: 'Earning',
      deduction: 'Deduction',
      employer_contribution: 'Employer contribution',
    },
  },
  es: {
    title: 'Nómina',
    subtitle: 'Genera, revisa, aprueba, paga y exporta corridas de nómina con datos reales de colaboradores y asistencia.',
    refresh: 'Actualizar',
    retry: 'Reintentar',
    loading: 'Cargando nómina',
    unauthorized: 'Tu sesión ya no está autenticada. Inicia sesión de nuevo y vuelve a cargar el módulo.',
    notFound: 'El backend en ejecución todavía no expone la API de nómina. Reinicia Spring con la versión más reciente.',
    genericError: 'No se pudo cargar la nómina.',
    success: {
      preferences: 'Preferencias de nómina guardadas correctamente.',
      runsCreated: 'Corridas de nómina generadas correctamente.',
      lineSaved: 'Línea de nómina actualizada correctamente.',
      processed: 'Corrida de nómina procesada correctamente.',
      approved: 'Corrida de nómina aprobada correctamente.',
      paid: 'Corrida de nómina marcada como pagada.',
      cancelled: 'Corrida de nómina cancelada correctamente.',
    },
    statuses: {
      draft: 'Borrador',
      processed: 'Procesada',
      approved: 'Aprobada',
      paid: 'Pagada',
      cancelled: 'Cancelada',
    },
    labels: {
      preferences: 'Preferencias de nómina',
      groupingMode: 'Modo de agrupación',
      defaultDailyHours: 'Horas diarias por defecto',
      payLeaveDays: 'Pagar días de permiso',
      rates: 'Tasas',
      controlPanel: 'Generar nómina',
      frequency: 'Frecuencia',
      periodStart: 'Inicio del período',
      periodEnd: 'Fin del período',
      periodFrom: 'Período desde',
      periodTo: 'Período hasta',
      filters: 'Filtros de corridas',
      status: 'Estado',
      unit: 'Unidad',
      business: 'Negocio',
      all: 'Todos',
      runs: 'Corridas de nómina',
      noRuns: 'No hay corridas que coincidan con los filtros actuales.',
      employees: 'Colaboradores',
      gross: 'Bruto',
      deductions: 'Deducciones',
      employerContributions: 'Aportaciones patronales',
      net: 'Neto',
      employee: 'Colaborador',
      role: 'Puesto',
      department: 'Departamento',
      lineEditor: 'Editor de línea',
      noLineSelected: 'Selecciona una línea de nómina para inspeccionarla y editarla.',
      includeFiscal: 'Aplicar deducciones fiscales y aportaciones patronales',
      notes: 'Notas',
      manualItems: 'Ajustes manuales',
      category: 'Categoría',
      description: 'Descripción',
      amount: 'Monto',
      addManualEarning: 'Agregar percepción',
      addManualDeduction: 'Agregar deducción',
      detail: 'Detalle de corrida',
      noItems: 'No hay conceptos detallados en esta línea.',
      exportCsv: 'Exportar CSV',
      exportPdf: 'Exportar PDF',
      process: 'Procesar',
      approve: 'Aprobar',
      pay: 'Marcar pagada',
      cancelRun: 'Cancelar corrida',
      saveLine: 'Guardar línea',
      close: 'Cerrar',
      generatedRuns: 'Corridas generadas',
      currentRun: 'Corrida actual',
      payPeriod: 'Período de pago',
      noUnit: 'Sin unidad',
      noBusiness: 'Sin negocio',
      salaryType: 'Tipo salarial',
      daily: 'Diario',
      hourly: 'Por hora',
      regularHours: 'Horas regulares',
      overtimeHours: 'Horas extra',
      daysPayable: 'Días pagables',
      leaveDays: 'Días de permiso',
      absenceDays: 'Días de ausencia',
      lateCount: 'Retardos',
      selectedRun: 'Corrida seleccionada',
      generate: 'Generar nómina',
      save: 'Guardar',
      closeDetail: 'Cerrar detalle',
      employerCosts: 'Costos patronales',
      openPreferences: 'Preferencias',
      openRun: 'Abrir',
      editDraft: 'Editar borrador',
      filterStatus: 'Estado',
    },
    summary: {
      runs: 'Corridas',
      draft: 'Borradores',
      processed: 'Procesadas',
      approved: 'Aprobadas',
      paid: 'Pagadas',
      cancelled: 'Canceladas',
      totalGross: 'Bruto total',
      totalNet: 'Neto total',
    },
    groupingModes: {
      single: 'Nómina única',
      unit: 'Por unidad',
      business: 'Por negocio',
    },
    frequencies: {
      weekly: 'Semanal',
      biweekly: 'Quincenal',
      monthly: 'Mensual',
    },
    itemCategories: {
      earning: 'Percepción',
      deduction: 'Deducción',
      employer_contribution: 'Aportación patronal',
    },
  },
} as const;

const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (value: string, locale: string, fallback: string) => {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};

const toErrorMessage = (error: unknown, copy: typeof payrollCopy.en | typeof payrollCopy.es) => {
  if (error instanceof ApiClientError) {
    if (error.status === 404) {
      return copy.notFound;
    }
    if (error.status === 401) {
      return copy.unauthorized;
    }
    return error.message || copy.genericError;
  }
  return error instanceof Error ? error.message : copy.genericError;
};

const downloadFile = async (path: string, filename: string) => {
  const response = await fetch(buildApiUrl(path), {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new ApiClientError(response.statusText || 'Request failed', response.status);
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(objectUrl);
};

export default function Nomina() {
  const { currentLanguage } = useLanguage();
  const copy = currentLanguage.code.startsWith('es') ? payrollCopy.es : payrollCopy.en;

  const [overview, setOverview] = useState<PayrollOverviewResponse | null>(null);
  const [runs, setRuns] = useState<PayrollRunSummary[]>([]);
  const [units, setUnits] = useState<BackendUnit[]>([]);
  const [businesses, setBusinesses] = useState<BackendBusiness[]>([]);
  const [selectedRunDetail, setSelectedRunDetail] = useState<PayrollRunDetailResponse | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPreferencesDialogOpen, setIsPreferencesDialogOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [preferencesForm, setPreferencesForm] = useState<PayrollPreferences>({
    grouping_mode: 'single',
    default_daily_hours: 8,
    pay_leave_days: true,
    isr_rate: 0.1,
    imss_employee_rate: 0.04,
    infonavit_employee_rate: 0.03,
    imss_employer_rate: 0.07,
    infonavit_employer_rate: 0.05,
    sar_employer_rate: 0.02,
  });
  const [generationForm, setGenerationForm] = useState<PayrollCreateRunsPayload>({
    pay_period: 'weekly',
    grouping_mode: 'single',
    period_start_date: firstDayOfMonth(),
    period_end_date: todayIsoDate(),
  });
  const [filters, setFilters] = useState({
    status: '',
    pay_period: '',
    grouping_mode: '',
    period_from: '',
    period_to: '',
    unit_id: '',
    business_id: '',
  });
  const [lineDraft, setLineDraft] = useState<{
    include_in_fiscal: boolean;
    notes: string;
    manual_items: PayrollManualItemPayload[];
  }>({
    include_in_fiscal: true,
    notes: '',
    manual_items: [],
  });

  const loadPayroll = async (activeFilters = filters) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [overviewResponse, runsResponse, unitsResponse, businessesResponse] = await Promise.all([
        humanResourcesApi.getPayrollOverview(),
        humanResourcesApi.listPayrollRuns(activeFilters),
        dashboardApi.listUnits().catch(() => []),
        dashboardApi.listBusinesses().catch(() => []),
      ]);

      setOverview(overviewResponse);
      setPreferencesForm(overviewResponse.preferences);
      setGenerationForm((current) => ({
        ...current,
        grouping_mode: current.grouping_mode || overviewResponse.preferences.grouping_mode,
      }));
      setRuns(runsResponse.items);
      setUnits(unitsResponse);
      setBusinesses(businessesResponse);
    } catch (error) {
      setErrorMessage(toErrorMessage(error, copy));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPayroll();
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return;
    }
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const selectedLine = useMemo(
    () => selectedRunDetail?.lines.find((line) => line.id === selectedLineId) ?? null,
    [selectedLineId, selectedRunDetail?.lines],
  );

  useEffect(() => {
    if (!selectedLine) {
      return;
    }
    setLineDraft({
      include_in_fiscal: selectedLine.include_in_fiscal,
      notes: selectedLine.notes || '',
      manual_items: selectedLine.items
        .filter((item) => item.source_type === 'manual')
        .map((item) => ({
          category: item.category === 'earning' ? 'earning' : 'deduction',
          label: item.label,
          amount: item.amount,
        })),
    });
  }, [selectedLine]);

  const summaryCards = overview
    ? [
        { label: copy.summary.runs, value: overview.summary.runs_count },
        { label: copy.summary.draft, value: overview.summary.draft_count },
        { label: copy.summary.processed, value: overview.summary.processed_count },
        { label: copy.summary.approved, value: overview.summary.approved_count },
        { label: copy.summary.paid, value: overview.summary.paid_count },
        { label: copy.summary.cancelled, value: overview.summary.cancelled_count },
        { label: copy.summary.totalGross, value: formatCurrency(overview.summary.total_gross_amount, currentLanguage.code) },
        { label: copy.summary.totalNet, value: formatCurrency(overview.summary.total_net_amount, currentLanguage.code) },
      ]
    : [];

  const openRunDetail = async (runId: number) => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      const detail = await humanResourcesApi.getPayrollRun(runId);
      setSelectedRunDetail(detail);
      setSelectedLineId(detail.lines[0]?.id ?? null);
      setIsRunDialogOpen(true);
    } catch (error) {
      setErrorMessage(toErrorMessage(error, copy));
    } finally {
      setIsSaving(false);
    }
  };

  const refreshOpenRun = async (runId: number) => {
    const detail = await humanResourcesApi.getPayrollRun(runId);
    setSelectedRunDetail(detail);
    setSelectedLineId((current) => current && detail.lines.some((line) => line.id === current) ? current : detail.lines[0]?.id ?? null);
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      await humanResourcesApi.updatePayrollPreferences(preferencesForm);
      setIsPreferencesDialogOpen(false);
      setSuccessMessage(copy.success.preferences);
      await loadPayroll(filters);
    } catch (error) {
      setErrorMessage(toErrorMessage(error, copy));
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateRuns = async () => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      const response = await humanResourcesApi.createPayrollRuns(generationForm);
      setSuccessMessage(copy.success.runsCreated);
      await loadPayroll(filters);
      const firstRun = response.items[0];
      if (firstRun) {
        await openRunDetail(firstRun.id);
      }
    } catch (error) {
      setErrorMessage(toErrorMessage(error, copy));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLine = async () => {
    if (!selectedRunDetail || !selectedLine) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const detail = await humanResourcesApi.updatePayrollRunLine(selectedRunDetail.run.id, selectedLine.id, lineDraft);
      setSelectedRunDetail(detail);
      setSuccessMessage(copy.success.lineSaved);
      await loadPayroll(filters);
    } catch (error) {
      setErrorMessage(toErrorMessage(error, copy));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunAction = async (action: 'process' | 'approve' | 'pay' | 'cancel') => {
    if (!selectedRunDetail) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      switch (action) {
        case 'process':
          await humanResourcesApi.processPayrollRun(selectedRunDetail.run.id);
          setSuccessMessage(copy.success.processed);
          break;
        case 'approve':
          await humanResourcesApi.approvePayrollRun(selectedRunDetail.run.id);
          setSuccessMessage(copy.success.approved);
          break;
        case 'pay':
          await humanResourcesApi.markPayrollRunPaid(selectedRunDetail.run.id);
          setSuccessMessage(copy.success.paid);
          break;
        case 'cancel':
          await humanResourcesApi.cancelPayrollRun(selectedRunDetail.run.id);
          setSuccessMessage(copy.success.cancelled);
          break;
      }

      await refreshOpenRun(selectedRunDetail.run.id);
      await loadPayroll(filters);
    } catch (error) {
      setErrorMessage(toErrorMessage(error, copy));
    } finally {
      setIsSaving(false);
    }
  };

  const applyFilters = async () => {
    await loadPayroll(filters);
  };

  const handleDownload = async (kind: 'csv' | 'pdf', run: PayrollRunSummary) => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      await downloadFile(
        `/api/v1/hr/payroll/runs/${run.id}/export.${kind}`,
        `payroll-run-${run.id}.${kind}`,
      );
    } catch (error) {
      setErrorMessage(toErrorMessage(error, copy));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-300">
          <div className="flex items-center justify-between gap-3">
            <span>{errorMessage}</span>
            <Button variant="outline" size="sm" onClick={() => void loadPayroll(filters)}>
              {copy.retry}
            </Button>
          </div>
        </div>
      ) : null}

      {successMessage ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300">
          {successMessage}
        </div>
      ) : null}

      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">💰</span>
              {copy.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">{copy.subtitle}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setIsPreferencesDialogOpen(true)}>
              <Settings className="h-4 w-4" />
              {copy.labels.openPreferences}
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => void loadPayroll(filters)}>
              <RefreshCw className="h-4 w-4" />
              {copy.refresh}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <Skeleton className="mb-3 h-4 w-28" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-[220px] rounded-lg" />
          <Skeleton className="h-[560px] rounded-lg" />
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card, index) => {
              const icons = [Wallet, PlayCircle, Calculator, ShieldCheck, CreditCard, XCircle, FileSpreadsheet, Wallet] as const;
              const Icon = icons[index];
              return (
                <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                    <Icon className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{copy.labels.controlPanel}</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label={copy.labels.frequency}
                  value={generationForm.pay_period}
                  onChange={(value) => setGenerationForm({ ...generationForm, pay_period: value as PayrollCreateRunsPayload['pay_period'] })}
                  options={[
                    { value: 'weekly', label: copy.frequencies.weekly },
                    { value: 'biweekly', label: copy.frequencies.biweekly },
                    { value: 'monthly', label: copy.frequencies.monthly },
                  ]}
                />
                <SelectField
                  label={copy.labels.groupingMode}
                  value={generationForm.grouping_mode}
                  onChange={(value) => setGenerationForm({ ...generationForm, grouping_mode: value as PayrollCreateRunsPayload['grouping_mode'] })}
                  options={[
                    { value: 'single', label: copy.groupingModes.single },
                    { value: 'unit', label: copy.groupingModes.unit },
                    { value: 'business', label: copy.groupingModes.business },
                  ]}
                />
                <DateField
                  label={copy.labels.periodStart}
                  value={generationForm.period_start_date}
                  onChange={(value) => setGenerationForm({ ...generationForm, period_start_date: value })}
                />
                <DateField
                  label={copy.labels.periodEnd}
                  value={generationForm.period_end_date}
                  onChange={(value) => setGenerationForm({ ...generationForm, period_end_date: value })}
                />
              </div>
              <div className="mt-5">
                <Button onClick={() => void handleGenerateRuns()} disabled={isSaving} className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  {copy.labels.generate}
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{copy.labels.filters}</h3>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  label={copy.labels.filterStatus}
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                  options={[
                    { value: '', label: copy.labels.all },
                    { value: 'draft', label: copy.statuses.draft },
                    { value: 'processed', label: copy.statuses.processed },
                    { value: 'approved', label: copy.statuses.approved },
                    { value: 'paid', label: copy.statuses.paid },
                    { value: 'cancelled', label: copy.statuses.cancelled },
                  ]}
                />
                <SelectField
                  label={copy.labels.frequency}
                  value={filters.pay_period}
                  onChange={(value) => setFilters({ ...filters, pay_period: value })}
                  options={[
                    { value: '', label: copy.labels.all },
                    { value: 'weekly', label: copy.frequencies.weekly },
                    { value: 'biweekly', label: copy.frequencies.biweekly },
                    { value: 'monthly', label: copy.frequencies.monthly },
                  ]}
                />
                <SelectField
                  label={copy.labels.groupingMode}
                  value={filters.grouping_mode}
                  onChange={(value) => setFilters({ ...filters, grouping_mode: value })}
                  options={[
                    { value: '', label: copy.labels.all },
                    { value: 'single', label: copy.groupingModes.single },
                    { value: 'unit', label: copy.groupingModes.unit },
                    { value: 'business', label: copy.groupingModes.business },
                  ]}
                />
                <SelectField
                  label={copy.labels.unit}
                  value={filters.unit_id}
                  onChange={(value) => setFilters({ ...filters, unit_id: value })}
                  options={[
                    { value: '', label: copy.labels.all },
                    ...units.map((unit) => ({ value: String(unit.id), label: unit.name })),
                  ]}
                />
                <SelectField
                  label={copy.labels.business}
                  value={filters.business_id}
                  onChange={(value) => setFilters({ ...filters, business_id: value })}
                  options={[
                    { value: '', label: copy.labels.all },
                    ...businesses.map((business) => ({ value: String(business.id), label: business.name })),
                  ]}
                />
                <DateField
                  label={copy.labels.periodFrom}
                  value={filters.period_from}
                  onChange={(value) => setFilters({ ...filters, period_from: value })}
                />
                <DateField
                  label={copy.labels.periodTo}
                  value={filters.period_to}
                  onChange={(value) => setFilters({ ...filters, period_to: value })}
                />
              </div>
              <div className="mt-5">
                <Button variant="outline" onClick={() => void applyFilters()}>
                  {copy.refresh}
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{copy.labels.runs}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/40">
                  <tr>
                    <HeaderCell>{copy.labels.currentRun}</HeaderCell>
                    <HeaderCell>{copy.labels.groupingMode}</HeaderCell>
                    <HeaderCell>{copy.labels.payPeriod}</HeaderCell>
                    <HeaderCell>{copy.labels.employees}</HeaderCell>
                    <HeaderCell>{copy.labels.gross}</HeaderCell>
                    <HeaderCell>{copy.labels.net}</HeaderCell>
                    <HeaderCell>{copy.labels.status}</HeaderCell>
                    <HeaderCell>{copy.labels.detail}</HeaderCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {runs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        {copy.labels.noRuns}
                      </td>
                    </tr>
                  ) : (
                    runs.map((run) => (
                      <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                        <BodyCell>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatDate(run.period_start_date, currentLanguage.code, run.period_start_date)} → {formatDate(run.period_end_date, currentLanguage.code, run.period_end_date)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">#{run.id}</div>
                        </BodyCell>
                        <BodyCell>{run.grouping_label || copy.groupingModes[run.grouping_mode]}</BodyCell>
                        <BodyCell>{copy.frequencies[run.pay_period]}</BodyCell>
                        <BodyCell>{run.employees_count}</BodyCell>
                        <BodyCell>{formatCurrency(run.gross_amount, currentLanguage.code)}</BodyCell>
                        <BodyCell>{formatCurrency(run.net_amount, currentLanguage.code)}</BodyCell>
                        <BodyCell>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            run.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : run.status === 'cancelled'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : run.status === 'approved'
                                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300'
                                  : run.status === 'processed'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {copy.statuses[run.status]}
                          </span>
                        </BodyCell>
                        <BodyCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => void openRunDetail(run.id)}>
                              {run.status === 'draft' ? <Pencil className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => void handleDownload('csv', run)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </BodyCell>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <PayrollPreferencesDialog
        copy={copy}
        isOpen={isPreferencesDialogOpen}
        isSaving={isSaving}
        form={preferencesForm}
        onClose={() => setIsPreferencesDialogOpen(false)}
        onChange={setPreferencesForm}
        onSave={() => void handleSavePreferences()}
      />

      <PayrollRunDialog
        copy={copy}
        locale={currentLanguage.code}
        isOpen={isRunDialogOpen}
        isSaving={isSaving}
        detail={selectedRunDetail}
        selectedLineId={selectedLineId}
        selectedLine={selectedLine}
        lineDraft={lineDraft}
        onClose={() => setIsRunDialogOpen(false)}
        onSelectLine={setSelectedLineId}
        onChangeDraft={setLineDraft}
        onSaveLine={() => void handleSaveLine()}
        onProcess={() => void handleRunAction('process')}
        onApprove={() => void handleRunAction('approve')}
        onPay={() => void handleRunAction('pay')}
        onCancel={() => void handleRunAction('cancel')}
        onDownloadCsv={(run) => void handleDownload('csv', run)}
        onDownloadPdf={(run) => void handleDownload('pdf', run)}
      />
    </>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
      {children}
    </th>
  );
}

function BodyCell({ children }: { children: ReactNode }) {
  return <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{children}</td>;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-700 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-700 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}

function PayrollPreferencesDialog({
  copy,
  isOpen,
  isSaving,
  form,
  onClose,
  onChange,
  onSave,
}: {
  copy: typeof payrollCopy.en | typeof payrollCopy.es;
  isOpen: boolean;
  isSaving: boolean;
  form: PayrollPreferences;
  onClose: () => void;
  onChange: (value: PayrollPreferences) => void;
  onSave: () => void;
}) {
  const rateFields = [
    { key: 'isr_rate', label: 'ISR' },
    { key: 'imss_employee_rate', label: 'IMSS employee' },
    { key: 'infonavit_employee_rate', label: 'INFONAVIT employee' },
    { key: 'imss_employer_rate', label: 'IMSS employer' },
    { key: 'infonavit_employer_rate', label: 'INFONAVIT employer' },
    { key: 'sar_employer_rate', label: 'SAR employer' },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{copy.labels.preferences}</DialogTitle>
          <DialogDescription>{copy.labels.rates}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SelectField
              label={copy.labels.groupingMode}
              value={form.grouping_mode}
              onChange={(value) => onChange({ ...form, grouping_mode: value as PayrollPreferences['grouping_mode'] })}
              options={[
                { value: 'single', label: copy.groupingModes.single },
                { value: 'unit', label: copy.groupingModes.unit },
                { value: 'business', label: copy.groupingModes.business },
              ]}
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{copy.labels.defaultDailyHours}</label>
              <input
                type="number"
                min="0.5"
                step="0.25"
                value={form.default_daily_hours}
                onChange={(event) => onChange({ ...form, default_daily_hours: Number(event.target.value) })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-700 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={form.pay_leave_days}
                  onChange={(event) => onChange({ ...form, pay_leave_days: event.target.checked })}
                />
                {copy.labels.payLeaveDays}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rateFields.map((field) => (
              <div key={field.key}>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.00001"
                  value={form[field.key]}
                  onChange={(event) => onChange({ ...form, [field.key]: Number(event.target.value) })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-700 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{copy.labels.close}</Button>
          <Button onClick={onSave} disabled={isSaving}>{copy.labels.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PayrollRunDialog({
  copy,
  locale,
  isOpen,
  isSaving,
  detail,
  selectedLineId,
  selectedLine,
  lineDraft,
  onClose,
  onSelectLine,
  onChangeDraft,
  onSaveLine,
  onProcess,
  onApprove,
  onPay,
  onCancel,
  onDownloadCsv,
  onDownloadPdf,
}: {
  copy: typeof payrollCopy.en | typeof payrollCopy.es;
  locale: string;
  isOpen: boolean;
  isSaving: boolean;
  detail: PayrollRunDetailResponse | null;
  selectedLineId: number | null;
  selectedLine: PayrollRunLine | null;
  lineDraft: {
    include_in_fiscal: boolean;
    notes: string;
    manual_items: PayrollManualItemPayload[];
  };
  onClose: () => void;
  onSelectLine: (value: number | null) => void;
  onChangeDraft: (value: {
    include_in_fiscal: boolean;
    notes: string;
    manual_items: PayrollManualItemPayload[];
  }) => void;
  onSaveLine: () => void;
  onProcess: () => void;
  onApprove: () => void;
  onPay: () => void;
  onCancel: () => void;
  onDownloadCsv: (run: PayrollRunSummary) => void;
  onDownloadPdf: (run: PayrollRunSummary) => void;
}) {
  const isDraft = detail?.run.status === 'draft';
  const canProcess = detail?.run.status === 'draft';
  const canApprove = detail?.run.status === 'processed';
  const canPay = detail?.run.status === 'approved';
  const canCancel = detail && detail.run.status !== 'paid' && detail.run.status !== 'cancelled';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[96vh] overflow-y-auto sm:max-w-[96vw]">
        <DialogHeader>
          <DialogTitle>{detail ? `${copy.labels.detail} #${detail.run.id}` : copy.labels.detail}</DialogTitle>
          <DialogDescription>
            {detail
              ? `${formatDate(detail.run.period_start_date, locale, detail.run.period_start_date)} → ${formatDate(detail.run.period_end_date, locale, detail.run.period_end_date)}`
              : copy.labels.currentRun}
          </DialogDescription>
        </DialogHeader>

        {detail ? (
          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {copy.statuses[detail.run.status]}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {detail.run.grouping_label || copy.groupingModes[detail.run.grouping_mode]}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {copy.frequencies[detail.run.pay_period]}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <DetailMetric label={copy.labels.employees} value={String(detail.run.employees_count)} />
                  <DetailMetric label={copy.labels.gross} value={formatCurrency(detail.run.gross_amount, locale)} />
                  <DetailMetric label={copy.labels.deductions} value={formatCurrency(detail.run.deductions_amount, locale)} />
                  <DetailMetric label={copy.labels.net} value={formatCurrency(detail.run.net_amount, locale)} />
                </div>
              </div>

              <div className="max-h-[480px] space-y-3 overflow-y-auto pr-1">
                {detail.lines.map((line) => (
                  <button
                    key={line.id}
                    type="button"
                    onClick={() => onSelectLine(line.id)}
                    className={`w-full rounded-lg border px-4 py-4 text-left transition-all ${
                      selectedLineId === line.id
                        ? 'border-blue-700 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-950/20'
                        : 'border-gray-200 bg-white hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{line.employee_name}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {line.position_title || '—'} · {line.department || '—'}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(line.net_amount, locale)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {selectedLine ? (
                <>
                  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{copy.labels.employee}</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedLine.employee_name}</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {selectedLine.position_title || '—'} · {selectedLine.department || '—'}
                        </p>
                      </div>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {copy.labels.currentRun}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <DetailMetric label={copy.labels.salaryType} value={selectedLine.salary_type === 'daily' ? copy.labels.daily : copy.labels.hourly} />
                      <DetailMetric label={copy.labels.daysPayable} value={String(selectedLine.days_payable)} />
                      <DetailMetric label={copy.labels.leaveDays} value={String(selectedLine.leave_days)} />
                      <DetailMetric label={copy.labels.absenceDays} value={String(selectedLine.absence_days)} />
                      <DetailMetric label={copy.labels.regularHours} value={String(selectedLine.regular_hours)} />
                      <DetailMetric label={copy.labels.overtimeHours} value={String(selectedLine.overtime_hours)} />
                      <DetailMetric label={copy.labels.lateCount} value={String(selectedLine.late_count)} />
                      <DetailMetric label={copy.labels.net} value={formatCurrency(selectedLine.net_amount, locale)} />
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900/40">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{copy.labels.lineEditor}</h4>

                    <div className="mt-4 space-y-4">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={lineDraft.include_in_fiscal}
                          disabled={!isDraft}
                          onChange={(event) => onChangeDraft({ ...lineDraft, include_in_fiscal: event.target.checked })}
                        />
                        {copy.labels.includeFiscal}
                      </label>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{copy.labels.notes}</label>
                        <textarea
                          value={lineDraft.notes}
                          disabled={!isDraft}
                          onChange={(event) => onChangeDraft({ ...lineDraft, notes: event.target.value })}
                          className="min-h-[88px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-700 focus:outline-none disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{copy.labels.manualItems}</label>
                          {isDraft ? (
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onChangeDraft({
                                  ...lineDraft,
                                  manual_items: [...lineDraft.manual_items, { category: 'earning', label: '', amount: 0 }],
                                })}
                              >
                                {copy.labels.addManualEarning}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onChangeDraft({
                                  ...lineDraft,
                                  manual_items: [...lineDraft.manual_items, { category: 'deduction', label: '', amount: 0 }],
                                })}
                              >
                                {copy.labels.addManualDeduction}
                              </Button>
                            </div>
                          ) : null}
                        </div>

                        <div className="space-y-3">
                          {lineDraft.manual_items.length > 0 ? (
                            lineDraft.manual_items.map((item, index) => (
                              <div key={`${item.category}-${index}`} className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70 md:grid-cols-[160px_1fr_140px_auto]">
                                <select
                                  value={item.category}
                                  disabled={!isDraft}
                                  onChange={(event) => {
                                    const manualItems = lineDraft.manual_items.map((currentItem, currentIndex) =>
                                      currentIndex === index
                                        ? { ...currentItem, category: event.target.value as 'earning' | 'deduction' }
                                        : currentItem,
                                    );
                                    onChangeDraft({ ...lineDraft, manual_items: manualItems });
                                  }}
                                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-700 focus:outline-none disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                  <option value="earning">{copy.itemCategories.earning}</option>
                                  <option value="deduction">{copy.itemCategories.deduction}</option>
                                </select>
                                <input
                                  type="text"
                                  value={item.label}
                                  disabled={!isDraft}
                                  placeholder={copy.labels.description}
                                  onChange={(event) => {
                                    const manualItems = lineDraft.manual_items.map((currentItem, currentIndex) =>
                                      currentIndex === index
                                        ? { ...currentItem, label: event.target.value }
                                        : currentItem,
                                    );
                                    onChangeDraft({ ...lineDraft, manual_items: manualItems });
                                  }}
                                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-700 focus:outline-none disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.amount}
                                  disabled={!isDraft}
                                  onChange={(event) => {
                                    const manualItems = lineDraft.manual_items.map((currentItem, currentIndex) =>
                                      currentIndex === index
                                        ? { ...currentItem, amount: Number(event.target.value) }
                                        : currentItem,
                                    );
                                    onChangeDraft({ ...lineDraft, manual_items: manualItems });
                                  }}
                                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-700 focus:outline-none disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {isDraft ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onChangeDraft({
                                      ...lineDraft,
                                      manual_items: lineDraft.manual_items.filter((_, currentIndex) => currentIndex !== index),
                                    })}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                ) : null}
                              </div>
                            ))
                          ) : (
                            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-400">
                              {copy.labels.noItems}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{copy.labels.detail}</h5>
                        <div className="mt-3 space-y-2">
                          {selectedLine.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {copy.itemCategories[item.category]} · {item.code}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(item.amount, locale)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
                  {copy.labels.noLineSelected}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
            {copy.loading}
          </div>
        )}

        <DialogFooter className="mt-4">
          {detail ? (
            <>
              <div className="flex flex-wrap gap-2 sm:mr-auto">
                <Button variant="outline" onClick={() => onDownloadCsv(detail.run)} className="gap-2">
                  <Download className="h-4 w-4" />
                  {copy.labels.exportCsv}
                </Button>
                <Button variant="outline" onClick={() => onDownloadPdf(detail.run)} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  {copy.labels.exportPdf}
                </Button>
                {canProcess ? (
                  <Button onClick={onProcess} disabled={isSaving} className="gap-2">
                    <PlayCircle className="h-4 w-4" />
                    {copy.labels.process}
                  </Button>
                ) : null}
                {canApprove ? (
                  <Button onClick={onApprove} disabled={isSaving} className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    {copy.labels.approve}
                  </Button>
                ) : null}
                {canPay ? (
                  <Button onClick={onPay} disabled={isSaving} className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    {copy.labels.pay}
                  </Button>
                ) : null}
                {canCancel ? (
                  <Button variant="outline" onClick={onCancel} disabled={isSaving} className="gap-2">
                    <XCircle className="h-4 w-4" />
                    {copy.labels.cancelRun}
                  </Button>
                ) : null}
              </div>
              {isDraft ? (
                <Button onClick={onSaveLine} disabled={isSaving || !selectedLine} className="gap-2">
                  <Save className="h-4 w-4" />
                  {copy.labels.saveLine}
                </Button>
              ) : null}
              <Button variant="outline" onClick={onClose}>{copy.labels.closeDetail}</Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>{copy.labels.close}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
