import { useState } from 'react';
import { Search, Plus, Users, Calendar, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { NuevoComunicadoModal } from '../../../components/NuevoComunicadoModal';
import { RHComunicado, rhColaboradores, rhComunicadosSeed } from '../mockData';

const getStatusClasses = (estado: RHComunicado['estado']) => {
  const styles = {
    Publicado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Programado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Borrador: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return styles[estado];
};

export default function Comunicados() {
  const [comunicados, setComunicados] = useState<RHComunicado[]>(rhComunicadosSeed);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredComunicados = comunicados.filter((comunicado) =>
    `${comunicado.titulo} ${comunicado.destinatarios} ${comunicado.autor}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const publishedCount = comunicados.filter((comunicado) => comunicado.estado === 'Publicado').length;
  const scheduledCount = comunicados.filter((comunicado) => comunicado.estado === 'Programado').length;
  const draftCount = comunicados.filter((comunicado) => comunicado.estado === 'Borrador').length;

  return (
    <>
      <div className="bg-[#143675]/5 dark:bg-[#143675]/10 rounded-lg p-6 mb-6 border border-[#143675]/20 dark:border-[#143675]/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">📢</span>
              Comunicados
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Organiza mensajes internos, publicaciones programadas y avisos urgentes.
            </p>
          </div>
          <Button className="bg-[#143675] hover:bg-[#0f2855] text-white gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo comunicado
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Publicados</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{publishedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Comunicados visibles al equipo</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Programados</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{scheduledCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Pendientes de salir</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Borradores</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{draftCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Pendientes de revision</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Alcance estimado</p>
          <p className="text-3xl font-bold text-[#143675] dark:text-[#4a7bc8]">{rhColaboradores.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Colaboradores disponibles para envio</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Buscar</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Titulo, autor o destinatarios"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comunicado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destinatarios</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Programacion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Autor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredComunicados.map((comunicado) => (
                <tr key={comunicado.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{comunicado.titulo}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{comunicado.tipo}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      {comunicado.destinatarios}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(comunicado.estado)}`}>
                      {comunicado.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {comunicado.fecha.split(' · ')[0]}
                      </p>
                      <p className="flex items-center gap-2 text-xs">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {comunicado.fecha.split(' · ')[1] ?? 'Sin hora'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{comunicado.autor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NuevoComunicadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const nextId = `COM-${300 + comunicados.length + 1}`;
          const estadoMap: Record<string, RHComunicado['estado']> = {
            publicado: 'Publicado',
            programado: 'Programado',
            borrador: 'Borrador',
          };
          const tipoMap: Record<string, RHComunicado['tipo']> = {
            general: 'General',
            urgente: 'Urgente',
            recordatorio: 'Recordatorio',
            celebracion: 'Celebracion',
          };

          setComunicados((prev) => [
            {
              id: nextId,
              titulo: data.titulo,
              tipo: tipoMap[data.tipo] || 'General',
              destinatarios: data.destinatarios === 'todos' ? 'Todo el personal' : 'Segmentado',
              estado: estadoMap[data.estado] || 'Borrador',
              fecha: `${data.fechaProgramada || new Date().toLocaleDateString('es-MX')} · ${data.horaProgramada || '09:00'}`,
              autor: 'RH Central',
            },
            ...prev,
          ]);
          setIsModalOpen(false);
        }}
        colaboradores={rhColaboradores.map(({ id, nombre, puesto, unidad }) => ({
          id,
          nombre,
          puesto,
          unidad,
        }))}
      />
    </>
  );
}
