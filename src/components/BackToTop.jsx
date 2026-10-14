import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function BackToTop({ lenisRef }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTop = useCallback(() => {
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lenisRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="back-to-top"
          onClick={scrollTop}
          aria-label="返回顶部"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <style>{`
            .back-to-top {
              position: fixed;
              bottom: 2rem;
              right: 2rem;
              z-index: 99;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: var(--bg-elevated);
              border: 1px solid var(--border-accent);
              color: var(--cyan);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 20px rgba(0,0,0,0.5);
              transition: border-color 0.3s ease, color 0.3s ease;
            }
            .back-to-top:hover {
              border-color: var(--cyan);
              color: var(--text);
              background: var(--bg-surface);
            }
            @media (max-width: 768px) {
              .back-to-top {
                bottom: 1.5rem;
                right: 1.5rem;
                width: 38px;
                height: 38px;
              }
            }
          `}</style>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
