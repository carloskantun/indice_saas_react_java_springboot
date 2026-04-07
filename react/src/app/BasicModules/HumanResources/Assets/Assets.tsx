import { useMemo, useState } from 'react';
import { ChevronDown, Eye, PenLine, Plus, Search, Trash2, Wrench } from 'lucide-react';
import { ConfirmDeleteDialog } from '../../../components/ConfirmDeleteDialog';
import { SuccessToast } from '../../../components/SuccessToast';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { rhColaboradores } from '../mockData';
import { AddNewAssests, type AddNewAssetDraft, type AddNewAssetType } from './AddNewAssests';
import { useHRLanguage } from '../HRLanguage';
import { RHActivoAsignado, rhActivosSeed } from '../mockData';

type AssetType = AddNewAssetType;

interface AssetRow extends RHActivoAsignado {
  icon: string;
  serial: string;
  unidad: string;
  valor: string;
  tipoFiltro: AssetType;
  modelo?: string;
  notas?: string;
}

const assetCatalog: AssetRow[] = [
  {
    ...rhActivosSeed[0],
    icon: '💻',
    serial: 'SN: MBP-2023-1456',
    unidad: 'Unidad 10',
    valor: '$45,000',
    tipoFiltro: 'laptop',
    modelo: 'Latitude 7440',
  },
  {
    ...rhActivosSeed[1],
    icon: '🖥️',
    serial: 'SN: DLT-2023-8921',
    unidad: 'Unidad 10',
    valor: '$18,500',
    tipoFiltro: 'attendance',
    modelo: 'Kiosk Biometric Pro',
  },
  {
    ...rhActivosSeed[2],
    icon: '📱',
    serial: 'IMEI: 356789012345678',
    unidad: 'Unidad 10',
    valor: '$24,999',
    tipoFiltro: 'operations',
    modelo: 'iPhone 14 Pro',
  },
  {
    ...rhActivosSeed[3],
    icon: '🧰',
    serial: 'KIT: MTTO-8841',
    unidad: 'Unidad 7',
    valor: '$7,800',
    tipoFiltro: 'maintenance',
    modelo: 'Industrial service kit',
  },
];

const getAssetStatusClasses = (status: RHActivoAsignado['estado']) => {
  const styles: Record<RHActivoAsignado['estado'], string> = {
    Disponible: 'bg-[#5c7cff]/15 text-[#89a0ff]',
    Asignado: 'bg-emerald-500/15 text-emerald-400',
    Mantenimiento: 'bg-amber-500/15 text-amber-400',
    Resguardo: 'bg-slate-500/15 text-slate-300',
  };

  return styles[status];
};

const getAssetTypeIcon = (type: AssetType) => {
  const iconMap: Record<AssetType, string> = {
    laptop: '💻',
    attendance: '🖥️',
    operations: '📱',
    maintenance: '🧰',
  };

  return iconMap[type];
};

const getAssetTypeLabel = (type: AssetType, t: ReturnType<typeof useHRLanguage>) => {
  const labelMap: Record<AssetType, string> = {
    laptop: t.assets.addNewAsset.options.laptop,
    attendance: t.assets.filters.attendanceControl,
    operations: t.assets.filters.operation,
    maintenance: t.assets.filters.maintenance,
  };

  return labelMap[type];
};

