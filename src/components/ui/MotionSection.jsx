export function MotionSection({ children, className = '', delay = 0 }) {
  return (
    <section className={`motion-section ${className}`} style={{ '--motion-delay': `${delay}ms` }}>
      {children}
    </section>
  );
}
