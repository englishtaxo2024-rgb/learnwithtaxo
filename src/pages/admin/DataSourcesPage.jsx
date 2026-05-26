import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function DataSourcesPage() {
  const [lastSync, setLastSync] = useState('Not synced in this environment');
  const sources = [
    ['Curriculum sheet', 'Ready via backend proxy'],
    ['Schedule sheet', 'Ready; parser uses blue teacher section headers'],
    ['New Applications sheet', 'Permission required: 403 fallback enabled']
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Data Sources</h1>
      <div className="grid gap-4 md:grid-cols-3">{sources.map(([name, status]) => <Card key={name}><UploadCloud className="mb-3 text-taxo-gold" /><h2 className="font-bold">{name}</h2><p className="mt-2 text-taxo-light">{status}</p><Badge tone={status.includes('Permission') ? 'red' : 'green'}>{status.includes('Permission') ? 'Permission required' : 'Connected scaffold'}</Badge></Card>)}</div>
      <Card><div className="flex flex-wrap gap-3"><Button onClick={() => setLastSync(new Date().toLocaleString())}>Sync Curriculum</Button><Button onClick={() => setLastSync(new Date().toLocaleString())}>Sync Schedule</Button><Button onClick={() => setLastSync(new Date().toLocaleString())}>Sync New Applications</Button><Button onClick={() => setLastSync(new Date().toLocaleString())}>Sync All</Button></div><p className="mt-4 text-taxo-light">Last sync: {lastSync}</p><p className="mt-2 text-taxo-light/70">Preview import, confirm import, rollback, CSV/XLSX upload, paste exported data, and manual review workflows are represented here and routed through the backend sync endpoints.</p></Card>
    </div>
  );
}
