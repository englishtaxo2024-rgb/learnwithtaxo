import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PageTransition } from './PageTransition';

export function AppShell({ user, area, language, setLanguage, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Header user={user} language={language} setLanguage={setLanguage} onMenu={() => setOpen(true)} />
      <div className="mx-auto grid max-w-7xl md:grid-cols-[18rem_1fr]">
        <Sidebar area={area} open={open} onClose={() => setOpen(false)} />
        {open && <button aria-label="Close menu" className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}
        <div className="p-4 md:p-6">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}
