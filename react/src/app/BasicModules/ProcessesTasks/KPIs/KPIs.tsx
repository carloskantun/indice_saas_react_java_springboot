import { Activity, AlertTriangle, BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { ProcessKPI, processKpis, recurringProcesses } from '../mockData';

const getStatusClasses = (status: ProcessKPI['status']) => {
  const styles = {
    'Sobre meta': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'En rango': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Atencion: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return styles[status];
};

const getKpiProgress = (kpi: ProcessKPI) => {
  if (kpi.id === 'cycle-time') {
    return Math.min(100, Math.round((kpi.target / kpi.current) * 100));
  }

  if (kpi.id === 'risk-incidents') {
    return Math.min(100, Math.round((kpi.target / Math.max(kpi.current, 1)) * 100));
  }

  return Math.min(100, Math.round((kpi.current / kpi.target) * 100));
};

export default function KPIs() {
  const aboveTargetCount = processKpis.filter((kpi) => kpi.status === 'Sobre meta').length;
  const attentionCount = processKpis.filter((kpi) => kpi.status === 'Atencion').length;
  const automationAverage = Math.round(
    recurringProcesses.reduce((sum, process) => sum + process.compliance, 0) / recurringProcesses.length,
  );
  const disciplineKpi = processKpis.find((kpi) => kpi.id === 'meeting-discipline');

  return (
    <>
      <div className="bg-[rgb(235,165,52)]/10 dark:bg-[rgb(235,165,52)]/15 rounded-lg p-6 mb-6 border border-[rgb(235,165,52)]/30 dark:border-[rgb(235,165,52)]/40">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          KPIs operativos
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visualiza cumplimiento, tiempos de ciclo, disciplina operativa y procesos en atencion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sobre meta</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{aboveTargetCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Indicadores con desempeno superior</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En atencion</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{attentionCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Necesitan accion correctiva visible</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cumplimiento procesos</p>
          <p className="text-3xl font-bold text-[rgb(235,165,52)]">{automationAverage}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Promedio del tablero de ejecucion</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Disciplina operativa</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {disciplineKpi?.current ?? 0}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Asistencia y seguimiento de rituales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {processKpis.map((kpi) => {
            const progress = getKpiProgress(kpi);
            const TrendIcon = kpi.direction === 'up' ? TrendingUp : TrendingDown;

            return (
              <div
                key={kpi.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {kpi.area}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {kpi.title}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(
                      kpi.status,
                    )}`}
                  >
                    {kpi.status}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {kpi.current}
                      {kpi.unit}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Meta {kpi.target}
                      {kpi.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[rgb(235,165,52)]">
                    <TrendIcon className="h-4 w-4" />
                    <span>{kpi.trend}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Progreso a meta</span>
                    <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[rgb(235,165,52)] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">{kpi.summary}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-[rgb(235,165,52)]" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Lectura ejecutiva</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-4">
                <p className="font-medium text-gray-900 dark:text-white">Fortaleza</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  El cierre de tareas y la disciplina de rituales estan mostrando mejor estabilidad.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-4">
                <p className="font-medium text-gray-900 dark:text-white">Foco rojo</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  El SLA de aprobaciones y los procesos con incidencias siguen fuera del objetivo.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-[rgb(235,165,52)]" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Alertas activas</h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-900 dark:text-red-100 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span>Revisar cadena de firmas en compras antes del cierre semanal.</span>
              </div>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-100 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span>Actualizar estatus de mantenimiento preventivo en las unidades restantes.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
