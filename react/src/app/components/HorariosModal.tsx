import { useState } from 'react';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Checkbox } from './ui/checkbox';
import { X, Search, Clock, ChevronDown, AlertCircle, MapPin } from 'lucide-react';

interface Colaborador {
  id: number;
  nombre: string;
  puesto: string;
  codigo?: string;
  departamento?: string;
}

interface HorarioDia {
  dia: string;
  entrada: string;
  salida: string;
  comida: number;
  descanso: number;
}

interface HorariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  colaboradores: Colaborador[];
}

export function HorariosModal({ isOpen, onClose, colaboradores }: HorariosModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [unidadFilter, setUnidadFilter] = useState('Todas');
  const [negocioFilter, setNegocioFilter] = useState('Todos');
  const [selectedColaboradores, setSelectedColaboradores] = useState<number[]>([]);
  const [modoHorario, setModoHorario] = useState('Horario estricto');
  const [toleranciaIngreso, setToleranciaIngreso] = useState(10);
  const [noPermitirDespuesTolerancia, setNoPermitirDespuesTolerancia] = useState(false);
  const [noPermitirFueraUbicacion, setNoPermitirFueraUbicacion] = useState(false);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('Ninguna');
  
  const [horarios, setHorarios] = useState<HorarioDia[]>([
    { dia: 'Lun', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
    { dia: 'Mar', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
    { dia: 'Mié', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
    { dia: 'Jue', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
    { dia: 'Vie', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
    { dia: 'Sáb', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
    { dia: 'Dom', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
  ]);

  // Lista de ubicaciones disponibles
  const ubicacionesDisponibles = [
    'Ninguna',
    'Oficina Central - Monterrey',
    'Sucursal Norte',
    'Sucursal Sur',
    'Almacén Principal',
    'Centro de Distribución'
  ];

  if (!isOpen) return null;

  const filteredColaboradores = colaboradores.filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.codigo && c.codigo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const toggleColaborador = (id: number) => {
    setSelectedColaboradores(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedColaboradores.length === filteredColaboradores.length) {
      setSelectedColaboradores([]);
    } else {
      setSelectedColaboradores(filteredColaboradores.map(c => c.id));
    }
  };

  const updateHorario = (index: number, field: keyof HorarioDia, value: string | number) => {
    setHorarios(prev => {
      const newHorarios = [...prev];
      newHorarios[index] = { ...newHorarios[index], [field]: value };
      return newHorarios;
    });
  };

  const copiarSemana = () => {
    // Copia el horario de lunes a toda la semana
    const lunesHorario = horarios[0];
    setHorarios(prev => prev.map((h, index) => 
      index === 0 ? h : { ...h, entrada: lunesHorario.entrada, salida: lunesHorario.salida, comida: lunesHorario.comida, descanso: lunesHorario.descanso }
    ));
  };

  const limpiarHorarios = () => {
    setHorarios([
      { dia: 'Lun', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
      { dia: 'Mar', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
      { dia: 'Mié', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
      { dia: 'Jue', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
      { dia: 'Vie', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
      { dia: 'Sáb', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
      { dia: 'Dom', entrada: '--:--', salida: '--:--', comida: 0, descanso: 0 },
    ]);
  };

  const aplicarHorarios = () => {
    if (selectedColaboradores.length === 0) {
      alert('⚠️ Debes seleccionar al menos un colaborador');
      return;
    }
    
    const toleranciaMsg = modoHorario === 'Horario estricto' ? `\nTolerancia: ${toleranciaIngreso} minutos` : '';
    alert(`✓ Horarios aplicados exitosamente\n\nColaboradores: ${selectedColaboradores.length}\nModo: ${modoHorario}${toleranciaMsg}\n\nLos horarios han sido configurados correctamente.`);
    onClose();
  };

  // Variable para deshabilitar campos cuando es Horario abierto
  const isHorarioAbierto = modoHorario === 'Horario abierto';
  const isMultipleSelected = selectedColaboradores.length > 1;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#143675] bg-[#143675]">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">
              Configurar horarios
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Buscar */}
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nombre o código"
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Unidad */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unidad
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-white dark:bg-gray-800">
                    {unidadFilter}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setUnidadFilter('Todas')}>Todas</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUnidadFilter('7')}>7</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUnidadFilter('8')}>8</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUnidadFilter('9')}>9</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUnidadFilter('10')}>10</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Negocio */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Negocio
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-white dark:bg-gray-800">
                    {negocioFilter}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setNegocioFilter('Todos')}>Todos</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Botón Buscar */}
            <div className="md:col-span-1 flex items-end">
              <Button className="w-full bg-[#143675] hover:bg-[#0f2855] text-white gap-2">
                <Search className="h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
            {/* Panel Izquierdo - Colaboradores */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Colaboradores
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Seleccionados: <span className="font-medium text-blue-600 dark:text-blue-400">{selectedColaboradores.length}</span>
                </span>
              </div>

              {/* Tabla de colaboradores */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-left w-10">
                        <Checkbox 
                          checked={selectedColaboradores.length === filteredColaboradores.length && filteredColaboradores.length > 0}
                          onCheckedChange={toggleAll}
                        />
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Código
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Colaborador
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Depto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {filteredColaboradores.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                          No se pudo cargar colaboradores
                        </td>
                      </tr>
                    ) : (
                      filteredColaboradores.map((colaborador) => (
                        <tr 
                          key={colaborador.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-3 py-3">
                            <Checkbox
                              checked={selectedColaboradores.includes(colaborador.id)}
                              onCheckedChange={() => toggleColaborador(colaborador.id)}
                            />
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {colaborador.codigo || colaborador.id}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                            {colaborador.nombre}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {colaborador.departamento || colaborador.puesto}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Panel Derecho - Horario a aplicar */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Horario a aplicar
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Se aplicará igual a todos los seleccionados
                </p>
              </div>

              {/* Acciones rápidas */}
              <div className="flex items-center gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={limpiarHorarios}
                  className="gap-2"
                  disabled={isHorarioAbierto}
                >
                  ✕ Limpiar
                </Button>
              </div>

              {/* Alerta múltiples colaboradores */}
              {isMultipleSelected && (
                <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Selección múltiple
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Tienes <span className="font-semibold">{selectedColaboradores.length} colaboradores</span> seleccionados. El horario se aplicará a todos por igual.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Modo */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modo
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-white dark:bg-gray-800">
                      {modoHorario}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setModoHorario('Horario estricto')}>
                      Horario estricto
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setModoHorario('Horario abierto')}>
                      Horario abierto
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span className="font-medium">Abierto:</span> marca a cualquier hora. <span className="font-medium">Estricto:</span> sólo dentro del horario.
                </p>
              </div>

              {/* Alerta Horario Abierto */}
              {isHorarioAbierto && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Horario abierto activado
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Los colaboradores podrán marcar a cualquier hora. No es necesario configurar horarios específicos.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tolerancia en ingreso - Solo para Horario estricto */}
              {modoHorario === 'Horario estricto' && (
                <div className="mb-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ⏱️ Tolerancia en ingreso
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={toleranciaIngreso}
                      onChange={(e) => setToleranciaIngreso(parseInt(e.target.value) || 0)}
                      min="0"
                      max="60"
                      className="w-24 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">minutos</span>
                  </div>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
                    Los colaboradores podrán marcar ingreso hasta <span className="font-medium">{toleranciaIngreso} minutos tarde</span> sin penalización.
                  </p>
                </div>
              )}

              {/* Opciones adicionales para Horario estricto */}
              {modoHorario === 'Horario estricto' && (
                <div className="mb-4 space-y-3">
                  {/* Checkbox: No permitir después de tolerancia */}
                  <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={noPermitirDespuesTolerancia}
                        onCheckedChange={(checked) => setNoPermitirDespuesTolerancia(checked === true)}
                        id="no-permitir-tolerancia"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor="no-permitir-tolerancia"
                          className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                        >
                          No permitir registro después de tiempo de tolerancia
                        </label>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Se bloqueará el registro si pasa el tiempo de tolerancia configurado
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox: No permitir fuera de ubicación */}
                  <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={noPermitirFueraUbicacion}
                        onCheckedChange={(checked) => setNoPermitirFueraUbicacion(checked === true)}
                        id="no-permitir-ubicacion"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor="no-permitir-ubicacion"
                          className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                        >
                          No permitir registro fuera de la ubicación seleccionada
                        </label>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Solo se podrá registrar desde la ubicación configurada
                        </p>
                        
                        {/* Selector de ubicación */}
                        {noPermitirFueraUbicacion && (
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <MapPin className="inline h-3 w-3 mr-1" />
                              Ubicación permitida
                            </label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-between bg-white dark:bg-gray-800 text-sm h-9"
                                >
                                  {ubicacionSeleccionada}
                                  <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full">
                                {ubicacionesDisponibles.map((ubicacion) => (
                                  <DropdownMenuItem 
                                    key={ubicacion} 
                                    onClick={() => setUbicacionSeleccionada(ubicacion)}
                                  >
                                    {ubicacion}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabla de horarios */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Día
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Entrada
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Salida
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Comida (min)
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Descanso
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {horarios.map((horario, index) => (
                        <tr key={horario.dia}>
                          <td className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {horario.dia}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <input
                                type="time"
                                value={horario.entrada === '--:--' ? '' : horario.entrada}
                                onChange={(e) => updateHorario(index, 'entrada', e.target.value || '--:--')}
                                className={`w-24 px-2 py-1 text-sm border rounded focus:ring-2 focus:border-transparent ${
                                  isHorarioAbierto 
                                    ? 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500'
                                }`}
                                disabled={isHorarioAbierto}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <input
                                type="time"
                                value={horario.salida === '--:--' ? '' : horario.salida}
                                onChange={(e) => updateHorario(index, 'salida', e.target.value || '--:--')}
                                className={`w-24 px-2 py-1 text-sm border rounded focus:ring-2 focus:border-transparent ${
                                  isHorarioAbierto 
                                    ? 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500'
                                }`}
                                disabled={isHorarioAbierto}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              value={horario.comida}
                              onChange={(e) => updateHorario(index, 'comida', parseInt(e.target.value) || 0)}
                              min="0"
                              className={`w-16 px-2 py-1 text-sm border rounded text-center focus:ring-2 focus:border-transparent ${
                                isHorarioAbierto 
                                  ? 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500'
                              }`}
                              disabled={isHorarioAbierto}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              value={horario.descanso}
                              onChange={(e) => updateHorario(index, 'descanso', parseInt(e.target.value) || 0)}
                              min="0"
                              className={`w-16 px-2 py-1 text-sm border rounded text-center focus:ring-2 focus:border-transparent ${
                                isHorarioAbierto 
                                  ? 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500'
                              }`}
                              disabled={isHorarioAbierto}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-700/50">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            onClick={aplicarHorarios}
            className="bg-[#143675] hover:bg-[#0f2855] text-white gap-2"
            disabled={selectedColaboradores.length === 0}
          >
            📋 Aplicar a seleccionados
          </Button>
        </div>
      </div>
    </div>
  );
}
