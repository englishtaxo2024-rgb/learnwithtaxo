export function Card({ children, className = '' }) {
  return <section className={`app-card ${className}`}>{children}</section>;
}
