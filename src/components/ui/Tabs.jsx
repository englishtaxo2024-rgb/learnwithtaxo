export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)} className={`rounded-md px-4 py-2 text-sm font-bold transition ${active === tab.id ? 'bg-taxo-gold text-taxo-dark' : 'bg-white/10 text-taxo-light hover:bg-white/15'}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
