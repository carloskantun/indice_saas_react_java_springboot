import { useEffect, useMemo, useState } from 'react';
import { Camera, CalendarDays, Clock3, MapPin, User } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { rhColaboradores } from '../mockData';
import { useHRLanguage } from '../HRLanguage';
import { useLanguage } from '../../../shared/context';

export default function Control() {
  const t = useHRLanguage();
  const { currentLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEmployeeId] = useState(rhColaboradores[0]?.id ?? 1);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedEmployee =
    rhColaboradores.find((employee) => employee.id === selectedEmployeeId) ?? rhColaboradores[0];

  const canRegister = hasPhoto && hasLocation;

  const actionTime = useMemo(
    () =>
      currentTime.toLocaleTimeString(currentLanguage.code, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    [currentLanguage.code, currentTime],
  );

  const handleRegister = (type: 'entrada' | 'salida') => {
    if (!canRegister || !selectedEmployee) {
      return;
    }

    window.alert(
      type === 'entrada'
        ? t.attendance.successEntry(selectedEmployee.nombre, actionTime)
        : t.attendance.successExit(selectedEmployee.nombre, actionTime),
    );
  };

  return (
    <>
      <div className="mb-6 rounded-lg border border-[#143675]/20 bg-[#143675]/5 p-6 dark:border-[#143675]/30 dark:bg-[#143675]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">⏰</span>
              {t.attendance.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.attendance.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-[#143675]/30 bg-white/70 text-[#143675] hover:bg-[#143675] hover:text-white dark:border-[#4a7bc8]/30 dark:bg-gray-800/50 dark:text-white"
            >
              <CalendarDays className="h-4 w-4" />
              {t.attendance.viewRecords}
            </Button>
            <Button className="gap-2 bg-[#3121a8] text-white hover:bg-[#261882]">
              <Clock3 className="h-4 w-4" />
              {t.attendance.markBlock}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-xl border border-gray-200 bg-white/95 shadow-sm dark:border-gray-700 dark:bg-gray-800/95">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#143675]/10 text-[#3867ff] dark:bg-[#143675]/20 dark:text-[#7aa2ff]">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  {t.attendance.collaborator}
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEmployee?.nombre}
                </p>
                <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                  {selectedEmployee?.correo}
                </p>
              </div>
            </div>

            <div className="my-5 border-t border-gray-200 dark:border-gray-700" />

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <span className="text-base">📷</span>
                  {t.attendance.photo}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{t.attendance.photoRequired}</span>
              </div>

              <button
                type="button"
                onClick={() => setHasPhoto((current) => !current)}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                  hasPhoto
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
                >
                  <Camera className="h-4 w-4" />
                  {hasPhoto ? `✓ ${t.attendance.photoTaken}` : t.attendance.takePhoto}
                </button>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                {t.attendance.photoTip}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white/95 shadow-sm dark:border-gray-700 dark:bg-gray-800/95">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-gray-900 dark:text-white">{t.attendance.location}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.attendance.locationRequired}</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <button
                type="button"
                onClick={() => setHasLocation((current) => !current)}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                  hasLocation
                    ? 'border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white dark:hover:bg-gray-700'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
                >
                  <MapPin className="h-4 w-4" />
                  {hasLocation ? `✓ ${t.attendance.locationObtained}` : t.attendance.getLocation}
                </button>

              <div
                className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                  hasLocation
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-700/40 dark:text-gray-400'
                }`}
                >
                {hasLocation ? `✓ ${t.attendance.locationObtained}` : `✓ ${t.attendance.noLocation}`}
              </div>
            </div>

            <div className="my-5 border-t border-gray-200 dark:border-gray-700" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <span className="text-base">🕒</span>
                {t.attendance.register}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t.attendance.registerHint}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                onClick={() => handleRegister('entrada')}
                disabled={!canRegister}
                className="h-12 bg-[#3121a8] text-white hover:bg-[#261882] disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
              >
                ⏱ {t.attendance.entry}
              </Button>
              <Button
                onClick={() => handleRegister('salida')}
                disabled={!canRegister}
                className="h-12 bg-[#06c63f] text-white hover:bg-[#05a635] disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
              >
                🏁 {t.attendance.exit}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
