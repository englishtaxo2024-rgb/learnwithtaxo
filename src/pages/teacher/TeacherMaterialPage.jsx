import { useEffect, useState } from 'react';
import { MaterialViewer } from '../../components/material/MaterialViewer';
import { LoadingState } from '../../components/ui/LoadingState';
import { getMaterialMap } from '../../services/materialService';

export function TeacherMaterialPage() {
  const [material, setMaterial] = useState(null);
  useEffect(() => { getMaterialMap().then(setMaterial); }, []);
  if (!material) return <LoadingState />;
  return <div className="space-y-5"><h1 className="text-3xl font-black">Assigned Material</h1><MaterialViewer material={material} /></div>;
}
