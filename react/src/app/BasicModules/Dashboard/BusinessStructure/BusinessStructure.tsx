import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useLanguage } from '../../../shared/context';
import { configCenterApi } from '../../../api/configCenter';
import { inputClassName, textareaClassName, industryOptions, countryOptions } from './constants';
import { BusinessIdentitySection } from './components/BusinessIdentitySection';
import { OperationTypeSection } from './components/OperationTypeSection';
import { UnitsSection } from './components/UnitsSection';
import type { EditingNegocio, EstructuraType, Negocio, Unidad } from './types';

const readImageAsPreview = (
  event: ChangeEvent<HTMLInputElement>,
  onLoad: (preview: string) => void,
) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    onLoad(String(reader.result ?? ''));
  };
  reader.readAsDataURL(file);
};

export default function BusinessStructure() {
  const { t } = useLanguage();
  const [estructuraType, setEstructuraType] = useState<EstructuraType>('simple');
  const [unidades, setUnidades] = useState<Unidad[]>([
    { id: '1', name: 'Principal', negocios: [] },
  ]);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [showUnidadModal, setShowUnidadModal] = useState(false);
  const [showNegocioModal, setShowNegocioModal] = useState(false);
  const [editingUnidad, setEditingUnidad] = useState<Unidad | null>(null);
  const [editingNegocio, setEditingNegocio] = useState<EditingNegocio | null>(null);
  const [unidadLogoPreview, setUnidadLogoPreview] = useState('');
  const [negocioLogoPreview, setNegocioLogoPreview] = useState('');

  useEffect(() => {
    let active = true;

    Promise.allSettled([configCenterApi.getEmpresa(), configCenterApi.getConfig()])
      .then((results) => {
        if (!active) {
          return;
        }

        const empresaResult = results[0];
        const configResult = results[1];

        const empresa = empresaResult.status === 'fulfilled' ? empresaResult.value : null;
        const config = configResult.status === 'fulfilled' ? configResult.value : null;

        const resolvedStructure = (config?.estructura ?? empresa?.estructura ?? 'simple') as EstructuraType;
        const resolvedMap = config?.map ?? empresa?.map ?? [];

        setEstructuraType(resolvedStructure === 'multi' ? 'multi' : 'simple');
        setCompanyName(empresa?.nombre_empresa ?? '');
        setIndustry((empresa?.industria as string) ?? '');
        setDescription((empresa?.descripcion as string) ?? '');

        if (Array.isArray(resolvedMap) && resolvedMap.length > 0) {
          setUnidades(
            resolvedMap.map((unidad, unidadIndex) => ({
              id: `unit-${unidadIndex}-${unidad.name}`,
              name: unidad.name,
              legacyUnitId: unidad.legacy_unit_id,
              logo: unidad.logo,
              industria: unidad.industria,
              direccion: unidad.direccion,
              ciudad: unidad.ciudad,
              estado: unidad.estado,
              pais: unidad.pais,
              cp: unidad.cp,
              telefono: unidad.telefono,
              email: unidad.email,
              negocios: (unidad.businesses ?? []).map((negocio, negocioIndex) => ({
                id: `biz-${unidadIndex}-${negocioIndex}-${negocio.name}`,
                name: negocio.name,
                legacyBusinessId: negocio.legacy_business_id,
                logo: negocio.logo,
                industria: negocio.industria,
                direccion: negocio.direccion,
                ciudad: negocio.ciudad,
                estado: negocio.estado,
                pais: negocio.pais,
                cp: negocio.cp,
                telefono: negocio.telefono,
                email: negocio.email,
                gerente: negocio.gerente,
                horario: negocio.horario,
              })),
            })),
          );
        } else {
          setUnidades([{ id: '1', name: 'Principal', negocios: [] }]);
        }
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : 'Unable to load business structure.');
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

  useEffect(() => {
    if (editingUnidad?.logo && showUnidadModal) {
      setUnidadLogoPreview(editingUnidad.logo);
    } else if (!showUnidadModal) {
      setUnidadLogoPreview('');
    }
  }, [editingUnidad, showUnidadModal]);

  useEffect(() => {
    if (editingNegocio?.logo && showNegocioModal) {
      setNegocioLogoPreview(editingNegocio.logo);
    } else if (!showNegocioModal) {
      setNegocioLogoPreview('');
    }
  }, [editingNegocio, showNegocioModal]);

  const closeUnidadModal = () => {
    setShowUnidadModal(false);
    setEditingUnidad(null);
    setUnidadLogoPreview('');
  };

  const closeNegocioModal = () => {
    setShowNegocioModal(false);
    setEditingNegocio(null);
    setNegocioLogoPreview('');
  };

  const handleEstructuraTypeChange = (nextType: EstructuraType) => {
    setEstructuraType(nextType);

    if (nextType === 'simple') {
      closeUnidadModal();
      closeNegocioModal();
    }
  };

  const handleDeleteUnidad = (unidadId: string) => {
    setUnidades((prevUnidades) => prevUnidades.filter((unidad) => unidad.id !== unidadId));
  };

  const handleDeleteNegocio = (unidadId: string, negocioId: string) => {
    setUnidades((prevUnidades) =>
      prevUnidades.map((unidad) =>
        unidad.id === unidadId
          ? {
              ...unidad,
              negocios: unidad.negocios.filter((negocio) => negocio.id !== negocioId),
            }
          : unidad,
      ),
    );
  };

  const handleSaveUnidad = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newUnidad: Unidad = {
      id: editingUnidad?.id || String(Date.now()),
      name: String(formData.get('name') || ''),
      logo: unidadLogoPreview || editingUnidad?.logo || '',
      industria: String(formData.get('industria') || ''),
      direccion: String(formData.get('direccion') || ''),
      ciudad: String(formData.get('ciudad') || ''),
      estado: String(formData.get('estado') || ''),
      pais: String(formData.get('pais') || ''),
      cp: String(formData.get('cp') || ''),
      telefono: String(formData.get('telefono') || ''),
      email: String(formData.get('email') || ''),
      negocios: editingUnidad?.negocios || [],
    };

    setUnidades((prevUnidades) =>
      editingUnidad
        ? prevUnidades.map((unidad) => (unidad.id === editingUnidad.id ? newUnidad : unidad))
        : [...prevUnidades, newUnidad],
    );

    closeUnidadModal();
  };

  const handleSaveNegocio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingNegocio?.unidadId) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const newNegocio: Negocio = {
      id: editingNegocio.id || String(Date.now()),
      name: String(formData.get('name') || ''),
      logo: negocioLogoPreview || editingNegocio.logo || '',
      industria: String(formData.get('industria') || ''),
      direccion: String(formData.get('direccion') || ''),
      ciudad: String(formData.get('ciudad') || ''),
      estado: String(formData.get('estado') || ''),
      pais: String(formData.get('pais') || ''),
      cp: String(formData.get('cp') || ''),
      telefono: String(formData.get('telefono') || ''),
      email: String(formData.get('email') || ''),
      gerente: String(formData.get('gerente') || ''),
      horario: String(formData.get('horario') || ''),
    };

    setUnidades((prevUnidades) =>
      prevUnidades.map((unidad) => {
        if (unidad.id !== editingNegocio.unidadId) {
          return unidad;
        }

        if (editingNegocio.id) {
          return {
            ...unidad,
            negocios: unidad.negocios.map((negocio) =>
              negocio.id === editingNegocio.id ? newNegocio : negocio,
            ),
          };
        }

        return {
          ...unidad,
          negocios: [...unidad.negocios, newNegocio],
        };
      }),
    );

    closeNegocioModal();
  };

  const handleEditUnidad = (unidad: Unidad) => {
    setEditingUnidad(unidad);
    setShowUnidadModal(true);
  };

  const handleCreateUnidad = () => {
    setEditingUnidad(null);
    setShowUnidadModal(true);
  };

  const handleEditNegocio = (negocio: Negocio, unidadId: string) => {
    setEditingNegocio({ ...negocio, unidadId });
    setShowNegocioModal(true);
  };

  const handleCreateNegocio = (unidadId: string) => {
    setEditingNegocio({ unidadId });
    setShowNegocioModal(true);
  };

  const handlePersistBusinessStructure = async () => {
    setIsSaving(true);
    setSaveMessage('');
    setLoadError('');

    try {
      await configCenterApi.saveConfig({
        estructura: estructuraType,
        map:
          estructuraType === 'multi'
            ? unidades.map((unidad) => ({
                name: unidad.name,
                legacy_unit_id: unidad.legacyUnitId,
                logo: unidad.logo,
                industria: unidad.industria,
                direccion: unidad.direccion,
                ciudad: unidad.ciudad,
                estado: unidad.estado,
                pais: unidad.pais,
                cp: unidad.cp,
                telefono: unidad.telefono,
                email: unidad.email,
                businesses: unidad.negocios.map((negocio) => ({
                  name: negocio.name,
                  legacy_business_id: negocio.legacyBusinessId,
                  logo: negocio.logo,
                  industria: negocio.industria,
                  direccion: negocio.direccion,
                  ciudad: negocio.ciudad,
                  estado: negocio.estado,
                  pais: negocio.pais,
                  cp: negocio.cp,
                  telefono: negocio.telefono,
                  email: negocio.email,
                  gerente: negocio.gerente,
                  horario: negocio.horario,
                })),
              }))
            : [],
      });

      await configCenterApi.saveEmpresa({
        nombre_empresa: companyName,
        industria: industry,
        descripcion: description,
      });

      setSaveMessage('Business structure saved to the Spring backend.');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to save business structure.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-6 border border-purple-200 dark:border-purple-700/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              {t.panelInicial.structure.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.panelInicial.structure.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Spring backend connected</span>
            </div>
            <Button
              onClick={handlePersistBusinessStructure}
              disabled={isSaving || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700 dark:border-purple-700/30 dark:bg-purple-900/20 dark:text-purple-300">
          Loading business structure...
        </div>
      ) : null}

      {loadError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-300">
          {loadError}
        </div>
      ) : null}

      {saveMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700/30 dark:bg-green-900/20 dark:text-green-300">
          {saveMessage}
        </div>
      ) : null}

      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-700/30 dark:bg-blue-900/20 dark:text-blue-300">
        This screen now loads from and saves to the Spring backend. Company identity plus the unit and business details captured in this form are persisted through Spring.
      </div>

      <OperationTypeSection
        estructuraType={estructuraType}
        structure={t.panelInicial.structure}
        onEstructuraTypeChange={handleEstructuraTypeChange}
      />

      {estructuraType === 'multi' && (
        <UnitsSection
          unidades={unidades}
          structure={t.panelInicial.structure}
          onEditUnidad={handleEditUnidad}
          onDeleteUnidad={handleDeleteUnidad}
          onEditNegocio={handleEditNegocio}
          onDeleteNegocio={handleDeleteNegocio}
          onCreateNegocio={handleCreateNegocio}
          onCreateUnidad={handleCreateUnidad}
        />
      )}

      <BusinessIdentitySection
        estructuraType={estructuraType}
        structure={t.panelInicial.structure}
        companyName={companyName}
        industry={industry}
        description={description}
        onCompanyNameChange={setCompanyName}
        onIndustryChange={setIndustry}
        onDescriptionChange={setDescription}
      />

      {showUnidadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-purple-600 dark:bg-purple-700">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {editingUnidad
                    ? t.panelInicial.structure.modal.editUnit
                    : t.panelInicial.structure.modal.newUnit}
                </h3>
                <p className="text-sm text-purple-100 mt-1">
                  {editingUnidad
                    ? `Edita los datos de ${editingUnidad.name}`
                    : 'Agrega una nueva unidad operativa'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeUnidadModal}
                className="p-2 hover:bg-purple-700 dark:hover:bg-purple-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form
              onSubmit={handleSaveUnidad}
              className="overflow-y-auto max-h-[calc(90vh-160px)]"
            >
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Información básica
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre de la unidad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingUnidad?.name || ''}
                        required
                        placeholder="Ej. Ciudad de México, Norte, Región Centro..."
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Logo <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                      </label>
                      <div className="flex items-start gap-4">
                        {(unidadLogoPreview || editingUnidad?.logo) && (
                          <div className="flex-shrink-0">
                            <img
                              src={unidadLogoPreview || editingUnidad?.logo}
                              alt="Logo preview"
                              className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => readImageAsPreview(event, setUnidadLogoPreview)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 dark:file:bg-purple-900/30 dark:file:text-purple-400 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50 file:cursor-pointer"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Sube una imagen (PNG, JPG, max 5MB)
                          </p>
                          {(unidadLogoPreview || editingUnidad?.logo) && (
                            <button
                              type="button"
                              onClick={() => {
                                setUnidadLogoPreview('');
                                if (editingUnidad) {
                                  setEditingUnidad({ ...editingUnidad, logo: '' });
                                }
                              }}
                              className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1"
                            >
                              Eliminar logo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Industria <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                      </label>
                      <select
                        name="industria"
                        defaultValue={editingUnidad?.industria || ''}
                        className={`${inputClassName} appearance-none cursor-pointer`}
                      >
                        <option value="">Seleccionar industria...</option>
                        {industryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Ubicación <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        defaultValue={editingUnidad?.direccion || ''}
                        placeholder="Calle, número, colonia..."
                        className={inputClassName}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          name="ciudad"
                          defaultValue={editingUnidad?.ciudad || ''}
                          placeholder="Ciudad"
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estado/Provincia
                        </label>
                        <input
                          type="text"
                          name="estado"
                          defaultValue={editingUnidad?.estado || ''}
                          placeholder="Estado"
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          C.P.
                        </label>
                        <input
                          type="text"
                          name="cp"
                          defaultValue={editingUnidad?.cp || ''}
                          placeholder="00000"
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        País
                      </label>
                      <select
                        name="pais"
                        defaultValue={editingUnidad?.pais || ''}
                        className={`${inputClassName} appearance-none cursor-pointer`}
                      >
                        <option value="">Seleccionar país...</option>
                        {countryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Contacto <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        defaultValue={editingUnidad?.telefono || ''}
                        placeholder="+52 55 1234 5678"
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={editingUnidad?.email || ''}
                        placeholder="unidad@empresa.com"
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <Button
                  type="button"
                  onClick={closeUnidadModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  {t.panelInicial.structure.modal.cancel}
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                  {t.panelInicial.structure.modal.save}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNegocioModal && editingNegocio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-purple-600 dark:bg-purple-700">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {editingNegocio.id
                    ? t.panelInicial.structure.modal.editBusiness
                    : t.panelInicial.structure.modal.newBusiness}
                </h3>
                <p className="text-sm text-purple-100 mt-1">
                  {editingNegocio.id
                    ? `Edita los datos de ${editingNegocio.name}`
                    : 'Agrega un nuevo negocio/sucursal'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeNegocioModal}
                className="p-2 hover:bg-purple-700 dark:hover:bg-purple-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form
              onSubmit={handleSaveNegocio}
              className="overflow-y-auto max-h-[calc(90vh-160px)]"
            >
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Información básica
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre del negocio <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingNegocio.name || ''}
                        required
                        placeholder="Ej. Sucursal Centro, Tienda Polanco, Almacén Sur..."
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Logo <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                      </label>
                      <div className="flex items-start gap-4">
                        {(negocioLogoPreview || editingNegocio.logo) && (
                          <div className="flex-shrink-0">
                            <img
                              src={negocioLogoPreview || editingNegocio.logo}
                              alt="Logo preview"
                              className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => readImageAsPreview(event, setNegocioLogoPreview)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 dark:file:bg-purple-900/30 dark:file:text-purple-400 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50 file:cursor-pointer"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Sube una imagen (PNG, JPG, max 5MB)
                          </p>
                          {(negocioLogoPreview || editingNegocio.logo) && (
                            <button
                              type="button"
                              onClick={() => {
                                setNegocioLogoPreview('');
                                setEditingNegocio((prevNegocio) =>
                                  prevNegocio ? { ...prevNegocio, logo: '' } : prevNegocio,
                                );
                              }}
                              className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1"
                            >
                              Eliminar logo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Industria <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                      </label>
                      <select
                        name="industria"
                        defaultValue={editingNegocio.industria || ''}
                        className={`${inputClassName} appearance-none cursor-pointer`}
                      >
                        <option value="">Seleccionar industria...</option>
                        {industryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Ubicación <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        defaultValue={editingNegocio.direccion || ''}
                        placeholder="Calle, número, colonia..."
                        className={inputClassName}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          name="ciudad"
                          defaultValue={editingNegocio.ciudad || ''}
                          placeholder="Ciudad"
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estado/Provincia
                        </label>
                        <input
                          type="text"
                          name="estado"
                          defaultValue={editingNegocio.estado || ''}
                          placeholder="Estado"
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          C.P.
                        </label>
                        <input
                          type="text"
                          name="cp"
                          defaultValue={editingNegocio.cp || ''}
                          placeholder="00000"
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        País
                      </label>
                      <select
                        name="pais"
                        defaultValue={editingNegocio.pais || ''}
                        className={`${inputClassName} appearance-none cursor-pointer`}
                      >
                        <option value="">Seleccionar país...</option>
                        {countryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Información operativa{' '}
                    <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          defaultValue={editingNegocio.telefono || ''}
                          placeholder="+52 55 1234 5678"
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={editingNegocio.email || ''}
                          placeholder="negocio@empresa.com"
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gerente/Responsable
                        </label>
                        <input
                          type="text"
                          name="gerente"
                          defaultValue={editingNegocio.gerente || ''}
                          placeholder="Nombre del responsable"
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Horario
                        </label>
                        <input
                          type="text"
                          name="horario"
                          defaultValue={editingNegocio.horario || ''}
                          placeholder="Lun-Vie 9:00-18:00"
                          className={inputClassName}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <Button
                  type="button"
                  onClick={closeNegocioModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  {t.panelInicial.structure.modal.cancel}
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                  {editingNegocio.id
                    ? t.panelInicial.structure.modal.save
                    : 'Crear negocio'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
