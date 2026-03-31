import { Trash2 } from 'lucide-react';
import type { Negocio, Unidad } from '../types';

interface UnitsCopy {
  units: {
    title: string;
    description: string;
    addBusiness: string;
    addUnit: string;
  };
}

interface UnitsSectionProps {
  unidades: Unidad[];
  structure: UnitsCopy;
  onEditUnidad: (unidad: Unidad) => void;
  onDeleteUnidad: (unidadId: string) => void;
  onEditNegocio: (negocio: Negocio, unidadId: string) => void;
  onDeleteNegocio: (unidadId: string, negocioId: string) => void;
  onCreateNegocio: (unidadId: string) => void;
  onCreateUnidad: () => void;
}

export function UnitsSection({
  unidades,
  structure,
  onEditUnidad,
  onDeleteUnidad,
  onEditNegocio,
  onDeleteNegocio,
  onCreateNegocio,
  onCreateUnidad,
}: UnitsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {structure.units.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {structure.units.description}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {unidades.map((unidad) => (
          <div
            key={unidad.id}
            className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{unidad.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {unidad.negocios.length} negocio{unidad.negocios.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEditUnidad(unidad)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  ⚙️ Configurar unidad
                </button>
                {unidad.id !== '1' && (
                  <button
                    type="button"
                    onClick={() => onDeleteUnidad(unidad.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {unidad.negocios.length > 0 && (
              <div className="ml-8 space-y-2 mb-3">
                {unidad.negocios.map((negocio) => (
                  <div
                    key={negocio.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🏪</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {negocio.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEditNegocio(negocio, unidad.id)}
                        className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        ⚙️ Configurar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNegocio(unidad.id, negocio.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => onCreateNegocio(unidad.id)}
              className="ml-8 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {structure.units.addBusiness}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onCreateUnidad}
        className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        {structure.units.addUnit}
      </button>
    </div>
  );
}
