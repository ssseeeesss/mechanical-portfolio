import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, var(--cyan), var(--steel))', transformOrigin: '0%', zIndex: 200 }}
    />
  );
}
