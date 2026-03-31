import { useState } from 'react';
import { Search, Laptop, Wrench, ShieldAlert, Package } from 'lucide-react';
import { RHActivoAsignado, rhActivosSeed } from '../mockData';

const getAssetStateClasses = (estado: RHActivoAsignado['estado']) => {
  const styles = {
    Asignado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Mantenimiento: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    Resguardo: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };

  return styles[estado];
};

export default function Activos() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = rhActivosSeed.filter((asset) =>
    `${asset.nombre} ${asset.colaborador} ${asset.departamento}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const assignedCount = rhActivosSeed.filter((asset) => asset.estado === 'Asignado').length;
  const maintenanceCount = rhActivosSeed.filter((asset) => asset.estado === 'Mantenimiento').length;
  const reserveCount = rhActivosSeed.filter((asset) => asset.estado === 'Resguardo').length;

  return (
    <>
      <div className="bg-[#143675]/5 dark:bg-[#143675]/10 rounded-lg p-6 mb-6 border border-[#143675]/20 dark:border-[#143675]/30">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <span className="text-2xl">💼</span>
          Activos
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Seguimiento visual de equipos, resguardos y herramientas asignadas al personal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Asignados</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{assignedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Equipos entregados</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mantenimiento</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{maintenanceCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Fuera de servicio</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Resguardo</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{reserveCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Disponibles para reasignar</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Catalogo</p>
          <p className="text-3xl font-bold text-[#143675] dark:text-[#4a7bc8]">{rhActivosSeed.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Activos visibles en RH</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Laptop className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Equipo de computo</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Laptops y terminales</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Wrench className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Herramientas</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Operacion y mantenimiento</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Seguimiento</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Condicion y custodio</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Resguardos</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Listos para auditoria</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Buscar activo</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Nombre del activo, custodio o area"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Custodio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Condicion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asignacion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{asset.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{asset.id} · {asset.categoria}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {asset.colaborador}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{asset.departamento}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getAssetStateClasses(asset.estado)}`}>
                      {asset.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{asset.condicion}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{asset.fechaAsignacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
