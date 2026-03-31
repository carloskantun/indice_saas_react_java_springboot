import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { configCenterApi, type ConfigCenterCurrentUser } from '../../../api/configCenter';
import { useLanguage } from '../../../shared/context';

const inputClassName =
  'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all';

const splitPhone = (phone: string | undefined) => {
  const normalizedPhone = (phone ?? '').trim();
  if (!normalizedPhone) {
    return { prefix: '+52', number: '' };
  }

  const match = normalizedPhone.match(/^(\+\d{1,3})\s*(.*)$/);
  if (!match) {
    return { prefix: '+52', number: normalizedPhone };
  }

  return {
    prefix: match[1],
    number: match[2],
  };
};

export default function Profile() {
  const { t } = useLanguage();
  const [user, setUser] = useState<ConfigCenterCurrentUser | null>(null);
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [maternalLastName, setMaternalLastName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+52');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('es-419');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    let active = true;

    configCenterApi.getCurrentUser()
      .then((response) => {
        if (!active) {
          return;
        }
        setUser(response);
        setFirstName(response.primer_nombre ?? response.nombres ?? '');
        setSecondName(response.segundo_nombre ?? '');
        setLastName(response.apellido_paterno ?? response.apellidos ?? '');
        setMaternalLastName(response.apellido_materno ?? '');
        const phoneParts = splitPhone(response.telefono);
        setPhonePrefix(phoneParts.prefix);
        setPhoneNumber(phoneParts.number);
        setPreferredLanguage(response.preferred_language ?? 'es-419');
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load profile.');
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const firstNames = useMemo(
    () => [firstName, secondName].filter((value) => value.trim().length > 0).join(' ').trim(),
    [firstName, secondName],
  );

  const lastNames = useMemo(
    () => [lastName, maternalLastName].filter((value) => value.trim().length > 0).join(' ').trim(),
    [lastName, maternalLastName],
  );

  const initials = ((firstNames[0] ?? '') + (lastNames[0] ?? '')).trim().toUpperCase() || 'U';

  const handleSaveProfile = async () => {
    if (!user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSaveMessage('');

    try {
      const response = await configCenterApi.saveCurrentUser({
        primer_nombre: firstName,
        segundo_nombre: secondName,
        apellido_paterno: lastName,
        apellido_materno: maternalLastName,
        telefono: phoneNumber.trim() ? `${phonePrefix} ${phoneNumber.trim()}` : '',
        preferred_language: preferredLanguage,
      });

      setUser(response);
      setSaveMessage('Profile saved.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-6 border border-purple-200 dark:border-purple-700/30 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              {t.panelInicial.profile.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.panelInicial.profile.subtitle}
            </p>
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={isLoading || isSaving}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? 'Saving...' : 'Save profile'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700 dark:border-purple-700/30 dark:bg-purple-900/20 dark:text-purple-300">
          Loading profile...
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

      {saveMessage ? (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700/30 dark:bg-green-900/20 dark:text-green-300">
          {saveMessage}
        </div>
      ) : null}

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-700/30 dark:bg-blue-900/20 dark:text-blue-300">
        Profile data in this screen now loads from and saves through the Spring backend.
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Identidad
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tu foto y tu nombre para la interfaz.
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t.panelInicial.profile.fields.profilePhoto}
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-md">
              {initials}
            </div>
            <div>
              <button disabled className="px-4 py-2 bg-purple-600/70 text-white rounded-lg text-sm font-medium cursor-not-allowed">
                📷 {t.panelInicial.profile.fields.uploadPhoto}
              </button>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                JPG/PNG, Máx 1MB
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Nombre y apellidos
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Nombre o nombres
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className={inputClassName}
              />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                En algunos países puedes usar uno o varios nombres.
              </p>
              <input
                type="text"
                value={secondName}
                onChange={(event) => setSecondName(event.target.value)}
                className={`${inputClassName} mt-2`}
                placeholder="Segundo nombre"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Apellido o apellidos
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className={inputClassName}
              />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Puede ser 1 (USA/Canadá) o 2 (México/Colombia).
              </p>
              <input
                type="text"
                value={maternalLastName}
                onChange={(event) => setMaternalLastName(event.target.value)}
                className={`${inputClassName} mt-2`}
                placeholder="Segundo apellido"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Información de contacto
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Datos para notificaciones y comunicación.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.panelInicial.profile.fields.email}
          </label>
          <input type="email" value={user?.email ?? ''} readOnly className={inputClassName} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.panelInicial.profile.fields.phone} <span className="text-gray-400 text-[11px]">(opcional)</span>
          </label>
          <div className="flex gap-2">
            <select value={phonePrefix} onChange={(event) => setPhonePrefix(event.target.value)} className={`${inputClassName} w-auto`}>
              <option value="+1">🇺🇸 +1</option>
              <option value="+52">🇲🇽 +52</option>
              <option value="+34">🇪🇸 +34</option>
              <option value="+57">🇨🇴 +57</option>
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              className={`${inputClassName} flex-1`}
            />
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Selecciona tu país para prefijar la clave.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Seguridad de la cuenta
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Actualiza tu contraseña cuando lo necesites.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva contraseña
            </label>
            <input type="password" placeholder="••••••••" disabled className={inputClassName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar nueva contraseña
            </label>
            <input type="password" placeholder="••••••••" disabled className={inputClassName} />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
          Si no quieres cambiarla, déjala vacía.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preferencias
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Personaliza el idioma de la interfaz.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Idioma preferido
          </label>
          <select
            value={preferredLanguage}
            onChange={(event) => setPreferredLanguage(event.target.value)}
            className={`${inputClassName} appearance-none cursor-pointer`}
          >
            <option value="es-419">🇲🇽 Español (Latinoamérica)</option>
            <option value="es-ES">🇪🇸 Español (España)</option>
            <option value="en-US">🇺🇸 English (US)</option>
            <option value="en-GB">🇬🇧 English (UK)</option>
            <option value="pt-BR">🇧🇷 Português (Brasil)</option>
            <option value="fr-CA">🇫🇷 Français (Canada)</option>
          </select>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Usaremos este idioma para la interfaz y plantillas.
          </p>
        </div>
      </div>
    </div>
  );
}
