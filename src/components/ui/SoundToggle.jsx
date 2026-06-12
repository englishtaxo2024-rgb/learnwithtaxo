import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { isSoundEnabled, playSound, setSoundEnabled } from '../../lib/soundManager';

export function SoundToggle() {
  const [on, setOn] = useState(() => isSoundEnabled());

  function toggle() {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
    if (next) playSound('success');
  }

  const Icon = on ? Volume2 : VolumeX;

  return (
    <button
      type="button"
      title={on ? 'Sound Off / إيقاف الصوت' : 'Sound On / تشغيل الصوت'}
      onClick={toggle}
      className="sound-toggle focus-ring"
      aria-pressed={on}
    >
      <Icon size={18} />
      <span>{on ? 'Sound Off' : 'Sound On'}</span>
    </button>
  );
}
