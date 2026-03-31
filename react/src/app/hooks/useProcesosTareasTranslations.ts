import { useLanguage } from '../shared/context';
import { procesosTareasTranslations } from '../locales/procesosTareas';

export function useProcesosTareasTranslations() {
  const { currentLanguage } = useLanguage();
  return procesosTareasTranslations[currentLanguage.code as keyof typeof procesosTareasTranslations] || procesosTareasTranslations['es-MX'];
}