import { useState } from 'react';
import { Button } from './ui/button';
import { X, MapPin } from 'lucide-react';
import { useHRLanguage } from '../BasicModules/HumanResources/HRLanguage';

interface Location {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  radio: number;
  enlaceGoogleMaps?: string;
  altitud?: string;
}

interface LocationRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locations: Location[]) => void;
  initialLocations?: Location[];
}

export function LocationRegistrationModal({
  isOpen,
  onClose,
  onSave,
  initialLocations = []
}: LocationRegistrationModalProps) {
  const t = useHRLanguage().attendanceLocationModal;
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [nombre, setNombre] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [enlaceGoogleMaps, setEnlaceGoogleMaps] = useState('');
  const [altitud, setAltitud] = useState('');
  const [radio, setRadio] = useState('80');
  const [hasChanges, setHasChanges] = useState(false);

  if (!isOpen) return null;

  const extractCoordinates = () => {
    if (!enlaceGoogleMaps) return;

    try {
      // Extraer coordenadas de diferentes formatos de Google Maps
      let lat = '';
      let lng = '';

      // Formato: @21.1619,-86.8515
      const atMatch = enlaceGoogleMaps.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        lat = atMatch[1];
        lng = atMatch[2];
      }

      // Formato: ?q=21.1619,-86.8515
      const qMatch = enlaceGoogleMaps.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qMatch && !lat) {
        lat = qMatch[1];
        lng = qMatch[2];
      }

      if (lat && lng) {
        setLatitud(lat);
        setLongitud(lng);
      }
    } catch (error) {
      console.error('Error al extraer coordenadas:', error);
    }
  };

  const handleAgregar = () => {
    if (!nombre || !latitud || !longitud || !radio) {
      alert(t.alerts.requiredFields);
      return;
    }

    const newLocation: Location = {
      id: Date.now().toString(),
      nombre,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      radio: parseInt(radio),
      enlaceGoogleMaps: enlaceGoogleMaps || undefined,
      altitud: altitud || undefined,
    };

    setLocations([...locations, newLocation]);
    setHasChanges(true);

    // Limpiar formulario
    setNombre('');
    setLatitud('');
    setLongitud('');
    setEnlaceGoogleMaps('');
    setAltitud('');
    setRadio('80');
  };

  const handleQuitar = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
    setHasChanges(true);
  };

  const handleGuardar = () => {
    onSave(locations);
    setHasChanges(false);
  };

  const handleCargar = () => {
    // Simular carga de ubicaciones guardadas
    const savedLocations: Location[] = [
      { id: '1', nombre: 'Oficina Toronto', latitud: 43.641441, longitud: -79.400487, radio: 80 },
      { id: '2', nombre: 'Oficina Cancun', latitud: 21.102109, longitud: -86.764933, radio: 80 },
      { id: '3', nombre: 'Vergel', latitud: 25.669453, longitud: -100.309328, radio: 80 },
      { id: '4', nombre: 'Heroes del 47', latitud: 25.673646, longitud: -100.302654, radio: 80 },
    ];
    setLocations(savedLocations);
    setHasChanges(false);
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitud(position.coords.latitude.toFixed(6));
          setLongitud(position.coords.longitude.toFixed(6));
          if (position.coords.altitude) {
            setAltitud(position.coords.altitude.toFixed(2));
          }
        },
        (error) => {
          let errorMessage = t.alerts.noLocation;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t.alerts.permissionDenied;
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = t.alerts.positionUnavailable;
              break;
            case error.TIMEOUT:
              errorMessage = t.alerts.timeout;
              break;
          }
          console.warn('Error obteniendo ubicación:', error.message || error);
          alert(errorMessage);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert(t.alerts.unsupported);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[#143675] dark:bg-[#0f2855]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {t.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Info banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              {t.banner}
            </p>
          </div>

          {/* Counter */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{t.activeLocations(locations.length)}</span> ·{' '}
            {hasChanges ? (
              <span className="text-orange-600 dark:text-orange-400">
                {t.unsavedChanges}
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-400">{t.noPendingChanges}</span>
            )}
          </div>

          {/* Form to add new location */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.fields.name}
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder={t.placeholders.name}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.fields.latitude}
                </label>
                <input
                  type="text"
                  value={latitud}
                  onChange={(e) => setLatitud(e.target.value)}
                  placeholder="21.1619"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.fields.longitude}
                </label>
                <input
                  type="text"
                  value={longitud}
                  onChange={(e) => setLongitud(e.target.value)}
                  placeholder="-86.8515"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.fields.googleMapsLink}
                </label>
                <input
                  type="text"
                  value={enlaceGoogleMaps}
                  onChange={(e) => setEnlaceGoogleMaps(e.target.value)}
                  placeholder={t.placeholders.googleMapsLink}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                onClick={extractCoordinates}
                variant="outline"
                className="whitespace-nowrap"
              >
                {t.buttons.extract}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.fields.altitude}
                </label>
                <input
                  type="text"
                  value={altitud}
                  onChange={(e) => setAltitud(e.target.value)}
                  placeholder={t.placeholders.altitude}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.fields.radius}
                </label>
                <input
                  type="number"
                  value={radio}
                  onChange={(e) => setRadio(e.target.value)}
                  placeholder="80"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={getCurrentLocation}
                variant="outline"
                className="gap-2"
              >
                <MapPin className="h-4 w-4" />
                {t.buttons.here}
              </Button>
              <Button
                onClick={handleAgregar}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                + {t.buttons.add}
              </Button>
            </div>
          </div>

          {/* Locations table */}
          {locations.length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.table.name}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.table.lat}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.table.lng}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.table.radius}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.table.action}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {locations.map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {location.nombre}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {location.latitud}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {location.longitud}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {location.radio} m
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          onClick={() => handleQuitar(location.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          {t.buttons.remove}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tip */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-900 dark:text-yellow-200">
              <span className="font-medium">Tip:</span> {t.tip}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <Button
            onClick={handleCargar}
            variant="outline"
            className="gap-2"
          >
            🔄 {t.buttons.load}
          </Button>
          <div className="flex items-center gap-3">
            <Button onClick={onClose} variant="outline">
              {t.buttons.close}
            </Button>
            <Button
              onClick={handleGuardar}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              disabled={!hasChanges}
            >
              💾 {t.buttons.save}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
