import { useState } from 'react';
import { Plus, FileText, AlertCircle, BadgeCheck } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { NuevaActaModal } from '../../../components/NuevaActaModal';
import { RHActaRegistro, rhActasSeed, rhColaboradores } from '../mockData';

const getSeverityClasses = (gravedad: RHActaRegistro['gravedad']) => {
  const styles = {
    Baja: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Media: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    Alta: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return styles[gravedad];
};

export default function Actas() {
  const [actas, setActas] = useState<RHActaRegistro[]>(rhActasSeed);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingCount = actas.filter((acta) => acta.estado === 'Pendiente').length;
  const closedCount = actas.filter((acta) => acta.estado === 'Cerrada').length;

  return (
    <>
      <div className="bg-[#143675]/5 dark:bg-[#143675]/10 rounded-lg p-6 mb-6 border border-[#143675]/20 dark:border-[#143675]/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Actas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Registro formal de reconocimientos, observaciones e incidencias del personal.
            </p>
          </div>
          <Button className="bg-[#143675] hover:bg-[#0f2855] text-white gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Nueva acta
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registros</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{actas.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Historial disponible en RH</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Seguimiento abierto</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cerradas</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{closedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Casos atendidos</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Alta prioridad</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {actas.filter((acta) => acta.gravedad === 'Alta').length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Casos sensibles o sanciones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-[#143675]/10 dark:bg-[#143675]/20 flex items-center justify-center">
            <FileText className="h-6 w-6 text-[#143675] dark:text-[#4a7bc8]" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Expediente disciplinario</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Todo en un solo historial</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Seguimiento puntual</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Casos abiertos con trazabilidad</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <BadgeCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Reconocimientos</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tambien forma parte del historial</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Folio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Colaborador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gravedad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {actas.map((acta) => (
                <tr key={acta.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{acta.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{acta.colaborador}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{acta.tipo}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityClasses(acta.gravedad)}`}>
                      {acta.gravedad}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{acta.fecha}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{acta.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NuevaActaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const nextId = `ACT-${400 + actas.length + 1}`;
          const colaboradorNombre =
            rhColaboradores.find((colaborador) => String(colaborador.id) === data.colaboradorId)?.nombre ||
            'Colaborador';

          setActas((prev) => [
            {
              id: nextId,
              colaborador: colaboradorNombre,
              tipo: data.tipoEvento || 'Observacion',
              gravedad:
                data.gravedad === 'alta' ? 'Alta' : data.gravedad === 'media' ? 'Media' : 'Baja',
              fecha: data.fechaEvento || new Date().toLocaleDateString('es-MX'),
              estado: 'Pendiente',
            },
            ...prev,
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
