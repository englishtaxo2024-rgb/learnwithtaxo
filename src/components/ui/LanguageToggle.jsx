import { Languages } from 'lucide-react';

export function LanguageToggle({ language, setLanguage }) {
  return (
    <button title="Language" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-bold text-taxo-light hover:bg-white/15">
      <Languages size={18} /> {language === 'en' ? 'AR' : 'EN'}
    </button>
  );
}
