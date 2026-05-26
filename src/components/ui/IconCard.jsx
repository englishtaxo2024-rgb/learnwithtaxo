export function IconCard({ icon: Icon, title, value, children }) {
  return (
    <div className="glass rounded-lg p-5 transition duration-200 hover:-translate-y-1">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-taxo-gold/15 text-taxo-gold">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {value && <p className="mt-1 text-2xl font-black text-taxo-light">{value}</p>}
      {children && <div className="mt-3 text-sm text-taxo-light/80">{children}</div>}
    </div>
  );
}
