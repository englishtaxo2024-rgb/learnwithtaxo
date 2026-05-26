export function Card({ children, className = '' }) {
  return <section className={`glass rounded-lg p-5 transition duration-200 hover:-translate-y-1 hover:shadow-glow ${className}`}>{children}</section>;
}
