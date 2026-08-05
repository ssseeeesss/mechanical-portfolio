import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export default function MobileMenu({ items, activeSection, onNavigate, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll('a[href], button:not([disabled])');
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="mobile-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        id="mobile-navigation"
        ref={panelRef}
        className="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="移动端导航"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mobile-menu-header">
          <span className="mobile-menu-label">页面导航</span>
          <button ref={closeRef} className="mobile-menu-close" onClick={onClose} aria-label="关闭菜单" type="button">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mobile-menu-items">
          {items.map((item, index) => (
            <motion.a
              key={item.id}
              className={`mm-item ${activeSection === item.id ? 'mm-item-active' : ''}`}
              href={`#${item.id}`}
              onClick={(event) => onNavigate(event, item.id)}
              aria-current={activeSection === item.id ? 'location' : undefined}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * index, duration: 0.25 }}
            >
              <span className="mm-num">{String(index + 1).padStart(2, '0')}</span>
              <span className="mm-text">
                <span className="mm-cn">{item.label}</span>
                <span className="mm-en">{item.en}</span>
              </span>
              {activeSection === item.id && <span className="mm-active-dot" aria-hidden="true" />}
            </motion.a>
          ))}
        </div>
      </motion.div>

      <style>{`
        .mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 101;
          background: rgba(3, 6, 10, 0.82);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: flex-end;
        }
        .mobile-menu-panel {
          width: min(320px, 86vw);
          height: 100%;
          background: #0b1119;
          border-left: 1px solid var(--border-accent);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .mobile-menu-label {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--steel);
        }
        .mobile-menu-close {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          cursor: pointer;
        }
        .mobile-menu-items { display: flex; flex-direction: column; gap: 0.5rem; }
        .mm-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-height: 58px;
          padding: 0.75rem 1rem;
          border: 1px solid transparent;
          color: var(--text-secondary);
          text-decoration: none;
          position: relative;
        }
        .mm-item:hover, .mm-item-active {
          border-color: var(--border);
          background: var(--bg-elevated);
          color: var(--text);
        }
        .mm-num {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-muted);
          min-width: 2rem;
        }
        .mm-item-active .mm-num { color: var(--cyan); }
        .mm-text { display: flex; flex-direction: column; }
        .mm-cn { font-family: var(--font-cn); font-size: 0.95rem; }
        .mm-en { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); }
        .mm-active-dot {
          position: absolute;
          right: 1rem;
          width: 6px;
          height: 6px;
          background: var(--cyan);
          rotate: 45deg;
        }
      `}</style>
    </motion.div>
  );
}
