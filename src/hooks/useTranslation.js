import { useContext } from 'react';
import { LanguageContext } from '../i18n/LanguageProvider';

export function useTranslation() {
  return useContext(LanguageContext);
}
