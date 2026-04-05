import { useMemo, useState } from 'react';
import { CalendarDays, Clock3, Link2, MapPin, ScanFace } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { CalendarioAsistencia } from '../../../components/CalendarioAsistencia';
import { HorariosModal } from '../../../components/HorariosModal';
import { KioskModal } from '../../../components/KioskModal';
import { LocationRegistrationModal } from '../../../components/LocationRegistrationModal';
import { useHRLanguage } from '../HRLanguage';
import { rhAsistenciaHoySeed, rhColaboradores, rhRegisteredLocationsSeed } from '../mockData';
import { useLanguage } from '../../../shared/context';

interface RegisteredLocation {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  radio: number;
  enlaceGoogleMaps?: string;
  altitud?: string;
}

const exitTimesByEmployeeId: Record<number, string | null> = {
  1: '6:17 PM',
  2: '7:28 PM',
  3: null,
  4: null,
  5: '5:58 PM',
  6: null,
};

const thumbnailByEmployeeId: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80',
  2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80',
  3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=96&q=80',
  4: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=96&q=80',
  5: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=80',
  6: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80',
};

export default function Attendance() {
  const t = useHRLanguage();
  const { currentLanguage } = useLanguage();
  const [selectedColaboradorId, setSelectedColaboradorId] = useState(rhAsistenciaHoySeed[0]?.id ?? 1);
  const [isKioskOpen, setIsKioskOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isHorariosOpen, setIsHorariosOpen] = useState(false);
  const [registeredLocations, setRegisteredLocations] = useState<RegisteredLocation[]>(
    rhRegisteredLocationsSeed,
  );

  const attendanceRows = useMemo(
    () =>
      rhAsistenciaHoySeed.map((row) => {
        const collaborator = rhColaboradores.find((item) => item.id === row.id);
        const hasEntry = row.estado !== 'Permiso' && row.estado !== 'Descanso';
        const hasExit = Boolean(exitTimesByEmployeeId[row.id]);

        return {
          ...row,
          collaborator,
          entrada: hasEntry ? `${row.hora} AM` : null,
          salida: exitTimesByEmployeeId[row.id],
          photoUrl: thumbnailByEmployeeId[row.id] ?? thumbnailByEmployeeId[1],
        };
      }),
    [],
  );

  const selectedColaborador =
    attendanceRows.find((row) => row.id === selectedColaboradorId)?.collaborator ?? rhColaboradores[0];

  const attendanceDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(currentLanguage.code, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(2026, 2, 16)),
    [currentLanguage.code],
  );

  const handleCopyKioskLink = async () => {
    const kioskLink = `${window.location.origin}${window.location.pathname}#attendance-kiosk`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(kioskLink);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = kioskLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      window.alert(t.control.kioskLinkCopied);
    } catch {
      window.alert(kioskLink);
    }
  };

  return (
    <>
      <div className="rounded-lg border border-[#143675]/20 bg-[#143675]/5 p-6 dark:border-[#143675]/30 dark:bg-[#143675]/10 mb-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">📅</span>
              {t.control.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.control.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-[#143675] text-[#143675] hover:bg-[#143675] hover:text-white dark:border-[#4a7bc8] dark:text-white dark:hover:bg-[#143675]"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <MapPin className="h-4 w-4" />
              {t.control.registerLocations}
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-[#143675] text-[#143675] hover:bg-[#143675] hover:text-white dark:border-[#4a7bc8] dark:text-white dark:hover:bg-[#143675]"
              onClick={() => setIsHorariosOpen(true)}
            >
              <CalendarDays className="h-4 w-4" />
              {t.control.schedules}
            </Button>
            <Button className="gap-2 bg-[#143675] text-white hover:bg-[#0f2855]" onClick={() => setIsKioskOpen(true)}>
              <ScanFace className="h-4 w-4" />
              {t.control.kiosk}
            </Button>
            <Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleCopyKioskLink}>
              <Link2 className="h-4 w-4" />
              {t.control.kioskLink}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.control.dailyAttendance}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{attendanceDateLabel}</p>
          </div>

          <div className="max-h-[640px] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
            {attendanceRows.map((row) => {
              const isSelected = row.id === selectedColaboradorId;

              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setSelectedColaboradorId(row.id)}
                  className={`w-full px-4 py-4 text-left transition-colors ${
                    isSelected
                      ? 'bg-[#143675]/8 dark:bg-[#143675]/15'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                  }`}
                >
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {row.colaborador}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {row.collaborator?.puesto ?? `Unidad ${row.unidad}`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {t.control.entry}
                      </p>
                      {row.entrada ? (
                        <>
                          <p className="mt-1 text-sm font-semibold text-green-500">{row.entrada}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <img
                              src={row.photoUrl}
                              alt={row.colaborador}
                              className="h-7 w-7 rounded object-cover"
                            />
                            <span className="text-xs font-medium text-[#4a7bc8]">{t.control.location}</span>
                          </div>
                        </>
                      ) : (
                        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{t.control.noRecord}</p>
                      )}
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {t.control.exit}
                      </p>
                      {row.salida ? (
                        <>
                          <p className="mt-1 text-sm font-semibold text-[#4a7bc8]">{row.salida}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <img
                              src={row.photoUrl}
                              alt={row.colaborador}
                              className="h-7 w-7 rounded object-cover"
                            />
                            <span className="text-xs font-medium text-[#4a7bc8]">{t.control.location}</span>
                          </div>
                        </>
                      ) : (
                        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{t.control.noRecord}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="min-w-0">
          <CalendarioAsistencia colaboradorNombre={selectedColaborador?.nombre ?? t.control.attendanceCalendar} />
        </section>
      </div>

      <KioskModal
        isOpen={isKioskOpen}
        onClose={() => setIsKioskOpen(false)}
        colaboradores={rhColaboradores.map(({ id, nombre, puesto, codigo }) => ({
          id,
          nombre,
          puesto,
          codigo,
        }))}
        registeredLocations={registeredLocations}
      />

      <LocationRegistrationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={(locations) => setRegisteredLocations(locations)}
        initialLocations={registeredLocations}
      />

      <HorariosModal
        isOpen={isHorariosOpen}
        onClose={() => setIsHorariosOpen(false)}
        colaboradores={rhColaboradores.map(({ id, nombre, puesto, codigo, departamento }) => ({
          id,
          nombre,
          puesto,
          codigo,
          departamento,
        }))}
      />
    </>
  );
}
