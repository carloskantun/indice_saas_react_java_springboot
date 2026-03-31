import { useState } from 'react';
import { Search, Clock, CalendarDays, AlertCircle, Coffee } from 'lucide-react';
import { CalendarioAsistencia } from '../../../components/CalendarioAsistencia';
import { rhAsistenciaHoySeed, rhColaboradores } from '../mockData';

const getAttendanceBadge = (estado: string) => {
  const styles: Record<string, string> = {
    'A tiempo': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Retardo: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Permiso: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Descanso: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return styles[estado] || styles['Descanso'];
};

export default function Asistencia() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColaboradorId, setSelectedColaboradorId] = useState(rhColaboradores[0]?.id ?? 1);

  const filteredRows = rhAsistenciaHoySeed.filter((row) =>
    row.colaborador.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const selectedColaborador =
    rhColaboradores.find((colaborador) => colaborador.id === selectedColaboradorId) ??
    rhColaboradores[0];

  const onTimeCount = rhAsistenciaHoySeed.filter((row) => row.estado === 'A tiempo').length;
  const lateCount = rhAsistenciaHoySeed.filter((row) => row.estado === 'Retardo').length;
  const leaveCount = rhAsistenciaHoySeed.filter((row) => row.estado === 'Permiso').length;
  const restCount = rhAsistenciaHoySeed.filter((row) => row.estado === 'Descanso').length;

  return (
    <>
      <div className="bg-[#143675]/5 dark:bg-[#143675]/10 rounded-lg p-6 mb-6 border border-[#143675]/20 dark:border-[#143675]/30">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <span className="text-2xl">📅</span>
          Asistencia
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monitorea puntualidad, permisos y comportamiento diario del equipo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">A tiempo</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{onTimeCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Entradas dentro de horario</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Retardos</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{lateCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Incidencias del dia</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Permisos</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{leaveCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ausencias autorizadas</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Descanso</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{restCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Sin turno programado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Buscar colaborador
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Nombre del colaborador"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Registro de hoy
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRows.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelectedColaboradorId(row.id)}
                  className={`w-full text-left px-6 py-4 transition-colors ${
                    selectedColaboradorId === row.id
                      ? 'bg-[#143675]/5 dark:bg-[#143675]/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{row.colaborador}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Unidad {row.unidad}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{row.hora}</p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getAttendanceBadge(
                          row.estado,
                        )}`}
                      >
                        {row.estado}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedColaborador && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Resumen del colaborador
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Puesto
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedColaborador.puesto}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Ingreso
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedColaborador.fechaIngreso}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Departamento
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedColaborador.departamento}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Estado
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedColaborador.estado}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-2">
          {selectedColaborador && (
            <CalendarioAsistencia colaboradorNombre={selectedColaborador.nombre} />
          )}
        </div>
      </div>
    </>
  );
}
