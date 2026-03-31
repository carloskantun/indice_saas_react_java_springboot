import { useState } from 'react';
import { MapPin, Clock3, ScanFace, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { HorariosModal } from '../../../components/HorariosModal';
import { KioskModal } from '../../../components/KioskModal';
import { LocationRegistrationModal } from '../../../components/LocationRegistrationModal';
import { rhColaboradores, rhRegisteredLocationsSeed } from '../mockData';

interface RegisteredLocation {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  radio: number;
  enlaceGoogleMaps?: string;
  altitud?: string;
}

export default function Control() {
  const [isKioskOpen, setIsKioskOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isHorariosOpen, setIsHorariosOpen] = useState(false);
  const [registeredLocations, setRegisteredLocations] = useState<RegisteredLocation[]>(
    rhRegisteredLocationsSeed,
  );

  return (
    <>
      <div className="bg-[#143675]/5 dark:bg-[#143675]/10 rounded-lg p-6 mb-6 border border-[#143675]/20 dark:border-[#143675]/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              Control de asistencia
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configura kiosco, horarios y ubicaciones para mantener el control operativo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-[#143675] text-[#143675] hover:bg-[#143675] hover:text-white"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <MapPin className="h-4 w-4" />
              Ubicaciones
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-[#143675] text-[#143675] hover:bg-[#143675] hover:text-white"
              onClick={() => setIsHorariosOpen(true)}
            >
              <Clock3 className="h-4 w-4" />
              Horarios
            </Button>
            <Button className="bg-[#143675] hover:bg-[#0f2855] text-white gap-2" onClick={() => setIsKioskOpen(true)}>
              <ScanFace className="h-4 w-4" />
              Abrir kiosco
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kiosco activo</p>
          <p className="text-3xl font-bold text-[#143675] dark:text-[#4a7bc8]">1</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Punto de registro habilitado</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ubicaciones</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{registeredLocations.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Geocercas configuradas</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Horarios</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{rhColaboradores.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Colaboradores configurables</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reglas activas</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Foto, ubicacion y horario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Ubicaciones registradas
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {registeredLocations.map((location) => (
              <div key={location.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{location.nombre}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {location.latitud}, {location.longitud}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{location.radio} m</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Radio de control</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-[#143675]/10 dark:bg-[#143675]/20 flex items-center justify-center">
                <ScanFace className="h-5 w-5 text-[#143675] dark:text-[#4a7bc8]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Kiosco</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Registro de ingreso y salida</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Mantiene el flujo presencial con foto, ubicacion y tipo de registro.
            </p>
            <Button className="w-full bg-[#143675] hover:bg-[#0f2855] text-white" onClick={() => setIsKioskOpen(true)}>
              Abrir kiosco de asistencia
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Politicas activas</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Controles que protegen la operacion</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Registro con fotografia habilitado</li>
              <li>• Validacion por ubicacion disponible</li>
              <li>• Control por horario configurable</li>
            </ul>
          </div>
        </div>
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
