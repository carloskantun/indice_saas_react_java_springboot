import { useEffect, useMemo, useState } from 'react';
import { Check, User, Users as UsersIcon, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useLanguage } from '../../../../shared/context';
import type { BusinessUnitOption, ReportingUserOption } from './usersUiData';

interface ReportingUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  currentUserId: string;
  businessUnits: BusinessUnitOption[];
  availableReportingUsers: ReportingUserOption[];
  selectedReportingUsers: string[];
  onSave: (userIds: string[]) => void;
}

export function ReportingUsersModal({
  isOpen,
  onClose,
  userName,
  currentUserId,
  businessUnits,
  availableReportingUsers,
  selectedReportingUsers,
  onSave,
}: ReportingUsersModalProps) {
  const { currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en-US' || currentLanguage.code === 'en-CA';
  const [selected, setSelected] = useState<string[]>(selectedReportingUsers);

  const text = {
    title: isEnglish ? 'Reporting Users' : 'Usuarios Reportantes',
    users: isEnglish ? 'users' : 'usuarios',
    selected: isEnglish ? 'selected' : 'seleccionados',
    save: isEnglish ? 'Save changes' : 'Guardar cambios',
  };

  useEffect(() => {
    if (isOpen) {
      setSelected(selectedReportingUsers);
    }
  }, [isOpen, selectedReportingUsers]);

  const unitNameMap = useMemo(() => Object.fromEntries(
    businessUnits.map((unit) => [unit.id, unit.name]),
  ), [businessUnits]);

  const businessNameMap = useMemo(() => Object.fromEntries(
    businessUnits.flatMap((unit) => unit.businesses.map((business) => [business.id, business.name])),
  ), [businessUnits]);

  const groupedUsers = useMemo(() => availableReportingUsers
    .filter((user) => user.id !== currentUserId)
    .reduce<Record<string, Record<string, ReportingUserOption[]>>>((accumulator, user) => {
      if (!accumulator[user.unitId]) {
        accumulator[user.unitId] = {};
      }
      if (!accumulator[user.unitId][user.businessId]) {
        accumulator[user.unitId][user.businessId] = [];
      }
      accumulator[user.unitId][user.businessId].push(user);
      return accumulator;
    }, {}), [availableReportingUsers, currentUserId]);

  if (!isOpen) {
    return null;
  }

  const toggleUser = (userId: string) => {
    setSelected((prev) => (
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    ));
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  const handleClose = () => {
    setSelected(selectedReportingUsers);
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
          {Object.entries(groupedUsers).map(([unitId, businesses]) => (
            <div key={unitId} className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-fuchsia-600">
                <UsersIcon className="h-5 w-5" />
                <span>{unitNameMap[unitId] ?? unitId}</span>
              </div>

              {Object.entries(businesses).map(([businessId, users]) => (
                <div key={businessId} className="ml-3 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">{businessNameMap[businessId] ?? businessId}</h4>
                  <div className="ml-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleUser(user.id)}
                        className={`flex items-center justify-between rounded-xl border-2 p-3 text-left transition-all ${
                          selected.includes(user.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <User className="h-4 w-4 flex-shrink-0 text-gray-500" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        {selected.includes(user.id) ? (
                          <div className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{selected.length} {text.users} {text.selected}</p>
            <Button onClick={handleSave} className="bg-purple-600 text-white hover:bg-purple-700">
              {text.save}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
