import { useMemo, useState } from 'react';
import { ChevronDown, Download, Plus, Search } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useHRLanguage } from '../HRLanguage';
import { RHActivoAsignado, rhActivosSeed } from '../mockData';

type AssetType = 'Equipo de computo' | 'Control de asistencia' | 'Operacion' | 'Mantenimiento';

interface AssetRow extends RHActivoAsignado {
  icon: string;
  serial: string;
  unidad: string;
  valor: string;
  tipoFiltro: AssetType;
}

const assetCatalog: AssetRow[] = [
  {
    ...rhActivosSeed[0],
    icon: '💻',
    serial: 'SN: MBP-2023-1456',
    unidad: 'Unidad 10',
    valor: '$45,000',
    tipoFiltro: 'Equipo de computo',
  },
  {
    ...rhActivosSeed[1],
    icon: '🖥️',
    serial: 'SN: DLT-2023-8921',
    unidad: 'Unidad 10',
    valor: '$18,500',
    tipoFiltro: 'Control de asistencia',
  },
  {
    ...rhActivosSeed[2],
    icon: '📱',
    serial: 'IMEI: 356789012345678',
    unidad: 'Unidad 10',
    valor: '$24,999',
    tipoFiltro: 'Operacion',
  },
  {
    ...rhActivosSeed[3],
    icon: '🧰',
    serial: 'KIT: MTTO-8841',
    unidad: 'Unidad 7',
    valor: '$7,800',
    tipoFiltro: 'Mantenimiento',
  },
];

const getAssetStatusClasses = (status: RHActivoAsignado['estado']) => {
  const styles: Record<RHActivoAsignado['estado'], string> = {
    Asignado: 'bg-emerald-500/15 text-emerald-400',
    Mantenimiento: 'bg-amber-500/15 text-amber-400',
    Resguardo: 'bg-[#5c7cff]/15 text-[#89a0ff]',
  };

  return styles[status];
};

export default function Assets() {
  const t = useHRLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos los tipos' | AssetType>('Todos los tipos');
  const [statusFilter, setStatusFilter] = useState<'Todos los estados' | RHActivoAsignado['estado']>(
    'Todos los estados',
  );
  const [unitFilter, setUnitFilter] = useState<'Todas las unidades' | string>('Todas las unidades');

  const filteredAssets = useMemo(
    () =>
      assetCatalog.filter((asset) => {
        const matchesSearch = `${asset.nombre} ${asset.colaborador} ${asset.departamento} ${asset.serial}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'Todos los tipos' || asset.tipoFiltro === typeFilter;
        const matchesStatus = statusFilter === 'Todos los estados' || asset.estado === statusFilter;
        const matchesUnit = unitFilter === 'Todas las unidades' || asset.unidad === unitFilter;

        return matchesSearch && matchesType && matchesStatus && matchesUnit;
      }),
    [searchQuery, statusFilter, typeFilter, unitFilter],
  );

  const totalAssets = 47;
  const assignedAssets = 39;
  const availableAssets = 5;
  const maintenanceAssets = 3;

  const handleExport = () => {
    const header = ['ID', 'Tipo', 'Activo', 'Responsable', 'Unidad', 'Estado', 'Fecha asignacion', 'Valor'];
    const rows = filteredAssets.map((asset) => [
      asset.id,
      asset.tipoFiltro,
      asset.nombre,
      asset.colaborador,
      asset.unidad,
      asset.estado,
      asset.fechaAsignacion,
      asset.valor,
    ]);

    const csv = [header, ...rows]
      .map((columns) => columns.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
      link.download = 'hr-assets.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCreateAsset = () => {
    window.alert(t.assets.createAssetAlert);
  };

  return (
    <>
      <div className="mb-6 rounded-lg border border-[#143675]/20 bg-[#143675]/5 p-6 dark:border-[#143675]/30 dark:bg-[#143675]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">🏢</span>
              {t.assets.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.assets.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-[#143675]/30 bg-white/70 text-[#143675] hover:bg-[#143675] hover:text-white dark:border-[#4a7bc8]/30 dark:bg-gray-800/50 dark:text-white dark:hover:bg-[#143675]"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              {t.assets.export}
            </Button>
            <Button className="gap-2 bg-[#3121a8] text-white hover:bg-[#261882]" onClick={handleCreateAsset}>
              <Plus className="h-4 w-4" />
              {t.assets.newAsset}
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white/95 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/95">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.assets.cards.total}</p>
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{totalAssets}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c5cff]/18 text-xl">📦</div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white/95 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/95">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.assets.cards.assigned}</p>
              <p className="mt-2 text-4xl font-bold text-emerald-400">{assignedAssets}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/18 text-xl">✅</div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white/95 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/95">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.assets.cards.available}</p>
              <p className="mt-2 text-4xl font-bold text-[#7e92ff]">{availableAssets}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5c7cff]/18 text-[10px] font-bold text-[#90a1ff]">
              FREE
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white/95 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/95">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.assets.cards.maintenance}</p>
              <p className="mt-2 text-4xl font-bold text-amber-400">{maintenanceAssets}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/18 text-xl">🔧</div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/95 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t.assets.searchPlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as 'Todos los tipos' | AssetType)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
        >
          <option value="Todos los tipos">{t.assets.filters.allTypes}</option>
          <option value="Equipo de computo">{t.assets.filters.computerEquipment}</option>
          <option value="Control de asistencia">{t.assets.filters.attendanceControl}</option>
          <option value="Operacion">{t.assets.filters.operation}</option>
          <option value="Mantenimiento">{t.assets.filters.maintenance}</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as 'Todos los estados' | RHActivoAsignado['estado'])
          }
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
        >
          <option value="Todos los estados">{t.assets.filters.allStatuses}</option>
          <option value="Asignado">{t.assets.filters.assigned}</option>
          <option value="Mantenimiento">{t.assets.filters.inMaintenance}</option>
          <option value="Resguardo">{t.assets.filters.custody}</option>
        </select>

        <select
          value={unitFilter}
          onChange={(event) => setUnitFilter(event.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
        >
          <option value="Todas las unidades">{t.assets.filters.allUnits}</option>
          <option value="Unidad 7">Unidad 7</option>
          <option value="Unidad 10">Unidad 10</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white/95 shadow-sm dark:border-gray-700 dark:bg-gray-800/95">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-200 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-700/60">
              <tr>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.assets.table.id}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.assets.table.type}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.assets.table.asset}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.assets.table.responsible}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.assets.table.unit}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.assets.table.status}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.assets.table.assignedAt}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.assets.table.value}
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {t.assets.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                >
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">{asset.id}</td>
                  <td className="px-5 py-4 text-lg">{asset.icon}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{asset.nombre}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{asset.serial}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{asset.colaborador}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{asset.unidad}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getAssetStatusClasses(
                        asset.estado,
                      )}`}
                    >
                      {asset.estado === 'Asignado' ? `✅ ${asset.estado}` : asset.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{asset.fechaAsignacion}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">{asset.valor}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-700/60 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      aria-label={`More actions for ${asset.nombre}`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
