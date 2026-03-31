import { useLanguage } from '../shared/context';
import { recursosHumanosTranslations } from '../locales/recursosHumanos';

export function useRecursosHumanosTranslations() {
  const { currentLanguage } = useLanguage();
  return recursosHumanosTranslations[currentLanguage.code as keyof typeof recursosHumanosTranslations] || recursosHumanosTranslations['es-MX'];
}