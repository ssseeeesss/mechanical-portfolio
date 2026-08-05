import { useState, useCallback, useEffect, useRef } from 'react';
import './ImageGallery.css';

const PLACEHOLDER_SVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" fill="%230c1018"><rect width="800" height="500"/><text x="400" y="260" text-anchor="middle" fill="%234a5568" font-size="14" font-family="monospace">IMAGE NOT AVAILABLE</text></svg>';

function useSwipeThreshold(ref, threshold = 50) {
  const touchStart = useRef(0);

  const onTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((callback) => (e) => {
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (dx > threshold) callback('prev');
    else if (dx < -threshold) callback('next');
  }, [threshold]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    return () => el.removeEventListener('touchstart', onTouchStart);
  }, [ref, onTouchStart]);

  return onTouchEnd;
}

export default function ImageGallery({ images, projectTitle, accent = '#00c6ff', onOpenLightbox }) {
  const [active, setActive] = useState(0);
  const [imgErrors, setImgErrors] = useState(() => new Set());
  const containerRef = useRef(null);
  const total = images.length;

  const prev = useCallback((e) => {
    if (e) e.stopPropagation();
    setActive(i => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback((e) => {
    if (e) e.stopPropagation();
    setActive(i => (i + 1) % total);
  }, [total]);

  const handleImgError = useCallback((idx) => {
    setImgErrors(prev => new Set([...prev, idx]));
  }, []);

  const onTouchEnd = useSwipeThreshold(containerRef, 50);
  const handleTouchEnd = onTouchEnd((dir) => {
    if (dir === 'prev') prev();
    else if (dir === 'next') next();
  });

  const handleMainClick = useCallback(() => {
    if (onOpenLightbox) {
      onOpenLightbox(active);
    } else {
      next();
    }
  }, [onOpenLightbox, active, next]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  }, [prev, next]);

  return (
    <div
      className="pgallery"
      ref={containerRef}
      style={{ '--accent': accent }}
      onTouchEnd={handleTouchEnd}
    >
      <button
        className="pgallery-main"
        onClick={handleMainClick}
        onKeyDown={handleKeyDown}
        aria-label={`放大查看${projectTitle}图片 ${active + 1}，共 ${total} 张`}
        type="button"
      >
        <img
          src={imgErrors.has(active) ? PLACEHOLDER_SVG : images[active]}
          alt={`${projectTitle}项目图 ${active + 1}`}
          className="pgallery-img"
          loading="lazy"
          decoding="async"
          onError={() => handleImgError(active)}
        />
        <div className="pgallery-overlay">
          <span className="pgallery-hint">
            {onOpenLightbox ? 'CLICK — 放大查看' : 'CLICK — 下一张'}
          </span>
        </div>
      </button>

      <div className="pgallery-strip">
        {total > 1 && images.map((img, i) => (
          <button
            key={i}
            className={`pgallery-thumb ${i === active ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setActive(i); }}
            aria-label={`切换到图片 ${i + 1}`}
            aria-current={i === active ? 'true' : undefined}
            type="button"
          >
            <img
              src={imgErrors.has(i) ? PLACEHOLDER_SVG : img}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => handleImgError(i)}
            />
            {i === active && <span className="thumb-indicator" />}
          </button>
        ))}
      </div>

      {total > 1 && (
        <div className="pgallery-controls">
          <button className="gctrl-btn" onClick={prev} aria-label={`${projectTitle}上一张图片`} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="gctrl-count" aria-live="polite">
            <span className="gctrl-current">{String(active + 1).padStart(2, '0')}</span>
            <span className="gctrl-sep">/</span>
            <span className="gctrl-total">{String(total).padStart(2, '0')}</span>
          </span>
          <button className="gctrl-btn" onClick={next} aria-label={`${projectTitle}下一张图片`} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      <div className="pcard-specs">
        <span className="pspec">
          <span className="pspec-label">IMAGES</span>
          <span className="pspec-val">{total}</span>
        </span>
      </div>
    </div>
  );
}
