import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useLanguage } from '../../../../shared/context';

interface InviteUserModalProps {
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onInvite: (data: { name: string; email: string; role: string }) => Promise<void> | void;
}

const emptyForm = {
  name: '',
  email: '',
  role: 'Super Admin',
};

export function InviteUserModal({ isOpen, isSubmitting = false, onClose, onInvite }: InviteUserModalProps) {
  const { currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en-US' || currentLanguage.code === 'en-CA';
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (isOpen) {
      setFormData(emptyForm);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onInvite(formData);
  };

  const text = {
    title: isEnglish ? 'Invite User' : 'Invitar usuario',
    subtitle: isEnglish
      ? 'Enter the user details you want to invite into the system'
      : 'Ingresa los datos del usuario que deseas invitar al sistema',
    fullName: isEnglish ? 'Full name *' : 'Nombre completo *',
    fullNamePlaceholder: isEnglish ? 'Ex: John Perez' : 'Ej: Juan Perez',
    email: isEnglish ? 'Email *' : 'Correo electrónico *',
    role: isEnglish ? 'Role *' : 'Rol *',
    cancel: isEnglish ? 'Cancel' : 'Cancelar',
    send: isEnglish ? 'Send invitation' : 'Enviar invitación',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[410px] rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h3 className="text-[22px] font-semibold text-gray-900">{text.title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {text.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">{text.fullName}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              placeholder={text.fullNamePlaceholder}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">{text.email}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="ejemplo@empresa.com"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">{text.role}</label>
            <select
              value={formData.role}
              onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value }))}
              className="w-full rounded-lg border border-fuchsia-500 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-white text-gray-800 shadow-none ring-1 ring-gray-300 hover:bg-gray-100"
            >
                    {text.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {text.send}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
