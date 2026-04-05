import { useMemo, useState } from 'react';
import { Download, Eye, Pencil, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { NuevaActaModal } from '../../../components/NuevaActaModal';
import { Button } from '../../../components/ui/button';
import { useHRLanguage } from '../HRLanguage';
import { RHActaRegistro, rhColaboradores } from '../mockData';

interface RecordRow extends RHActaRegistro {
  title: string;
  statusLabel: 'Revisado' | 'Resuelto' | 'Pendiente';
}

const seedRecords: RecordRow[] = [
  {
    id: 'ACT-2024-001',
    colaborador: 'Diana Moreno Castro',
    tipo: 'Observacion',
    gravedad: 'Media',
    fecha: '15 Mar 2026',
    estado: 'Pendiente',
    title: 'Retardo injustificado',
    statusLabel: 'Revisado',
  },
  {
    id: 'ACT-2024-002',
    colaborador: 'Angelica Nohemi Guillermo sanchez',
    tipo: 'Reconocimiento',
    gravedad: 'Baja',
    fecha: '10 Mar 2026',
    estado: 'Cerrada',
    title: 'Excelente desempeño mensual',
    statusLabel: 'Resuelto',
  },
  {
    id: 'ACT-2024-003',
    colaborador: 'Barsain Diaz Dominguez',
    tipo: 'Incidente',
    gravedad: 'Baja',
    fecha: '05 Mar 2026',
    estado: 'Cerrada',
    title: 'Accidente laboral menor',
    statusLabel: 'Resuelto',
  },
  {
    id: 'ACT-2024-004',
    colaborador: 'Cristina Castellanos Hernandez',
    tipo: 'Sancion',
    gravedad: 'Alta',
    fecha: '28 Feb 2026',
    estado: 'Pendiente',
    title: 'Incumplimiento de protocolo',
    statusLabel: 'Pendiente',
  },
];

const displayTypeByRecordType: Record<string, string> = {
  Reconocimiento: 'Reconocimiento',
  Observacion: 'Amonestación',
  Sancion: 'Sanción',
  Incidente: 'Incidente',
};

const typeBadgeClasses: Record<string, string> = {
  Reconocimiento: 'bg-emerald-500/15 text-emerald-400',
  Amonestación: 'bg-amber-500/15 text-amber-400',
  Incidente: 'bg-red-500/15 text-red-400',
  Sanción: 'bg-rose-500/15 text-rose-400',
};

const typeEmojiByLabel: Record<string, string> = {
  Reconocimiento: '🌟',
  Amonestación: '⚠️',
  Incidente: '🚨',
  Sanción: '🔴',
};

const severityClasses: Record<RHActaRegistro['gravedad'], string> = {
  Baja: 'bg-emerald-500/15 text-emerald-400',
  Media: 'bg-amber-500/15 text-amber-400',
  Alta: 'bg-rose-500/15 text-rose-400',
};

const statusClasses: Record<RecordRow['statusLabel'], string> = {
  Revisado: 'bg-[#5c7cff]/15 text-[#90a1ff]',
  Resuelto: 'bg-emerald-500/15 text-emerald-400',
  Pendiente: 'bg-slate-500/20 text-slate-300',
};

const typeFilterOptions = ['Todos los tipos', 'Reconocimiento', 'Amonestación', 'Incidente', 'Sanción'] as const;
const severityFilterOptions = ['Todos los niveles', 'Baja', 'Media', 'Alta'] as const;
const statusFilterOptions = ['Todos los estados', 'Revisado', 'Resuelto', 'Pendiente'] as const;

const formatInputDate = (value: string) => {
  if (!value) {
    return '';
  }

  const [day, month, year] = value.split(' ');
  const monthIndex = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].indexOf(
    month,
  );

  if (monthIndex === -1 || !day || !year) {
    return '';
  }

  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const normalizeStatusLabel = (status: RHActaRegistro['estado']): RecordRow['statusLabel'] => {
  if (status === 'Pendiente') {
    return 'Pendiente';
  }

  if (status === 'Cerrada') {
    return 'Resuelto';
  }

  return 'Revisado';
};

export default function Records() {
  const t = useHRLanguage();
  const [records, setRecords] = useState<RecordRow[]>(seedRecords);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [collaboratorFilter, setCollaboratorFilter] = useState('Todos los colaboradores');
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilterOptions)[number]>('Todos los tipos');
  const [severityFilter, setSeverityFilter] = useState<(typeof severityFilterOptions)[number]>('Todos los niveles');
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilterOptions)[number]>('Todos los estados');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const collaboratorOptions = useMemo(
    () => ['Todos los colaboradores', ...Array.from(new Set(records.map((record) => record.colaborador)))],
    [records],
  );

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const displayType = displayTypeByRecordType[record.tipo] ?? record.tipo;
        const matchesSearch = `${record.id} ${record.colaborador} ${record.title} ${record.tipo}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCollaborator =
          collaboratorFilter === 'Todos los colaboradores' || record.colaborador === collaboratorFilter;
        const matchesType = typeFilter === 'Todos los tipos' || displayType === typeFilter;
        const matchesSeverity = severityFilter === 'Todos los niveles' || record.gravedad === severityFilter;
        const matchesStatus = statusFilter === 'Todos los estados' || record.statusLabel === statusFilter;

        const recordDate = formatInputDate(record.fecha);
        const matchesStartDate = !startDate || !recordDate || recordDate >= startDate;
        const matchesEndDate = !endDate || !recordDate || recordDate <= endDate;

        return (
          matchesSearch &&
          matchesCollaborator &&
          matchesType &&
          matchesSeverity &&
          matchesStatus &&
          matchesStartDate &&
          matchesEndDate
        );
      }),
    [collaboratorFilter, endDate, records, searchQuery, severityFilter, startDate, statusFilter, typeFilter],
  );

  const handleExport = () => {
    const header = ['Folio', 'Colaborador', 'Tipo de evento', 'Titulo', 'Fecha evento', 'Gravedad', 'Estado'];
    const rows = filteredRecords.map((record) => [
      record.id,
      record.colaborador,
      displayTypeByRecordType[record.tipo] ?? record.tipo,
      record.title,
      record.fecha,
      record.gravedad,
      record.statusLabel,
    ]);

    const csv = [header, ...rows]
      .map((columns) => columns.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hr-records.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-6 rounded-lg border border-[#143675]/20 bg-[#143675]/5 p-6 dark:border-[#143675]/30 dark:bg-[#143675]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">⚠️</span>
              {t.records.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.records.subtitle}
            </p>
          </div>

          <Button className="gap-2 bg-[#3121a8] text-white hover:bg-[#261882]" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            {t.records.newRecord}
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/95">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t.records.searchPlaceholder}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
            />
          </div>

          <Button
            variant="outline"
            className="gap-2 border-[#143675]/30 bg-white/70 text-[#143675] hover:bg-[#143675] hover:text-white dark:border-[#4a7bc8]/30 dark:bg-gray-800/50 dark:text-white dark:hover:bg-[#143675]"
            onClick={() => setShowFilters((current) => !current)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? t.records.hideFilters : t.records.showFilters}
          </Button>
        </div>

        {showFilters ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.records.filters.collaborator}</label>
              <select
                value={collaboratorFilter}
                onChange={(event) => setCollaboratorFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
              >
                {collaboratorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'Todos los colaboradores' ? t.records.filters.allCollaborators : option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.records.filters.type}</label>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as (typeof typeFilterOptions)[number])}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
              >
                {typeFilterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'Todos los tipos' ? t.records.filters.allTypes : t.records.types[option]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.records.filters.severity}</label>
              <select
                value={severityFilter}
                onChange={(event) =>
                  setSeverityFilter(event.target.value as (typeof severityFilterOptions)[number])
                }
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
              >
                {severityFilterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'Todos los niveles' ? t.records.filters.allLevels : option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.records.filters.status}</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as (typeof statusFilterOptions)[number])}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
              >
                {statusFilterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'Todos los estados' ? t.records.filters.allStatuses : t.records.statuses[option]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.records.filters.fromDate}</label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.records.filters.toDate}</label>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white/95 shadow-sm dark:border-gray-700 dark:bg-gray-800/95">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-200 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-700/60">
              <tr>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.records.table.folio}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.records.table.collaborator}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.records.table.eventType}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.records.table.title}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.records.table.eventDate}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.records.table.severity}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.records.table.status}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.records.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.map((record) => {
                const displayType = displayTypeByRecordType[record.tipo] ?? record.tipo;
                return (
                  <tr key={record.id} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/30">
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">{record.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{record.colaborador}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          typeBadgeClasses[displayType] ?? 'bg-slate-500/20 text-slate-300'
                        }`}
                      >
                        {typeEmojiByLabel[displayType] ? `${typeEmojiByLabel[displayType]} ` : ''}
                        {t.records.types[displayType]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{record.title}</td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{record.fecha}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${severityClasses[record.gravedad]}`}
                      >
                        {record.gravedad}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[record.statusLabel]}`}
                      >
                        {t.records.statuses[record.statusLabel]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 text-sm">
                        <button type="button" className="text-gray-400 transition hover:text-gray-200" title="Ver">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="text-[#7b82ff] transition hover:text-[#9fa4ff]"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="text-gray-400 transition hover:text-gray-200"
                          title="Descargar"
                          onClick={handleExport}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NuevaActaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const nextId = `ACT-2024-${String(records.length + 1).padStart(3, '0')}`;
          const colaboradorNombre =
            rhColaboradores.find((colaborador) => String(colaborador.id) === data.colaboradorId)?.nombre ||
            'Colaborador';
          const severity =
            data.gravedad === 'alta' || data.gravedad === 'critica'
              ? 'Alta'
              : data.gravedad === 'media'
                ? 'Media'
                : 'Baja';
          const typeValue =
            data.tipoEvento === 'reconocimiento'
              ? 'Reconocimiento'
              : data.tipoEvento === 'incidente'
                ? 'Incidente'
                : data.tipoEvento === 'sancion'
                  ? 'Sancion'
                  : 'Observacion';

          setRecords((current) => [
            {
              id: nextId,
              colaborador: colaboradorNombre,
              tipo: typeValue,
              gravedad: severity,
              fecha: data.fechaEvento || new Date().toLocaleDateString('es-MX'),
              estado: 'Pendiente',
              title: data.titulo || typeValue,
              statusLabel: 'Pendiente',
            },
            ...current,
          ]);
          setIsModalOpen(false);
        }}
        colaboradores={rhColaboradores.map(({ id, nombre, puesto }) => ({
          id,
          nombre,
          puesto,
        }))}
      />
    </>
  );
}
