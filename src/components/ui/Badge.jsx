export function Badge({ children, tone = 'blue' }) {
  const tones = {
    blue: 'bg-taxo-bright/15 text-taxo-light border-taxo-bright/30',
    gold: 'bg-taxo-gold/15 text-taxo-gold border-taxo-gold/30',
    green: 'bg-emerald-400/15 text-emerald-200 border-emerald-300/30',
    red: 'bg-red-500/15 text-red-100 border-red-400/30'
  };
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}
