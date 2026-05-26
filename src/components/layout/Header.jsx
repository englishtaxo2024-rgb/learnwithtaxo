import { Menu } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { LanguageToggle } from '../ui/LanguageToggle';
import { SoundToggle } from '../ui/SoundToggle';

export function Header({ user, language, setLanguage, onMenu }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-taxo-dark/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="rounded-md bg-white/10 p-2 md:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
          <BrandLogo role={user?.role} />
        </div>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <Button variant="secondary" className="hidden sm:inline-flex">{user?.name || 'Guest'}</Button>
        </div>
      </div>
    </header>
  );
}
