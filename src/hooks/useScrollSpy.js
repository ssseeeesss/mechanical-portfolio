import { useState, useEffect } from 'react';

const SECTION_IDS = ['hero', 'experience', 'projects', 'skills', 'profile', 'awards', 'contact'];

export default function useScrollSpy() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observers = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-20% 0px -70% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return activeSection;
}
