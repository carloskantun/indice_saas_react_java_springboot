import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Clock, MapPin, User, View } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { AttendancePhotoCaptureCard } from '../../../components/AttendancePhotoCaptureCard';
import { CalendarioAsistencia } from '../../../components/CalendarioAsistencia';
import { KioskModal } from '../../../components/KioskModal';
import { LoadingBarOverlay, runWithMinimumDuration } from '../../../components/LoadingBarOverlay';
import { SuccessToast } from '../../../components/SuccessToast';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Skeleton } from '../../../components/ui/skeleton';
import { useAttendancePhotoUpload } from '../../../hooks/useAttendancePhotoUpload';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState';
import { useLanguage } from '../../../shared/context';
import {
  humanResourcesApi,
  type AttendanceCalendarDay,
  type AttendanceCalendarResponse,
  type AttendanceDashboardResponse,
} from '../../../api/humanResources';

const padDatePart = (value: number) => `${value}`.padStart(2, '0');
const localDateString = (date: Date) =>
  `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
const localDateTimeString = (date: Date) =>
  `${localDateString(date)}T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}:${padDatePart(date.getSeconds())}`;
const todayIsoDate = () => localDateString(new Date());
const todayMonth = () => todayIsoDate().slice(0, 7);
const hrAttendanceSelectedEmployeeStorageKey = 'indice.hr.attendance.selectedEmployeeId';

const attendanceCopy = {
  en: {
    title: 'Attendance',
    subtitle: 'Register your entry/exit with photo and location.',
    viewRecords: 'View my records',
    markBlock: 'Mark block',
    loading: {
      refreshTitle: 'Updating attendance',
      refreshDescription: 'We are syncing the HR operation.',
      registerTitle: 'Recording attendance',
      registerDescription: 'We are validating location and updating the daily record.',
      correctTitle: 'Correcting status',
      correctDescription: 'We are saving the manual correction in the backend.',
    },
    success: {
      checkIn: 'Check-in recorded successfully.',
      checkOut: 'Check-out recorded successfully.',
      correctionApplied: 'Correction applied successfully.',
      correctionCleared: 'Correction cleared successfully.',
    },
    summary: {
      onTime: 'On time',
      late: 'Late',
      leave: 'Leave',
      rest: 'Rest',
      absence: 'No record',
      totalMonitored: 'Total monitored',
    },
    statuses: {
      on_time: 'On time',
      late: 'Late',
      leave: 'Leave',
      rest: 'Rest',
      absence: 'No record',
    },
    labels: {
      collaborator: 'Contributor',
      employeeBrowser: 'Employee history',
      employeeBrowserHint: 'Choose who you are reviewing before interacting with the calendar or manual recorder.',
      employeePicker: 'Selected employee',
      previousEmployee: 'Previous',
      nextEmployee: 'Next',
      searchEmployee: 'Search employee',
      searchPlaceholder: 'Name or code',
      employeeList: 'Employees in scope',
      employeeListHint: 'Click a row to load that person’s monthly history and today’s record.',
      noEmployeesFound: 'No employees match the current search.',
      noEmployeesAvailable: 'No employees available yet.',
      unassignedUnit: 'No unit',
      unassignedPosition: 'No role',
      employeeSummary: 'Employee summary',
      position: 'Position',
      unit: 'Unit',
      department: 'Department',
      todayStatus: "Today's status",
      latestLocation: 'Latest location',
      noDepartment: 'No department',
      noEmployeeSelected: 'Select an employee to view the calendar.',
      retry: 'Retry',
    },
    recorder: {
      employee: 'Employee',
      noEmployeeSelected: 'No employee selected',
      selectEmployeeHint: 'Select an employee from the history browser to enable photo and location recording.',
      photo: 'Photo',
      photoRequired: 'Required to record',
      takePhoto: 'Take photo',
      chooseFromGallery: 'Choose from gallery',
      retakePhoto: 'Retake photo',
      photoHint: 'Tip: keep your face centered and use good lighting.',
      location: 'Location',
      locationRequired: 'Required to record',
      getLocation: 'Get location',
      refreshLocation: 'Refresh location',
      noLocation: 'No location',
      record: 'Record',
      recordHint: 'It will be enabled when there is photo + location',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      locationReady: 'Location ready',
      locationUnsupported: 'This browser does not support geolocation.',
      locationDenied: 'You must allow location access to register attendance.',
      locationUnavailable: 'The device location could not be retrieved.',
      photoRequiredError: 'Take a photo before recording attendance.',
      cameraUnsupported: 'This browser cannot open the webcam.',
      cameraPermissionDenied: 'You must allow camera access to take a photo.',
      cameraUnavailable: 'The webcam could not be started.',
      capturePhoto: 'Capture photo',
      cancelCamera: 'Cancel',
    },
  },
  es: {
    title: 'Asistencia',
    subtitle: 'Registra tu entrada/salida con foto y ubicación.',
    viewRecords: 'Ver mis registros',
    markBlock: 'Marcar bloque',
    loading: {
      refreshTitle: 'Actualizando asistencia',
      refreshDescription: 'Estamos sincronizando la operación de RH.',
      registerTitle: 'Registrando asistencia',
      registerDescription: 'Estamos validando ubicación y actualizando el expediente diario.',
      correctTitle: 'Corrigiendo estatus',
      correctDescription: 'Estamos guardando la corrección manual en el backend.',
    },
    success: {
      checkIn: 'Ingreso registrado correctamente.',
      checkOut: 'Salida registrada correctamente.',
      correctionApplied: 'Corrección aplicada correctamente.',
      correctionCleared: 'Corrección eliminada correctamente.',
    },
    summary: {
      onTime: 'A tiempo',
      late: 'Retardos',
      leave: 'Permisos',
      rest: 'Descanso',
      absence: 'Sin registro',
      totalMonitored: 'Total monitoreado',
    },
    statuses: {
      on_time: 'A tiempo',
      late: 'Retardo',
      leave: 'Permiso',
      rest: 'Descanso',
      absence: 'Sin registro',
    },
    labels: {
      collaborator: 'Colaborador',
      employeeBrowser: 'Historial por colaborador',
      employeeBrowserHint: 'Elige a quién estás revisando antes de interactuar con el calendario o el registro manual.',
      employeePicker: 'Colaborador seleccionado',
      previousEmployee: 'Anterior',
      nextEmployee: 'Siguiente',
      searchEmployee: 'Buscar colaborador',
      searchPlaceholder: 'Nombre o código',
      employeeList: 'Colaboradores en alcance',
      employeeListHint: 'Haz clic en una fila para cargar el historial mensual y el registro de hoy.',
      noEmployeesFound: 'No hay colaboradores con esa búsqueda.',
      noEmployeesAvailable: 'Aún no hay colaboradores disponibles.',
      unassignedUnit: 'Sin unidad',
      unassignedPosition: 'Sin puesto',
      employeeSummary: 'Resumen del colaborador',
      position: 'Puesto',
      unit: 'Unidad',
      department: 'Departamento',
      todayStatus: 'Estado de hoy',
      latestLocation: 'Última ubicación',
      noDepartment: 'Sin departamento',
      noEmployeeSelected: 'Selecciona un colaborador para ver su calendario.',
      retry: 'Reintentar',
    },
    recorder: {
      employee: 'Colaborador',
      noEmployeeSelected: 'Ningún colaborador seleccionado',
      selectEmployeeHint: 'Selecciona un colaborador desde el historial para habilitar la foto y la ubicación.',
      photo: 'Foto',
      photoRequired: 'Obligatoria para registrar',
      takePhoto: 'Tomar foto',
      chooseFromGallery: 'Elegir de galería',
      retakePhoto: 'Tomar de nuevo',
      photoHint: 'Tip: keep your face centered and use good lighting.',
      location: 'Ubicación',
      locationRequired: 'Obligatoria para registrar',
      getLocation: 'Obtener ubicación',
      refreshLocation: 'Actualizar ubicación',
      noLocation: 'Sin ubicación',
      record: 'Registro',
      recordHint: 'Se habilitará cuando exista foto + ubicación',
      checkIn: 'Registrar ingreso',
      checkOut: 'Registrar salida',
      locationReady: 'Ubicación lista',
      locationUnsupported: 'Este navegador no soporta geolocalización.',
      locationDenied: 'Debes permitir la ubicación para registrar asistencia.',
      locationUnavailable: 'No se pudo obtener la ubicación del dispositivo.',
      photoRequiredError: 'Toma una foto antes de registrar asistencia.',
      cameraUnsupported: 'Este navegador no puede abrir la webcam.',
      cameraPermissionDenied: 'Debes permitir el acceso a la cámara para tomar la foto.',
      cameraUnavailable: 'No se pudo iniciar la webcam.',
      capturePhoto: 'Capturar foto',
      cancelCamera: 'Cancelar',
    },
  },
} as const;

const summaryCardKeys = ['on_time_count', 'late_count', 'leave_count', 'rest_count', 'absence_count'] as const;

const statusClasses: Record<string, string> = {
  on_time: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  late: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  leave: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  rest: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  absence: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
};

const monthLabel = (month: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(`${month}-01T00:00:00`));

export default function Asistencia() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const copy = currentLanguage.code.startsWith('es') ? attendanceCopy.es : attendanceCopy.en;
  const [dashboard, setDashboard] = useState<AttendanceDashboardResponse | null>(null);
  const [calendar, setCalendar] = useState<AttendanceCalendarResponse | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(todayMonth());
  const [selectedEmployeeId, setSelectedEmployeeId] = useLocalStorageState<number | null>(
    hrAttendanceSelectedEmployeeStorageKey,
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isKioskOpen, setIsKioskOpen] = useState(false);
  const [isRecordsOpen, setIsRecordsOpen] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState<string>(copy.loading.refreshTitle);
  const [overlayDescription, setOverlayDescription] = useState<string>(copy.loading.refreshDescription);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToastMessage, setSuccessToastMessage] = useState('');
  const [recorderLocationId, setRecorderLocationId] = useState('');
  const [recorderLocationState, setRecorderLocationState] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const registrationRef = useRef<HTMLDivElement | null>(null);
  const successToastTimeoutRef = useRef<number | null>(null);
  const attendancePhotoUpload = useAttendancePhotoUpload();

  const filteredItems = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) {
      return dashboard.items;
    }

    return dashboard.items.filter((item) =>
      `${item.employee_name} ${item.employee_number ?? ''} ${item.position_title ?? ''}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [dashboard, searchQuery]);

  const selectedItem = useMemo(
    () => filteredItems.find((item) => item.employee_id === selectedEmployeeId) ?? dashboard?.items.find((item) => item.employee_id === selectedEmployeeId) ?? null,
    [dashboard?.items, filteredItems, selectedEmployeeId],
  );

  const selectedEmployeeOption = useMemo(
    () => dashboard?.employees.find((employee) => employee.id === selectedEmployeeId) ?? null,
    [dashboard?.employees, selectedEmployeeId],
  );
  const employeeOptions = dashboard?.items ?? [];
  const selectedEmployeeIndex = employeeOptions.findIndex((item) => item.employee_id === selectedEmployeeId);
  const canGoToPreviousEmployee = selectedEmployeeIndex > 0;
  const canGoToNextEmployee =
    selectedEmployeeIndex >= 0 && selectedEmployeeIndex < employeeOptions.length - 1;

  const loadDashboard = async () => {
    setIsLoadingDashboard(true);
    setErrorMessage('');

    try {
      const response = await humanResourcesApi.getAttendanceDashboard(todayIsoDate());
      setDashboard(response);
      setSelectedEmployeeId((current) =>
        current && response.employees.some((employee) => employee.id === current)
          ? current
          : response.employees[0]?.id ?? null,
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.labels.retry);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const loadCalendar = async (employeeId: number, month: string) => {
    setIsLoadingCalendar(true);

    try {
      const response = await humanResourcesApi.getAttendanceCalendar(employeeId, month);
      setCalendar(response);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.labels.retry);
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  useEffect(() => {
    if (!location.state || typeof location.state !== 'object' || !('openKiosk' in location.state)) {
      return;
    }

    const shouldOpenKiosk = Boolean((location.state as { openKiosk?: unknown }).openKiosk);
    if (!shouldOpenKiosk) {
      return;
    }

    setIsKioskOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (dashboard?.locations?.length && !recorderLocationId) {
      setRecorderLocationId(String(dashboard.locations[0].id));
    }
  }, [dashboard?.locations, recorderLocationId]);

  useEffect(() => {
    if (!selectedEmployeeId) {
      setCalendar(null);
      return;
    }

    void loadCalendar(selectedEmployeeId, calendarMonth);
  }, [calendarMonth, selectedEmployeeId]);

  useEffect(() => {
    attendancePhotoUpload.clearPhoto();
  }, [selectedEmployeeId]);

  useEffect(() => () => {
    if (successToastTimeoutRef.current !== null) {
      window.clearTimeout(successToastTimeoutRef.current);
    }
  }, []);

  const showSuccessToast = (message: string) => {
    if (successToastTimeoutRef.current !== null) {
      window.clearTimeout(successToastTimeoutRef.current);
      successToastTimeoutRef.current = null;
    }

    setSuccessToastMessage('');
    successToastTimeoutRef.current = window.setTimeout(() => {
      setSuccessToastMessage(message);
      successToastTimeoutRef.current = null;
    }, 10);
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
    setOverlayTitle(title);
    setOverlayDescription(description);
    setIsSubmitting(true);

    try {
      await runWithMinimumDuration(task(), 850);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKioskSubmit = async (payload: {
    employeeId: number;
    eventType: 'check_in' | 'check_out' | 'break_out' | 'break_in';
    locationId: number;
    kioskDeviceId: number;
    authMethod: 'pin' | 'badge' | 'password' | 'manual_override' | 'facial_recognition';
    faceVerificationSessionId?: number;
    credentialPayload?: string;
    latitude: number;
    longitude: number;
    photoUrl?: string;
    eventTimestamp?: string;
  }) => {
    await runMutation({
      title: copy.loading.registerTitle,
      description: copy.loading.registerDescription,
      task: async () => {
        await humanResourcesApi.recordAttendanceKioskEvent({
          employee_id: payload.employeeId,
          event_type: payload.eventType,
          event_kind: payload.eventType,
          location_id: payload.locationId,
          kiosk_device_id: payload.kioskDeviceId,
          auth_method: payload.authMethod,
          face_verification_session_id: payload.faceVerificationSessionId,
          credential_payload: payload.credentialPayload,
          latitude: payload.latitude,
          longitude: payload.longitude,
          photo_url: payload.photoUrl,
          event_timestamp: payload.eventTimestamp,
        });

        await loadDashboard();
        await loadCalendar(payload.employeeId, calendarMonth);
      },
    });

    showSuccessToast(
      payload.eventType === 'check_in'
        ? copy.success.checkIn
        : payload.eventType === 'check_out'
          ? copy.success.checkOut
          : payload.eventType === 'break_out'
            ? (currentLanguage.code.startsWith('es') ? 'Salida a descanso registrada correctamente.' : 'Break-out recorded successfully.')
            : (currentLanguage.code.startsWith('es') ? 'Regreso de descanso registrado correctamente.' : 'Break-in recorded successfully.'),
    );
  };

  const requestRecorderGeolocation = async () => {
    setErrorMessage('');

    if (!('geolocation' in navigator)) {
      setErrorMessage(copy.recorder.locationUnsupported);
      return null;
    }

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 0,
      });
    }).catch((error: GeolocationPositionError) => {
      const nextMessage =
        error.code === error.PERMISSION_DENIED
          ? copy.recorder.locationDenied
          : copy.recorder.locationUnavailable;
      setErrorMessage(nextMessage);
      return null;
    });

    if (!position) {
      return null;
    }

    const nextLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setRecorderLocationState(nextLocation);
    return nextLocation;
  };

  const handleInlineAttendanceRecord = async (eventType: 'check_in' | 'check_out') => {
    if (!selectedItem) {
      setErrorMessage(copy.labels.noEmployeeSelected);
      return;
    }

    if (!attendancePhotoUpload.photo) {
      setErrorMessage(copy.recorder.photoRequiredError);
      return;
    }

    let coordinates = recorderLocationState;
    if (!coordinates) {
      coordinates = await requestRecorderGeolocation();
    }

    if (!coordinates) {
      return;
    }

    const eventTimestamp = localDateTimeString(new Date());

    await runMutation({
      title: copy.loading.registerTitle,
      description: copy.loading.registerDescription,
      task: async () => {
        const photoObjectKey = await attendancePhotoUpload.ensureUploaded({
          employee_id: selectedItem.employee_id,
          event_type: eventType,
          event_timestamp: eventTimestamp,
          content_type: attendancePhotoUpload.photo?.contentType ?? 'image/jpeg',
        });

        await humanResourcesApi.recordAttendanceKioskEvent({
          employee_id: selectedItem.employee_id,
          event_type: eventType,
          event_kind: eventType,
          location_id: recorderLocationId ? Number(recorderLocationId) : undefined,
          auth_method: 'manual_override',
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          photo_url: photoObjectKey,
          event_timestamp: eventTimestamp,
        });

        await loadDashboard();
        await loadCalendar(selectedItem.employee_id, calendarMonth);
      },
    });

    attendancePhotoUpload.clearPhoto();
    showSuccessToast(eventType === 'check_in' ? copy.success.checkIn : copy.success.checkOut);
  };

  const inlineRecorderReady = Boolean(selectedItem && attendancePhotoUpload.photo && recorderLocationState);
  const recorderDisabled = !selectedItem;

  const handleUpdateStatus = async (
    date: string,
    status: AttendanceCalendarDay['effective_status'] | '',
  ) => {
    if (!selectedEmployeeId) {
      return;
    }

    await runMutation({
      title: copy.loading.correctTitle,
      description: copy.loading.correctDescription,
      task: async () => {
        await humanResourcesApi.updateAttendanceDailyRecord(selectedEmployeeId, date, { status });
        await Promise.all([loadDashboard(), loadCalendar(selectedEmployeeId, calendarMonth)]);
      },
    });

    showSuccessToast(status ? copy.success.correctionApplied : copy.success.correctionCleared);
  };

  const handleEmployeeSelection = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setErrorMessage('');
  };

  const handleEmployeeStep = (direction: -1 | 1) => {
    if (selectedEmployeeIndex < 0) {
      return;
    }

    const nextEmployee = employeeOptions[selectedEmployeeIndex + direction];
    if (!nextEmployee) {
      return;
    }

    handleEmployeeSelection(nextEmployee.employee_id);
  };

  return (
    <>
      <LoadingBarOverlay
        isVisible={isSubmitting}
        title={overlayTitle}
        description={overlayDescription}
      />

      <SuccessToast
        isVisible={Boolean(successToastMessage)}
        message={successToastMessage}
        onClose={() => setSuccessToastMessage('')}
        className="left-1/2 right-auto top-5 bottom-auto z-[120] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2"
        durationMs={3600}
      />

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-300">
          <div className="flex items-center justify-between gap-3">
            <span>{errorMessage}</span>
            <Button variant="outline" size="sm" onClick={() => void loadDashboard()}>
              {copy.labels.retry}
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-6 rounded-lg border border-[#143675]/20 bg-[#143675]/5 p-6 dark:border-[#143675]/30 dark:bg-[#143675]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">📅</span>
              {copy.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {copy.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setIsRecordsOpen(true)} disabled={!selectedEmployeeId}>
              <View className="h-4 w-4" />
              {copy.viewRecords}
            </Button>
            <Button
              className="bg-[#143675] text-white hover:bg-[#0f2855]"
              onClick={() => {
                registrationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              {copy.markBlock}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {isLoadingDashboard ? (
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-40 rounded-lg" />
            </div>
          ) : selectedItem ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{copy.labels.collaborator}</p>
                    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{selectedItem.employee_name}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {selectedItem.position_title || selectedItem.department || copy.labels.unassignedPosition}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {selectedEmployeeOption?.employee_number || copy.labels.unassignedUnit}
                    </p>
                  </div>
                </div>

                {dashboard?.employees && dashboard.employees.length > 1 ? (
                  <select
                    value={selectedEmployeeId ? String(selectedEmployeeId) : ''}
                    onChange={(event) => handleEmployeeSelection(Number(event.target.value))}
                    className="min-w-[220px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#143675] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    {dashboard.employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.full_name}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{copy.recorder.photo}</h4>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{copy.recorder.photoRequired}</p>
                </div>

                <AttendancePhotoCaptureCard
                  title={copy.recorder.photo}
                  requiredText={copy.recorder.photoRequired}
                  takePhotoLabel={copy.recorder.takePhoto}
                  chooseFromGalleryLabel={copy.recorder.chooseFromGallery}
                  retakePhotoLabel={copy.recorder.retakePhoto}
                  captureLabel={copy.recorder.capturePhoto}
                  cancelLabel={copy.recorder.cancelCamera}
                  helperText={copy.recorder.photoHint}
                  photo={attendancePhotoUpload.photo}
                  disabled={recorderDisabled}
                  onPhotoChange={attendancePhotoUpload.setCapturedPhoto}
                  onError={setErrorMessage}
                  errors={{
                    cameraUnsupported: copy.recorder.cameraUnsupported,
                    cameraPermissionDenied: copy.recorder.cameraPermissionDenied,
                    cameraUnavailable: copy.recorder.cameraUnavailable,
                  }}
                />
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
              {copy.labels.noEmployeeSelected}
            </div>
          )}
        </div>

        <div ref={registrationRef} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{copy.recorder.location}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{copy.recorder.locationRequired}</p>
                </div>
              </div>
            </div>

            <select
              value={recorderLocationId}
              onChange={(event) => setRecorderLocationId(event.target.value)}
              disabled={recorderDisabled}
              className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#143675] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {dashboard?.locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>

            <Button
              type="button"
              variant="outline"
              className="mb-3 w-full gap-2"
              disabled={recorderDisabled}
              onClick={() => void requestRecorderGeolocation()}
            >
              <MapPin className="h-4 w-4" />
              {recorderLocationState ? copy.recorder.refreshLocation : copy.recorder.getLocation}
            </Button>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
              {recorderLocationState
                ? `${copy.recorder.locationReady}: ${recorderLocationState.latitude.toFixed(5)}, ${recorderLocationState.longitude.toFixed(5)}`
                : copy.recorder.noLocation}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">{copy.recorder.record}</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedItem ? copy.recorder.recordHint : copy.recorder.selectEmployeeHint}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                disabled={recorderDisabled || !inlineRecorderReady || isSubmitting}
                className="bg-[#143675] text-white hover:bg-[#0f2855] disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  void handleInlineAttendanceRecord('check_in');
                }}
              >
                {copy.recorder.checkIn}
              </Button>
              <Button
                type="button"
                disabled={recorderDisabled || !inlineRecorderReady || isSubmitting}
                className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  void handleInlineAttendanceRecord('check_out');
                }}
              >
                {copy.recorder.checkOut}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isRecordsOpen} onOpenChange={setIsRecordsOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{copy.viewRecords}</DialogTitle>
          </DialogHeader>
          {selectedEmployeeId && calendar ? (
            <CalendarioAsistencia
              colaboradorNombre={calendar.employee.full_name}
              month={calendarMonth}
              days={calendar.items}
              isLoading={isLoadingCalendar}
              onMonthChange={setCalendarMonth}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              {copy.labels.noEmployeeSelected}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {dashboard ? (
        <KioskModal
          isOpen={isKioskOpen}
          onClose={() => setIsKioskOpen(false)}
          colaboradores={dashboard.employees.map((employee) => ({
            id: employee.id,
            nombre: employee.full_name,
            puesto: employee.position_title || employee.department || copy.labels.unassignedPosition,
            codigo: employee.employee_number,
          }))}
          registeredLocations={dashboard.locations}
          onSubmit={handleKioskSubmit}
        />
      ) : null}
    </>
  );
}
