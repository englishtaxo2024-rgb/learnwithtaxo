import { ChevronLeft, ChevronRight, ExternalLink, LogOut, StickyNote } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';

export function ProtectedSlideViewer({ item }) {
  const [slide, setSlide] = useState(1);
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-[#071829]" onContextMenu={(event) => event.preventDefault()}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-taxo-navy p-3">
        <strong>English Taxo Teacher App - {item.course}</strong>
        <div className="flex gap-2">
          <Button variant="secondary"><ExternalLink size={16} /></Button>
          <Button variant="secondary"><StickyNote size={16} /></Button>
          <Button variant="secondary"><LogOut size={16} /></Button>
        </div>
      </div>
      <div className="grid min-h-[330px] place-items-center p-6 text-center">
        <div className="pointer-events-none absolute inset-0 grid rotate-[-18deg] place-items-center text-3xl font-black text-white/5">Learn with Taxo protected view</div>
        <div>
          <p className="text-taxo-gold">PowerPoint-style viewer</p>
          <h3 className="mt-3 text-3xl font-black">{item.level}</h3>
          <p className="mt-2 text-taxo-light">Session {item.session} of protected material - slide {slide}/{item.slides}</p>
          <p className="mt-3 text-sm text-taxo-light/70">Watermark: user, group, date, user ID. View logged. Download hidden.</p>
        </div>
      </div>
      <div className="flex justify-between border-t border-white/10 p-3">
        <Button variant="secondary" onClick={() => setSlide(Math.max(1, slide - 1))}><ChevronLeft size={16} /> Previous</Button>
        <Button variant="secondary" onClick={() => setSlide(Math.min(item.slides, slide + 1))}>Next <ChevronRight size={16} /></Button>
      </div>
    </div>
  );
}
