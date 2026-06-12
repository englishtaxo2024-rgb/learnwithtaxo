import { PremiumImageCard } from './PremiumImageCard';

export function VisualFeatureGrid({ items, columns = 3, variant = 'default' }) {
  return (
    <div className={`visual-feature-grid visual-feature-grid-${columns} visual-feature-grid-${variant}`}>
      {items.map((item) => (
        <PremiumImageCard key={item.key || item.title} {...item} />
      ))}
    </div>
  );
}
