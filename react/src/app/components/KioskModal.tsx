import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Search, Camera, MapPin } from 'lucide-react';
import { useHRLanguage } from '../BasicModules/HumanResources/HRLanguage';
import { useLanguage } from '../shared/context';

interface Colaborador {
  id: number;
  nombre: string;
  puesto: string;
  codigo?: string;
}

interface KioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  colaboradores: Colaborador[];
  registeredLocations?: any[];
}

export function KioskModal({ isOpen, onClose, colaboradores, registeredLocations }: KioskModalProps) {
  const t = useHRLanguage();
  const kiosk = t.attendanceKiosk;
  const { currentLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [registroTipo, setRegistroTipo] = useState<'ingreso' | 'salida'>('ingreso');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return kiosk.greetings.morning;
    if (hour >= 12 && hour < 19) return kiosk.greetings.afternoon;
    return kiosk.greetings.evening;
  };

  const getMotivationalMessage = () => {
    const messages = kiosk.messages;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const filteredColaboradores = colaboradores.filter(c => 
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.codigo && c.codigo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectColaborador = (colaborador: Colaborador) => {
    setSelectedColaborador(colaborador);
    setHasPhoto(false);
    setHasLocation(false);
  };

  const handleRegistrarAsistencia = () => {
    if (!hasPhoto || !hasLocation || !selectedColaborador) return;
    
    alert(
      kiosk.success(
        selectedColaborador.nombre,
        registroTipo === 'ingreso' ? kiosk.checklist.checkIn : kiosk.checklist.checkOut,
        currentTime.toLocaleTimeString(currentLanguage.code),
      ),
    );
    
    // Resetear formulario
    setSelectedColaborador(null);
    setHasPhoto(false);
    setHasLocation(false);
    setSearchQuery('');
  };

  const isFormComplete = selectedColaborador && hasPhoto && hasLocation;

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {kiosk.title}
                  </h1>
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    🕐 {currentTime.toLocaleTimeString(currentLanguage.code, { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {kiosk.intro}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-4"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Greeting Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {getGreeting()}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {getMotivationalMessage()}
            </p>
            
            {/* Checklist */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className={selectedColaborador ? 'text-green-600 dark:text-green-400' : ''}>
                  {selectedColaborador ? '✓' : '○'}
                </span>
                <span>{kiosk.checklist.selectName}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <div className="flex items-center gap-2">
                <span className={hasLocation ? 'text-green-600 dark:text-green-400' : ''}>
                  {hasLocation ? '✓' : '○'}
                </span>
                <span>{kiosk.checklist.getLocation}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <div className="flex items-center gap-2">
                <span className={hasPhoto ? 'text-green-600 dark:text-green-400' : ''}>
                  {hasPhoto ? '✓' : '○'}
                </span>
                <span>{kiosk.checklist.takePhoto}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value="ingreso"
                    checked={registroTipo === 'ingreso'}
                    onChange={() => setRegistroTipo('ingreso')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>{kiosk.checklist.checkIn}</span>
                </label>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value="salida"
                    checked={registroTipo === 'salida'}
                    onChange={() => setRegistroTipo('salida')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>{kiosk.checklist.checkOut}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Search and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {kiosk.labels.date}
              </label>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white">
                {currentTime.toLocaleDateString(currentLanguage.code, { day: '2-digit', month: '2-digit', year: 'numeric' })} {kiosk.today}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {kiosk.labels.search}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={kiosk.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Colaboradores List */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">{kiosk.labels.employees}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {filteredColaboradores.length}
                </span>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto">
                {filteredColaboradores.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {kiosk.noResults}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredColaboradores.map((colaborador) => (
                      <button
                        key={colaborador.id}
                        onClick={() => handleSelectColaborador(colaborador)}
                        className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          selectedColaborador?.id === colaborador.id 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' 
                            : ''
                        }`}
                      >
                        <p className="font-medium text-gray-900 dark:text-white">
                          {colaborador.nombre}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {colaborador.puesto}
                        </p>
                        {colaborador.codigo && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {kiosk.labels.code}: {colaborador.codigo}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Registration Form */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {!selectedColaborador ? (
                <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👤</div>
                    <p className="text-lg">{kiosk.selectEmployee}</p>
                    <p className="text-sm mt-2">{kiosk.selectEmployeeHint}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selected Colaborador Info */}
                  <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {selectedColaborador.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedColaborador.puesto}
                    </p>
                  </div>

                  {/* Photo Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white">{kiosk.labels.photo}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {hasPhoto ? kiosk.photoRequired : kiosk.noPhoto}
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => setHasPhoto(!hasPhoto)}
                      variant={hasPhoto ? "default" : "outline"}
                      className={`w-full gap-2 mb-2 ${
                        hasPhoto 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : ''
                      }`}
                    >
                      <Camera className="h-4 w-4" />
                      {hasPhoto ? `✓ ${kiosk.photoTaken}` : `📷 ${kiosk.takePhoto}`}
                    </Button>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Tip:</span> {kiosk.photoTip}
                    </p>
                  </div>

                  {/* Location Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white">{kiosk.labels.location}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {hasLocation ? kiosk.locationRequired : kiosk.noLocation}
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => setHasLocation(!hasLocation)}
                      variant={hasLocation ? "default" : "outline"}
                      className={`w-full gap-2 ${
                        hasLocation 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : ''
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      {hasLocation ? `✓ ${kiosk.locationObtained}` : `📍 ${kiosk.getLocation}`}
                    </Button>
                  </div>

                  {/* Info Message */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      {kiosk.enableWhenReady}
                    </p>
                  </div>

                  {/* Register Button */}
                  <Button
                    onClick={handleRegistrarAsistencia}
                    disabled={!isFormComplete}
                    className={`w-full py-6 text-lg gap-2 ${
                      isFormComplete
                        ? registroTipo === 'ingreso'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {registroTipo === 'ingreso' ? '☀️' : '🌙'} {kiosk.register}
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    <span className="font-medium">Tip:</span> {kiosk.toggleTip}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
