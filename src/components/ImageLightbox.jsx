import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageLightbox({ images, activeIndex, title, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const total = images.length;

  const prev = useCallback(() => {
    if (total <= 1) return;
    onClose((activeIndex - 1 + total) % total);
  }, [activeIndex, total, onClose]);

  const next = useCallback(() => {
    if (total <= 1) return;
    onClose((activeIndex + 1) % total);
  }, [activeIndex, total, onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose(null);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      } else if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button:not([disabled])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [next, onClose, prev]);

  return (
    <AnimatePresence>
      {activeIndex !== null && (
        <motion.div
          className="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => onClose(null)}
        >
          <motion.div
            ref={dialogRef}
            className="lightbox-content"
            role="dialog"
            aria-modal="true"
            aria-label={`${title}图片查看器`}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={images[activeIndex]}
              alt={`${title}项目图 ${activeIndex + 1}，共 ${total} 张`}
              className="lightbox-img"
            />

            {total > 1 && (
              <>
                <button className="lightbox-btn lightbox-prev" onClick={prev} aria-label="上一张" type="button">
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button className="lightbox-btn lightbox-next" onClick={next} aria-label="下一张" type="button">
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                <div className="lightbox-counter" aria-live="polite">{activeIndex + 1} / {total}</div>
              </>
            )}

            <button ref={closeRef} className="lightbox-close" onClick={() => onClose(null)} aria-label="关闭图片查看器" type="button">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>

          <style>{`
            .lightbox-backdrop {
              position: fixed;
              inset: 0;
              z-index: 999;
              background: rgba(0, 0, 0, 0.94);
              backdrop-filter: blur(6px);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4rem 5rem;
            }
            .lightbox-content {
              position: relative;
              width: min(1100px, 86vw);
              height: min(760px, 80vh);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .lightbox-img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              border: 1px solid var(--border-accent);
              box-shadow: 0 0 60px rgba(47, 200, 242, 0.12);
            }
            .lightbox-btn, .lightbox-close {
              display: grid;
              place-items: center;
              background: rgba(11, 17, 25, 0.92);
              border: 1px solid var(--border-accent);
              color: var(--text-secondary);
              cursor: pointer;
            }
            .lightbox-btn {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 48px;
              height: 48px;
            }
            .lightbox-prev { left: -4rem; }
            .lightbox-next { right: -4rem; }
            .lightbox-close { position: absolute; top: -3rem; right: 0; width: 40px; height: 40px; }
            .lightbox-counter {
              position: absolute;
              bottom: -2.5rem;
              left: 50%;
              transform: translateX(-50%);
              font-family: var(--font-mono);
              font-size: 0.75rem;
              color: var(--text-secondary);
            }
            @media (max-width: 768px) {
              .lightbox-backdrop { padding: 4rem 1rem 3rem; }
              .lightbox-content { width: 100%; height: 74vh; }
              .lightbox-prev { left: 0.5rem; }
              .lightbox-next { right: 0.5rem; }
              .lightbox-btn { width: 42px; height: 42px; background: rgba(11, 17, 25, 0.96); }
              .lightbox-close { top: -3rem; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
