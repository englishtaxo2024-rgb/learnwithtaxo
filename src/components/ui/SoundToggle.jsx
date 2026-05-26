import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

export function SoundToggle() {
  const [on, setOn] = useState(() => localStorage.getItem('taxo-sound') !== 'off');
  function toggle() {
    const next = !on;
    setOn(next);
    localStorage.setItem('taxo-sound', next ? 'on' : 'off');
  }
  const Icon = on ? Volume2 : VolumeX;
  return <button title="Sound effects" onClick={toggle} className="rounded-md bg-white/10 p-2 text-taxo-light hover:bg-white/15"><Icon size={18} /></button>;
}
