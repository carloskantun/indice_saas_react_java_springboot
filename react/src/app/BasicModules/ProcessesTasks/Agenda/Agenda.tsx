import { useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ProcessAgendaItem, processAgendaItems } from '../mockData';

const getStatusClasses = (status: ProcessAgendaItem['status']) => {
  const styles = {
    'En curso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Pendiente: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'En riesgo': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    Completada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  return styles[status];
};

const getPriorityClasses = (priority: ProcessAgendaItem['priority']) => {
  const styles = {
    Alta: 'text-red-600 dark:text-red-400',
    Media: 'text-amber-600 dark:text-amber-400',
    Baja: 'text-emerald-600 dark:text-emerald-400',
  };

  return styles[priority];
};

export default function Agenda() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | ProcessAgendaItem['status']>('Todos');
  const [selectedTaskId, setSelectedTaskId] = useState(processAgendaItems[0]?.id ?? 1);

  const filteredTasks = processAgendaItems.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedTask =
    filteredTasks.find((task) => task.id === selectedTaskId) ?? filteredTasks[0] ?? null;

  const dueTodayCount = processAgendaItems.filter((task) => task.dueDate === 'Hoy').length;
  const riskCount = processAgendaItems.filter((task) => task.status === 'En riesgo').length;
  const completedCount = processAgendaItems.filter((task) => task.status === 'Completada').length;
  const highPriorityCount = processAgendaItems.filter((task) => task.priority === 'Alta').length;

  return (
    <>
      <div className="bg-[rgb(235,165,52)]/10 dark:bg-[rgb(235,165,52)]/15 rounded-lg p-6 mb-6 border border-[rgb(235,165,52)]/30 dark:border-[rgb(235,165,52)]/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Agenda operativa
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Prioriza tareas del dia, visibilidad de bloqueos y responsables por proyecto.
            </p>
          </div>
          <Button className="bg-[rgb(235,165,52)] hover:bg-[rgb(214,144,35)] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nueva tarea
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tareas del dia</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{dueTodayCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Requieren seguimiento antes del cierre</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Alta prioridad</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{highPriorityCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Impactan SLA o entregables clave</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En riesgo</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{riskCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Necesitan desbloqueo o escalamiento</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completadas</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Cierre documentado en el tablero</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Buscar tarea
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Titulo, proyecto o responsable"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as 'Todos' | ProcessAgendaItem['status'])
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Todos">Todos</option>
              <option value="En curso">En curso</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En riesgo">En riesgo</option>
              <option value="Completada">Completada</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Agenda priorizada</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`w-full text-left px-6 py-4 transition-colors ${
                  selectedTask?.id === task.id
                    ? 'bg-[rgb(235,165,52)]/10 dark:bg-[rgb(235,165,52)]/15'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(
                          task.status,
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {task.owner}
                      </span>
                      <span>{task.project}</span>
                      <span>{task.area}</span>
                    </div>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.startTime} · {task.duration}
                    </p>
                    <p className={`text-xs font-medium mt-1 ${getPriorityClasses(task.priority)}`}>
                      Prioridad {task.priority}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Entrega {task.dueDate}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {filteredTasks.length === 0 && (
              <div className="px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
                No hay tareas que coincidan con los filtros actuales.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {selectedTask && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedTask.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedTask.project}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(
                    selectedTask.status,
                  )}`}
                >
                  {selectedTask.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Entrega
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedTask.dueDate}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    Horario
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {selectedTask.startTime} · {selectedTask.duration}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400">Responsable</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedTask.owner}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400">Ubicacion</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedTask.location}</p>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Checklist</h4>
                <div className="space-y-2">
                  {selectedTask.checklist.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-lg bg-gray-50 dark:bg-gray-700/40 px-3 py-2"
                    >
                      <CheckCircle2
                        className={`h-4 w-4 mt-0.5 ${
                          item.done ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`}
                      />
                      <p className="text-sm text-gray-700 dark:text-gray-200">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Bloqueos activos
                </h4>
                {selectedTask.blockers.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTask.blockers.map((blocker) => (
                      <div
                        key={blocker}
                        className="rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-sm text-amber-900 dark:text-amber-100 flex items-start gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 mt-0.5" />
                        <span>{blocker}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Esta tarea no tiene bloqueos reportados.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
