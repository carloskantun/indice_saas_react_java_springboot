import { useState } from 'react';
import { AlertTriangle, ArrowRight, FolderOpen, Plus, Search, Target, Users } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ProcessProject, processProjects } from '../mockData';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

const getStatusClasses = (status: ProcessProject['status']) => {
  const styles = {
    'En ejecucion': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'En riesgo': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    Planeacion: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    Cerrado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  return styles[status];
};

const getMilestoneClasses = (status: 'Listo' | 'En curso' | 'Pendiente') => {
  const styles = {
    Listo: 'text-green-600 dark:text-green-400',
    'En curso': 'text-blue-600 dark:text-blue-400',
    Pendiente: 'text-gray-500 dark:text-gray-400',
  };

  return styles[status];
};

export default function Proyectos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | ProcessProject['status']>('Todos');
  const [selectedProjectId, setSelectedProjectId] = useState(processProjects[0]?.id ?? 1);

  const filteredProjects = processProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedProject =
    filteredProjects.find((project) => project.id === selectedProjectId) ?? filteredProjects[0] ?? null;

  const activeCount = processProjects.filter((project) => project.status === 'En ejecucion').length;
  const riskCount = processProjects.filter((project) => project.status === 'En riesgo').length;
  const totalBudget = processProjects.reduce((sum, project) => sum + project.budget, 0);
  const averageProgress = Math.round(
    processProjects.reduce((sum, project) => sum + project.progress, 0) / processProjects.length,
  );

  return (
    <>
      <div className="bg-[rgb(235,165,52)]/10 dark:bg-[rgb(235,165,52)]/15 rounded-lg p-6 mb-6 border border-[rgb(235,165,52)]/30 dark:border-[rgb(235,165,52)]/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Portafolio de proyectos
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Controla avance, presupuesto, riesgos y entregables de iniciativas transversales.
            </p>
          </div>
          <Button className="bg-[rgb(235,165,52)] hover:bg-[rgb(214,144,35)] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nuevo proyecto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En ejecucion</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Proyectos activos con equipo asignado</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En riesgo</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{riskCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Necesitan decisiones o soporte extra</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Presupuesto</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {currencyFormatter.format(totalBudget)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Iniciativas registradas en el modulo</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avance promedio</p>
          <p className="text-3xl font-bold text-[rgb(235,165,52)]">{averageProgress}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Madurez general del portafolio</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Buscar proyecto
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Nombre, area o lider"
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
                setStatusFilter(event.target.value as 'Todos' | ProcessProject['status'])
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Todos">Todos</option>
              <option value="En ejecucion">En ejecucion</option>
              <option value="En riesgo">En riesgo</option>
              <option value="Planeacion">Planeacion</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className={`text-left bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 transition-all ${
                selectedProject?.id === project.id
                  ? 'border-[rgb(235,165,52)] ring-2 ring-[rgb(235,165,52)]/25'
                  : 'border-gray-200 dark:border-gray-700 hover:border-[rgb(235,165,52)]/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.summary}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(
                    project.status,
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Equipo
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{project.team} personas</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Lider
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{project.owner}</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Avance</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[rgb(235,165,52)] rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Entrega {project.dueDate}</span>
                <span>{currencyFormatter.format(project.spent)} usados</span>
              </div>
            </button>
          ))}
          {filteredProjects.length === 0 && (
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-10 text-sm text-gray-500 dark:text-gray-400">
              No hay proyectos que coincidan con los filtros actuales.
            </div>
          )}
        </div>

        <div className="space-y-6">
          {selectedProject && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedProject.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedProject.area}</p>
                </div>
                <Target className="h-5 w-5 text-[rgb(235,165,52)]" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400">Presupuesto</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {currencyFormatter.format(selectedProject.budget)}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400">Siguiente entrega</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {selectedProject.nextDeliverable}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Hitos principales
                </h4>
                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {milestone.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {milestone.owner} · {milestone.dueDate}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold ${getMilestoneClasses(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Riesgos y alertas
                </h4>
                <div className="space-y-2">
                  {selectedProject.risks.map((risk) => (
                    <div
                      key={risk}
                      className="rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-sm text-amber-900 dark:text-amber-100 flex items-start gap-2"
                    >
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Proxima accion sugerida
            </h3>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-4">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Asegura que cada proyecto en riesgo tenga un responsable de desbloqueo y fecha de decision visible.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[rgb(235,165,52)]">
                <ArrowRight className="h-4 w-4" />
                Publicar semaforo en la reunion semanal
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
