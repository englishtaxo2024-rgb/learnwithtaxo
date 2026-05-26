import { motion } from 'framer-motion';
import { ArrowRight, Banknote, BookOpen, CalendarDays, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { Button } from '../../components/ui/Button';
import { IconCard } from '../../components/ui/IconCard';
import { FlowStepper } from '../../components/dashboards/FlowStepper';

export function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 py-10 md:py-16">
        <div className="blob absolute left-4 top-10 h-52 w-52 rounded-full bg-taxo-bright/20 blur-3xl" />
        <div className="blob absolute right-10 top-20 h-64 w-64 rounded-full bg-taxo-gold/15 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.85fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <BrandLogo />
            <h1 className="mt-10 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">Premium English learning, guided from placement to certificate.</h1>
            <p className="mt-5 max-w-2xl text-lg text-taxo-light">A complete bilingual portal for placement, booking, manual payment confirmation, homework, feedback, reports, certificates, and protected teacher material.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link to="/placement-test"><Button>Start placement <ArrowRight className="ml-2 inline" size={18} /></Button></Link><Link to="/login"><Button variant="secondary">Login</Button></Link></div>
          </motion.div>
          <div className="glass rounded-lg p-6"><BrandLogo compact /><div className="mt-6 grid gap-3 sm:grid-cols-2"><IconCard icon={BookOpen} title="Placement first">No free live Zoom placement tests.</IconCard><IconCard icon={CalendarDays} title="Smart booking">Teacher, level, age, and capacity aware.</IconCard><IconCard icon={Banknote} title="Payment confirmation">Proof upload and admin approval.</IconCard><IconCard icon={GraduationCap} title="Progress portal">Reports, tests, and certificates.</IconCard></div></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-12"><FlowStepper steps={['Choose Arabic or English and read the guide', 'Enter parent email and placement code', 'Take placement and book a suitable slot', 'Upload payment proof, wait for admin approval, then join your group']} /></section>
    </div>
  );
}
