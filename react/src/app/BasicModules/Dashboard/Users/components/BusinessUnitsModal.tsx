import { useEffect, useState } from 'react';
import { Briefcase, Building2, Check, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useLanguage } from '../../../../shared/context';
import type { BusinessUnitOption } from './usersUiData';

interface BusinessUnitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  businessUnits: BusinessUnitOption[];
  selectedUnits: string[];
  selectedBusinesses: string[];
  onSave: (data: { units: string[]; businesses: string[] }) => void;
}

export function BusinessUnitsModal({
  isOpen,
  onClose,
  userName,
  businessUnits,
  selectedUnits,
  selectedBusinesses,
  onSave,
}: BusinessUnitsModalProps) {
  const { currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en-US' || currentLanguage.code === 'en-CA';
  const [units, setUnits] = useState<string[]>(selectedUnits);
  const [businesses, setBusinesses] = useState<string[]>(selectedBusinesses);

  const text = {
    title: isEnglish ? 'Units and Businesses' : 'Unidades y Negocios',
    units: isEnglish ? 'units' : 'unidades',
    businesses: isEnglish ? 'businesses' : 'negocios',
    selected: isEnglish ? 'selected' : 'seleccionados',
    save: isEnglish ? 'Save changes' : 'Guardar cambios',
  };

  useEffect(() => {
    if (isOpen) {
      setUnits(selectedUnits);
      setBusinesses(selectedBusinesses);
    }
  }, [isOpen, selectedUnits, selectedBusinesses]);

  if (!isOpen) {
    return null;
  }

  const toggleUnit = (unitId: string) => {
    const nextUnits = units.includes(unitId)
      ? units.filter((id) => id !== unitId)
      : [...units, unitId];
    setUnits(nextUnits);

    if (!nextUnits.includes(unitId)) {
      const matchingUnit = businessUnits.find((unit) => unit.id === unitId);
      if (matchingUnit) {
        const businessIds = matchingUnit.businesses.map((business) => business.id);
        setBusinesses((prev) => prev.filter((id) => !businessIds.includes(id)));
      }
    }
  };

  const toggleBusiness = (businessId: string, unitId: string) => {
    const nextBusinesses = businesses.includes(businessId)
      ? businesses.filter((id) => id !== businessId)
      : [...businesses, businessId];
    setBusinesses(nextBusinesses);

    if (!units.includes(unitId) && !businesses.includes(businessId)) {
      setUnits((prev) => [...prev, unitId]);
    }
  };

  const handleSave = () => {
    onSave({ units, businesses });
    onClose();
  };

  const handleClose = () => {
    setUnits(selectedUnits);
    setBusinesses(selectedBusinesses);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[22px] font-bold text-gray-900">{text.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{userName}</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {businessUnits.map((unit) => (
            <div key={unit.id} className="space-y-3">
              <button
                type="button"
                onClick={() => toggleUnit(unit.id)}
                className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all ${
                  units.includes(unit.id)
                    ? 'border-fuchsia-500 bg-fuchsia-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-fuchsia-600" />
                  <span className="font-semibold text-gray-900">{unit.name}</span>
                </div>
                {units.includes(unit.id) ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : null}
              </button>

              {units.includes(unit.id) ? (
                <div className="ml-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {unit.businesses.map((business) => (
                    <button
                      key={business.id}
                      type="button"
                      onClick={() => toggleBusiness(business.id, unit.id)}
                      className={`flex items-center justify-between rounded-xl border-2 p-3 text-left transition-all ${
                        businesses.includes(business.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{business.name}</span>
                      </div>
                      {businesses.includes(business.id) ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {units.length} {text.units}, {businesses.length} {text.businesses} {text.selected}
            </p>
            <Button onClick={handleSave} className="bg-purple-600 text-white hover:bg-purple-700">
              {text.save}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
