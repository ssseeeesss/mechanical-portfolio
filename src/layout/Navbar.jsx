import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import useScrollSpy from '../hooks/useScrollSpy';
import useMediaQuery from '../hooks/useMediaQuery';
import MobileMenu from './MobileMenu';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'hero', label: '首页', en: 'HOME' },
  { id: 'experience', label: '实习', en: 'INTERNSHIP' },
  { id: 'projects', label: '项目', en: 'PROJECTS' },
  { id: 'skills', label: '能力', en: 'CAPABILITIES' },
  { id: 'profile', label: '背景', en: 'BACKGROUND' },
  { id: 'awards', label: '荣誉', en: 'AWARDS' },
  { id: 'contact', label: '联系', en: 'CONTACT' },
];

export default function Navbar({ lenisRef }) {
  const activeSection = useScrollSpy();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    setMenuOpen(false);

    if (lenisRef?.current) {
      lenisRef.current.scrollTo(element, { offset: -56 });
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    window.history.replaceState(null, '', `#${id}`);
  };

  const handleNavigate = (event, id) => {
    event.preventDefault();
    scrollTo(id);
  };

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        aria-label="主导航"
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="navbar-inner">
          <a className="nav-logo" href="#hero" onClick={(event) => handleNavigate(event, 'hero')}>
            <span className="nav-logo-cn">刘雨林</span>
            <span className="nav-logo-en">MECHANICAL DESIGN</span>
          </a>

          {!isMobile && (
            <div className="nav-links">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  className={`nav-link ${activeSection === item.id ? 'nav-link-active' : ''}`}
                  href={`#${item.id}`}
                  onClick={(event) => handleNavigate(event, item.id)}
                  aria-current={activeSection === item.id ? 'location' : undefined}
                >
                  <span className="nav-link-cn">{item.label}</span>
                  <span className="nav-link-en">{item.en}</span>
                  {activeSection === item.id && (
                    <motion.span
                      className="nav-link-bar"
                      layoutId="nav-underline"
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                    />
                  )}
                </a>
              ))}
            </div>
          )}

          {isMobile && (
            <button
              className={`nav-toggle ${menuOpen ? 'nav-toggle-open' : ''}`}
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobile && menuOpen && (
          <MobileMenu
            items={NAV_ITEMS}
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
