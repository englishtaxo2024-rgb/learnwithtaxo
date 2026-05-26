import { Inbox } from 'lucide-react';

export function EmptyState({ title = 'Nothing here yet', message = 'New records will appear here after sync or manual entry.' }) {
  return <div className="glass rounded-lg p-8 text-center"><Inbox className="mx-auto mb-3 text-taxo-gold" /><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 text-taxo-light/75">{message}</p></div>;
}
