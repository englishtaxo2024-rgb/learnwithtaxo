export function LoadingState({ label = 'Loading secure data...' }) {
  return <div className="glass rounded-lg p-6 text-taxo-light"><span className="mr-3 inline-block h-3 w-3 animate-pulse rounded-full bg-taxo-gold" />{label}</div>;
}
