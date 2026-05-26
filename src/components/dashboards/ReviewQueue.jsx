import { AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function ReviewQueue({ items }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3"><AlertTriangle className="text-taxo-gold" /><h3 className="text-lg font-bold">Admin Review Queue</h3></div>
      <div className="space-y-3">
        {items.map((item) => <div key={item.id} className="rounded-md bg-white/5 p-3"><Badge tone="gold">{item.reason}</Badge><p className="mt-2 text-sm text-taxo-light">{item.title}</p></div>)}
      </div>
    </Card>
  );
}
