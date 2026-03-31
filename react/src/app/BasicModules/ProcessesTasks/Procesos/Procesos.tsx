import { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  PlayCircle,
  Plus,
  Repeat2,
  Search,
  ShieldCheck,
  Settings2,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ProcessFrequency, RecurringProcess, recurringProcesses } from '../mockData';

const getStatusClasses = (status: RecurringProcess['status']) => {
  const styles = {
    Estable: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'En seguimiento': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    Critico: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return styles[status];
};

const getAutomationClasses = (automation: RecurringProcess['automation']) => {
  const styles = {
    Manual: 'text-gray-600 dark:text-gray-300',
    Mixto: 'text-blue-600 dark:text-blue-400',
    Automatizado: 'text-green-600 dark:text-green-400',
  };

  return styles[automation];
};

export default function Procesos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState<'Todos' | ProcessFrequency>('Todos');
  const [selectedProcessId, setSelectedProcessId] = useState(recurringProcesses[0]?.id ?? 1);

  const filteredProcesses = recurringProcesses.filter((process) => {
    const matchesSearch =
      process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      process.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      process.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFrequency = frequencyFilter === 'Todos' || process.frequency === frequencyFilter;

    return matchesSearch && matchesFrequency;
  });

  const selectedProcess =
    filteredProcesses.find((process) => process.id === selectedProcessId) ?? filteredProcesses[0] ?? null;

  const complianceAverage = Math.round(
    recurringProcesses.reduce((sum, process) => sum + process.compliance, 0) / recurringProcesses.length,
  );
  const automatedCount = recurringProcesses.filter(
    (process) => process.automation === 'Automatizado',
  ).length;
  const criticalCount = recurringProcesses.filter((process) => process.status === 'Critico').length;

  return (
    <>
      <div className="bg-[rgb(235,165,52)]/10 dark:bg-[rgb(235,165,52)]/15 rounded-lg p-6 mb-6 border border-[rgb(235,165,52)]/30 dark:border-[rgb(235,165,52)]/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Procesos recurrentes
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Da seguimiento a cumplimiento, automatizacion, pasos criticos y cuellos de botella.
            </p>
          </div>
          <Button className="bg-[rgb(235,165,52)] hover:bg-[rgb(214,144,35)] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nuevo proceso
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cumplimiento promedio</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{complianceAverage}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Procesos ejecutados dentro de meta</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Automatizados</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{automatedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Con ejecucion mayormente automatica</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Criticos</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{criticalCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Requieren intervencion inmediata</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Frecuencias activas</p>
          <p className="text-3xl font-bold text-[rgb(235,165,52)]">4</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Diario, semanal, quincenal y mensual</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Buscar proceso
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Nombre, area o responsable"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Frecuencia
            </label>
            <select
              value={frequencyFilter}
              onChange={(event) =>
                setFrequencyFilter(event.target.value as 'Todos' | ProcessFrequency)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Todos">Todos</option>
              <option value="Diario">Diario</option>
              <option value="Semanal">Semanal</option>
              <option value="Quincenal">Quincenal</option>
              <option value="Mensual">Mensual</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Proceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Frecuencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cumplimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProcesses.map((process) => (
                  <tr
                    key={process.id}
                    onClick={() => setSelectedProcessId(process.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedProcess?.id === process.id
                        ? 'bg-[rgb(235,165,52)]/10 dark:bg-[rgb(235,165,52)]/15'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{process.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {process.owner} · {process.area}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{process.frequency}</td>
                    <td className="px-6 py-4">
                      <div className="min-w-[140px]">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Meta</span>
                          <span className="font-medium text-gray-900 dark:text-white">{process.compliance}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[rgb(235,165,52)] rounded-full"
                            style={{ width: `${process.compliance}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(
                            process.status,
                          )}`}
                        >
                          {process.status}
                        </span>
                        <p className={`text-xs font-medium ${getAutomationClasses(process.automation)}`}>
                          {process.automation}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProcesses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
                      No hay procesos que coincidan con los filtros actuales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          {selectedProcess && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedProcess.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedProcess.description}
                  </p>
                </div>
                <Settings2 className="h-5 w-5 text-[rgb(235,165,52)]" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Repeat2 className="h-4 w-4" />
                    Siguiente corrida
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedProcess.nextRun}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" />
                    Ultima corrida
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedProcess.lastRun}</p>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Pasos del proceso</h4>
                <div className="space-y-3">
                  {selectedProcess.steps.map((step) => (
                    <div
                      key={step.id}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{step.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {step.owner} · SLA {step.sla}
                          </p>
                        </div>
                        <ShieldCheck
                          className={`h-4 w-4 ${
                            step.complete ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-100 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span>{selectedProcess.bottleneck}</span>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Automatizacion sugerida
            </h3>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-4">
              <div className="flex items-center gap-2 text-[rgb(235,165,52)] mb-2">
                <Bot className="h-4 w-4" />
                <span className="text-sm font-medium">Siguiente oportunidad</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Prioriza formularios y aprobaciones repetitivas donde el proceso sigue siendo manual y el SLA ya esta en riesgo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
