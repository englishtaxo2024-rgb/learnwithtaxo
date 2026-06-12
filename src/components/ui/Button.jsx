export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    gold: 'btn-gold',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };
  return (
    <button className={`btn ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
