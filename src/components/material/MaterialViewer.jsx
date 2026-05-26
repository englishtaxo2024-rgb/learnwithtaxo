import { useState } from 'react';
import { MaterialSidebar } from './MaterialSidebar';
import { ProtectedSlideViewer } from './ProtectedSlideViewer';

export function MaterialViewer({ material }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-4 lg:grid-cols-[17rem_1fr]">
      <MaterialSidebar material={material} active={active} setActive={setActive} />
      <ProtectedSlideViewer item={material[active]} />
    </div>
  );
}
