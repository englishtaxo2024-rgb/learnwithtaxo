import { motion } from 'framer-motion';

export function PageTransition({ children }) {
  return (
    <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.main>
  );
}
