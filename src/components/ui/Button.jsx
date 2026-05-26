export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-taxo-gold text-taxo-dark hover:bg-[#e5c75a] shadow-gold shine',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/15',
    danger: 'bg-red-500/15 text-red-100 border border-red-400/30 hover:bg-red-500/25'
  };
  return (
    <button className={`rounded-md px-4 py-2.5 font-semibold transition duration-200 hover:-translate-y-0.5 disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
