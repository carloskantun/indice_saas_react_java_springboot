import { useState } from 'react';
import { X, Calendar, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

interface Colaborador {
  id: number;
  nombre: string;
  puesto: string;
  unidad: number;
}

interface NuevoComunicadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  colaboradores?: Colaborador[];
}

export function NuevoComunicadoModal({ isOpen, onClose, onSave, colaboradores = [] }: NuevoComunicadoModalProps) {
  const [searchColaborador, setSearchColaborador] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    destinatarios: '',
    unidades: [] as string[],
    departamentos: [] as string[],
    colaboradoresEspecificos: [] as number[],
    contenido: '',
    publicacionTipo: 'ahora', // 'ahora' o 'programado'
    fechaProgramada: '',
    horaProgramada: '',
    adjuntos: [] as File[],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (accion: 'borrador' | 'publicar') => {
    const dataToSave = {
      ...formData,
      estado: accion === 'borrador' ? 'borrador' : formData.publicacionTipo === 'ahora' ? 'publicado' : 'programado',
      fechaCreacion: new Date().toISOString(),
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    setFormData({
      titulo: '',
      tipo: '',
      destinatarios: '',
      unidades: [],
      departamentos: [],
      colaboradoresEspecificos: [],
      contenido: '',
      publicacionTipo: 'ahora',
      fechaProgramada: '',
      horaProgramada: '',
      adjuntos: [],
    });
    onClose();
  };

  if (!isOpen) return null;

  const isFormValid = formData.titulo && formData.tipo && formData.destinatarios && formData.contenido;

  // Filtrar colaboradores según búsqueda
  const filteredColaboradores = colaboradores.filter(col =>
    col.nombre.toLowerCase().includes(searchColaborador.toLowerCase()) ||
    col.puesto.toLowerCase().includes(searchColaborador.toLowerCase())
  );

  // Seleccionar/Deseleccionar todos los colaboradores filtrados
  const handleSelectAllFiltered = (checked: boolean) => {
    if (checked) {
      const allFilteredIds = filteredColaboradores.map(c => c.id);
      const uniqueIds = Array.from(new Set([...formData.colaboradoresEspecificos, ...allFilteredIds]));
      handleInputChange('colaboradoresEspecificos', uniqueIds);
    } else {
      const filteredIds = filteredColaboradores.map(c => c.id);
      handleInputChange('colaboradoresEspecificos', 
        formData.colaboradoresEspecificos.filter(id => !filteredIds.includes(id))
      );
    }
  };

  const allFilteredSelected = filteredColaboradores.length > 0 && 
    filteredColaboradores.every(col => formData.colaboradoresEspecificos.includes(col.id));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 bg-[#143675] dark:bg-[#0f2855] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              📢 Nuevo Comunicado
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Crea y envía mensajes importantes a tus colaboradores
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            {/* Información básica */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información Básica
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Título */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    📝 Título del comunicado *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    placeholder="Ej: Cambio de horarios, Reunión mensual, etc."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    🏷️ Tipo de comunicado *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Selecciona...</option>
                    <option value="general">📋 General</option>
                    <option value="urgente">🚨 Urgente</option>
                    <option value="recordatorio">⏰ Recordatorio</option>
                    <option value="celebracion">🎂 Celebración</option>
                  </select>
                </div>

                {/* Destinatarios */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    👥 Destinatarios *
                  </label>
                  <select
                    value={formData.destinatarios}
                    onChange={(e) => handleInputChange('destinatarios', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Selecciona...</option>
                    <option value="todos">Todos los colaboradores</option>
                    <option value="por-unidad">Por unidad</option>
                    <option value="por-departamento">Por departamento</option>
                    <option value="especificos">Colaboradores específicos</option>
                  </select>
                </div>

                {/* Selector de unidades (condicional) */}
                {formData.destinatarios === 'por-unidad' && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      🏢 Selecciona las unidades
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['7', '8', '9', '10'].map((unidad) => (
                        <label
                          key={unidad}
                          className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.unidades.includes(unidad)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('unidades', [...formData.unidades, unidad]);
                              } else {
                                handleInputChange('unidades', formData.unidades.filter(u => u !== unidad));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Unidad {unidad}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selector de departamentos (condicional) */}
                {formData.destinatarios === 'por-departamento' && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      🏬 Selecciona los departamentos
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Operaciones', 'Mantenimiento', 'Limpieza', 'Administración', 'Coordinación', 'Lavandería'].map((dept) => (
                        <label
                          key={dept}
                          className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.departamentos.includes(dept)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('departamentos', [...formData.departamentos, dept]);
                              } else {
                                handleInputChange('departamentos', formData.departamentos.filter(d => d !== dept));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{dept}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selector de colaboradores específicos (condicional) */}
                {formData.destinatarios === 'especificos' && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      👤 Selecciona los colaboradores ({formData.colaboradoresEspecificos.length} seleccionados)
                    </label>

                    {/* Buscador */}
                    <div className="mb-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchColaborador}
                          onChange={(e) => setSearchColaborador(e.target.value)}
                          placeholder="Buscar por nombre o puesto..."
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Lista de colaboradores con scroll */}
                    <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      {/* Header con seleccionar todos */}
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={allFilteredSelected}
                          onChange={(e) => handleSelectAllFiltered(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Seleccionar todos ({filteredColaboradores.length})
                        </span>
                      </div>

                      {/* Lista de colaboradores */}
                      <div className="max-h-64 overflow-y-auto">
                        {filteredColaboradores.length > 0 ? (
                          <div className="divide-y divide-gray-200 dark:divide-gray-600">
                            {filteredColaboradores.map((colaborador) => (
                              <label
                                key={colaborador.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.colaboradoresEspecificos.includes(colaborador.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      handleInputChange('colaboradoresEspecificos', [...formData.colaboradoresEspecificos, colaborador.id]);
                                    } else {
                                      handleInputChange('colaboradoresEspecificos', formData.colaboradoresEspecificos.filter(id => id !== colaborador.id));
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {colaborador.nombre}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {colaborador.puesto} • Unidad {colaborador.unidad}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {searchColaborador ? 'No se encontraron colaboradores' : 'No hay colaboradores disponibles'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resumen de seleccionados */}
                    {formData.colaboradoresEspecificos.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          ✓ Has seleccionado <span className="font-semibold">{formData.colaboradoresEspecificos.length}</span> colaborador{formData.colaboradoresEspecificos.length !== 1 ? 'es' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contenido del mensaje */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contenido del Mensaje
              </h3>

              <div className="space-y-4">
                {/* Contenido */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    💬 Mensaje *
                  </label>
                  <textarea
                    value={formData.contenido}
                    onChange={(e) => handleInputChange('contenido', e.target.value)}
                    placeholder="Escribe el contenido del comunicado aquí..."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.contenido.length} caracteres
                  </p>
                </div>

                {/* Adjuntos */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    📎 Adjuntar archivos (opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleInputChange('adjuntos', files);
                      }}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-gray-400 dark:text-gray-500 mb-2">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">Clic para subir</span> o arrastra archivos aquí
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF, DOC, DOCX, XLS, XLSX, PNG, JPG hasta 10MB
                      </p>
                    </label>
                  </div>
                  {formData.adjuntos.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.adjuntos.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                          <button
                            onClick={() => {
                              const newFiles = formData.adjuntos.filter((_, i) => i !== index);
                              handleInputChange('adjuntos', newFiles);
                            }}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Programación de publicación */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-100 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📅 Programación de Publicación
              </h3>

              <div className="space-y-4">
                {/* Tipo de publicación */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    ¿Cuándo deseas publicar?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.publicacionTipo === 'ahora'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="publicacionTipo"
                        value="ahora"
                        checked={formData.publicacionTipo === 'ahora'}
                        onChange={(e) => handleInputChange('publicacionTipo', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">⚡ Publicar ahora</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">El comunicado se publicará inmediatamente</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.publicacionTipo === 'programado'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="publicacionTipo"
                        value="programado"
                        checked={formData.publicacionTipo === 'programado'}
                        onChange={(e) => handleInputChange('publicacionTipo', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">🕐 Programar publicación</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Elige una fecha y hora específica</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Selector de fecha y hora (condicional) */}
                {formData.publicacionTipo === 'programado' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        📅 Fecha
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          value={formData.fechaProgramada}
                          onChange={(e) => handleInputChange('fechaProgramada', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        ⏰ Hora
                      </label>
                      <input
                        type="time"
                        value={formData.horaProgramada}
                        onChange={(e) => handleInputChange('horaProgramada', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                      <p className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">ℹ️</span>
                        <span>
                          El comunicado se enviará automáticamente en la fecha y hora seleccionadas. Los colaboradores lo recibirán en ese momento.
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-sm"
            >
              Cancelar
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit('borrador')}
                disabled={!formData.titulo || !formData.tipo || !formData.destinatarios}
                className="text-sm"
              >
                💾 Guardar borrador
              </Button>
              <Button
                onClick={() => handleSubmit('publicar')}
                disabled={!isFormValid}
                className={`text-sm ${
                  isFormValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                📢 {formData.publicacionTipo === 'ahora' ? 'Publicar ahora' : 'Programar publicación'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}