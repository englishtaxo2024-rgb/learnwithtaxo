import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AnimatedCard } from './AnimatedCard';

export function PremiumImageCard({
  image,
  title,
  titleAr,
  description,
  descriptionAr,
  icon: Icon,
  to
}) {
  const content = (
    <AnimatedCard className="premium-image-card">
      <div className="premium-image-wrap">
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
      </div>
      <div className="premium-image-content">
        {Icon && <Icon className="text-taxo-gold" size={24} aria-hidden="true" />}
        <h3>{title}</h3>
        {titleAr && <p className="premium-ar" dir="rtl">{titleAr}</p>}
        <p>{description}</p>
        {descriptionAr && <p dir="rtl">{descriptionAr}</p>}
        {to && <span className="premium-card-link">Open <ArrowRight size={16} /></span>}
      </div>
    </AnimatedCard>
  );

  return to ? <Link to={to} className="block focus-ring">{content}</Link> : content;
}