export default function Assets() {
  const t = useHRLanguage();
  const [assetRows, setAssetRows] = useState<AssetRow[]>(assetCatalog);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | AssetType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | RHActivoAsignado['estado']>('all');
  const [unitFilter, setUnitFilter] = useState<'all' | string>('all');
  const [toastMessage, setToastMessage] = useState('');
  const [assetPendingDeactivate, setAssetPendingDeactivate] = useState<AssetRow | null>(null);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  const filteredAssets = useMemo(
    () =>
      assetRows.filter((asset) => {
        const matchesSearch = `${asset.nombre} ${asset.colaborador} ${asset.departamento} ${asset.serial}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || asset.tipoFiltro === typeFilter;
        const matchesStatus = statusFilter === 'all' || asset.estado === statusFilter;
        const matchesUnit = unitFilter === 'all' || asset.unidad === unitFilter;

        return matchesSearch && matchesType && matchesStatus && matchesUnit;
      }),
    [assetRows, searchQuery, statusFilter, typeFilter, unitFilter],
  );

  const totalAssets = assetRows.length;
  const assignedAssets = assetRows.filter((asset) => asset.estado === 'Asignado').length;
  const availableAssets = assetRows.filter((asset) => ['Disponible', 'Resguardo'].includes(asset.estado)).length;
  const maintenanceAssets = assetRows.filter((asset) => asset.estado === 'Mantenimiento').length;

  const responsibleOptions = useMemo(
    () => Array.from(new Set(rhColaboradores.map((collaborator) => collaborator.nombre))),
    [],
  );
  const unitOptions = useMemo(
    () => Array.from(new Set(assetRows.map((asset) => asset.unidad))).sort(),
    [assetRows],
  );

  const handleCreateAsset = () => {
    setIsAddAssetOpen(true);
  };

  const handleViewDetails = (asset: AssetRow) => {
    window.alert(
      [
        t.assets.actionAlerts.details,
        '',
        `${t.assets.table.id}: ${asset.id}`,
        `${t.assets.table.asset}: ${asset.nombre}`,
        `Serial: ${asset.serial.replace(/^SN:\s?|^IMEI:\s?|^KIT:\s?/u, '')}`,
        `${t.assets.table.responsible}: ${asset.colaborador}`,
        `${t.assets.table.unit}: ${asset.unidad}`,
        `${t.assets.table.status}: ${asset.estado}`,
        `${t.assets.table.assignedAt}: ${asset.fechaAsignacion}`,
        `${t.assets.table.value}: ${asset.valor}`,
      ].join('\n'),
    );
  };

  const handleReassign = () => {
    window.alert(t.assets.actionAlerts.reassignPending);
  };

  const handleMoveToMaintenance = (asset: AssetRow) => {
    setAssetRows((current) =>
      current.map((row) => (row.id === asset.id ? { ...row, estado: 'Mantenimiento' } : row)),
    );
    setToastMessage(t.assets.actionAlerts.movedToMaintenance(asset.nombre));
  };

  const handleConfirmDeactivate = () => {
    if (!assetPendingDeactivate) {
      return;
    }

    setAssetRows((current) =>
      current.map((row) => (row.id === assetPendingDeactivate.id ? { ...row, estado: 'Resguardo' } : row)),
    );
    setToastMessage(t.assets.actionAlerts.deactivated(assetPendingDeactivate.nombre));
    setAssetPendingDeactivate(null);
  };

  const handleSaveAsset = (draft: AddNewAssetDraft) => {
    const collaborator = rhColaboradores.find((row) => row.nombre === draft.responsible);
    const newAsset: AssetRow = {
      id: draft.id,
      nombre: draft.name,
      categoria: getAssetTypeLabel(draft.assetType, t),
      colaborador: draft.responsible || 'Sin asignar',
      departamento: collaborator?.departamento ?? 'General',
      estado: draft.status,
      condicion: draft.status === 'Mantenimiento' ? 'Revision' : 'Excelente',
      fechaAsignacion: draft.assignedDate
        ? new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).format(new Date(`${draft.assignedDate}T00:00:00`))
        : '-',
      icon: getAssetTypeIcon(draft.assetType),
      serial: draft.serialNumber
        ? `${draft.assetType === 'operations' ? 'IMEI' : draft.assetType === 'maintenance' ? 'KIT' : 'SN'}: ${draft.serialNumber}`
        : '-',
      unidad: draft.unit || '-',
      valor: draft.value || '-',
      tipoFiltro: draft.assetType,
      modelo: draft.model,
      notas: draft.notes,
    };

    setAssetRows((current) => [newAsset, ...current]);
    setIsAddAssetOpen(false);
    setToastMessage(t.assets.addNewAsset.success(draft.name));
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
          onChange={(event) => setTypeFilter(event.target.value as 'all' | AssetType)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
        >
          <option value="all">{t.assets.filters.allTypes}</option>
          <option value="laptop">{t.assets.filters.computerEquipment}</option>
          <option value="attendance">{t.assets.filters.attendanceControl}</option>
          <option value="operations">{t.assets.filters.operation}</option>
          <option value="maintenance">{t.assets.filters.maintenance}</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | RHActivoAsignado['estado'])}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
        >
          <option value="all">{t.assets.filters.allStatuses}</option>
          <option value="Disponible">{t.assets.filters.available}</option>
          <option value="Asignado">{t.assets.filters.assigned}</option>
          <option value="Mantenimiento">{t.assets.filters.inMaintenance}</option>
          <option value="Resguardo">{t.assets.filters.custody}</option>
        </select>

        <select
          value={unitFilter}
          onChange={(event) => setUnitFilter(event.target.value as 'all' | string)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#4f5dff] focus:ring-2 focus:ring-[#4f5dff]/20 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
        >
          <option value="all">{t.assets.filters.allUnits}</option>
          {unitOptions.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
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
                      {asset.estado === 'Asignado'
                        ? `✅ ${t.assets.statuses[asset.estado]}`
                        : t.assets.statuses[asset.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{asset.fechaAsignacion}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">{asset.valor}</td>
                  <td className="px-5 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-700/60 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                          aria-label={t.assets.actionsMenu.moreActions(asset.nombre)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[11rem]">
                        <DropdownMenuItem onClick={() => handleViewDetails(asset)} className="gap-2">
                          <Eye className="h-4 w-4" />
                          {t.assets.actionsMenu.viewDetails}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleReassign} className="gap-2">
                          <PenLine className="h-4 w-4" />
                          {t.assets.actionsMenu.reassign}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMoveToMaintenance(asset)} className="gap-2 text-amber-600 focus:text-amber-700 dark:text-amber-300 dark:focus:text-amber-200">
                          <Wrench className="h-4 w-4" />
                          {t.assets.actionsMenu.maintenance}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setAssetPendingDeactivate(asset)}
                          className="gap-2 text-red-600 focus:text-red-700 dark:text-red-300 dark:focus:text-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t.assets.actionsMenu.deactivate}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteDialog
        isVisible={assetPendingDeactivate !== null}
        title={t.assets.confirmDeactivate.title}
        itemName={assetPendingDeactivate?.nombre}
        description={t.assets.confirmDeactivate.description}
        confirmLabel={t.assets.confirmDeactivate.confirm}
        cancelLabel={t.assets.confirmDeactivate.cancel}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setAssetPendingDeactivate(null)}
      />

      <SuccessToast
        isVisible={Boolean(toastMessage)}
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />

      <AddNewAssests
        isOpen={isAddAssetOpen}
        onClose={() => setIsAddAssetOpen(false)}
        onSave={handleSaveAsset}
        responsibleOptions={responsibleOptions}
        unitOptions={unitOptions}
      />
    </>
  );
}
