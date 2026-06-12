import { playSound } from '../../lib/soundManager';

export function AnimatedCard({ children, className = '', as: Component = 'div', ...props }) {
  return (
    <Component
      className={`animated-card ${className}`}
      {...props}
      onMouseEnter={(event) => {
        props.onMouseEnter?.(event);
        playSound('hover');
      }}
    >
      {children}
    </Component>
  );
}
