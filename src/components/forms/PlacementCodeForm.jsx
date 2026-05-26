import { useState } from 'react';
import { Button } from '../ui/Button';

export function PlacementCodeForm({ onStart }) {
  const [code, setCode] = useState('');
  return (
    <form onSubmit={(event) => { event.preventDefault(); onStart(code); }} className="flex flex-col gap-3 sm:flex-row">
      <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Unique placement code" className="min-w-0 flex-1 rounded-md border border-white/10 bg-taxo-dark p-3" required />
      <Button type="submit">Start test</Button>
    </form>
  );
}
