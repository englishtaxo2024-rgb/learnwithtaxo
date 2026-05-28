import { createContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';

export const LanguageContext = createContext({
  lang: 'en',
  dir: 'ltr',
  setLang: () => {},
  t: translations.en
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('taxo_lang') || 'en');
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  function setLang(next) {
    setLangState(next);
    localStorage.setItem('taxo_lang', next);
  }

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo(
    () => ({ lang, dir, setLang, t: translations[lang] || translations.en }),
    [lang, dir]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
