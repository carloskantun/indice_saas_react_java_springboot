import { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useLanguage } from '../../../../shared/context';

interface AvailableModule {
  id: string;
  name: string;
  emoji: string;
  category: 'basic' | 'complementary' | 'ai';
}

interface UserModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  availableModules: AvailableModule[];
  selectedModules: string[];
  onSave: (modules: string[]) => Promise<void> | void;
}

export function UserModulesModal({
  isOpen,
  onClose,
  userName,
  availableModules,
  selectedModules,
  onSave,
}: UserModulesModalProps) {
  const { currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en-US' || currentLanguage.code === 'en-CA';
  const [selected, setSelected] = useState<string[]>(selectedModules);

  useEffect(() => {
    if (isOpen) {
      setSelected(selectedModules);
    }
  }, [isOpen, selectedModules]);

  const sections = useMemo(() => ([
    { key: 'basic', title: isEnglish ? '📦 Basic Modules' : '📦 Módulos básicos' },
    { key: 'complementary', title: isEnglish ? '🔧 Complementary Modules' : '🔧 Módulos complementarios' },
    { key: 'ai', title: isEnglish ? '🤖 Artificial Intelligence' : '🤖 Inteligencia artificial' },
  ]), [isEnglish]);

  const text = {
    title: isEnglish ? 'Manage Modules' : 'Gestionar Módulos',
    selected: isEnglish ? 'selected' : 'seleccionados',
    moduleWord: isEnglish ? 'modules' : 'módulos',
    save: isEnglish ? 'Save changes' : 'Guardar cambios',
  };

  if (!isOpen) {
    return null;
  }

  const toggleModule = (moduleId: string) => {
    setSelected((prev) => (
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    ));
  };

  const handleSave = async () => {
    await onSave(selected);
    onClose();
  };

  const handleClose = () => {
    setSelected(selectedModules);
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
          {sections.map((section) => (
            <div key={section.key}>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">{section.title}</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {availableModules
                  .filter((module) => module.category === section.key)
                  .map((module) => {
                    const isSelected = selected.includes(module.id);
                    return (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        className={`flex items-center justify-between rounded-xl border-2 p-3 text-left transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{module.emoji}</span>
                          <span className="text-sm font-medium text-gray-900">{module.name}</span>
                        </div>
                        {isSelected ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{selected.length} {text.moduleWord} {text.selected}</p>
            <Button onClick={handleSave} className="bg-purple-600 text-white hover:bg-purple-700">
              {text.save}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
