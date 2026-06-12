import { GraduationCap } from 'lucide-react';
import { PremiumImageCard } from './PremiumImageCard';

export function AnimatedCourseCard({ courseType, image, title, titleAr, description, descriptionAr, to }) {
  return (
    <PremiumImageCard
      image={image}
      title={title || courseType}
      titleAr={titleAr}
      description={description}
      descriptionAr={descriptionAr}
      icon={GraduationCap}
      to={to}
    />
  );
}
