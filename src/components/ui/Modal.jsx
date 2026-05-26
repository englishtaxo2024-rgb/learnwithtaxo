import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="glass w-full max-w-xl rounded-lg p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button variant="secondary" onClick={onClose} aria-label="Close"><X size={18} /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}
