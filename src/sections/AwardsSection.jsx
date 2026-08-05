import { useCallback, useState } from 'react';
import FadeContent from '../components/FadeContent';
import SectionHeader from '../components/SectionHeader';
import ImageLightbox from '../components/ImageLightbox';
import awards from '../data/awards';
import '../styles/shared.css';
import './AwardsSection.css';

const rankColors = ['#f5c451', '#b8c4d6', '#cc8f61', '#7f91aa'];

export default function AwardsSection() {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const closeLightbox = useCallback((newIndex) => setLightboxIdx(newIndex ?? null), []);

  return (
    <section id="awards" className="awards section-base" aria-labelledby="awards-title">
      <div className="section-inner">
        <SectionHeader
          eyebrow="05 / HONORS & RECOGNITION"
          title="竞赛荣誉"
          subtitle="以项目实践验证机械设计、工程实现与团队协作能力。"
          titleId="awards-title"
        />

        <div className="awards-grid">
          {awards.map((award, index) => (
            <FadeContent key={award.title} threshold={0.08} duration={0.55} delay={index * 0.07}>
              <article className="award-card">
                <div className="award-rank" style={{ color: rankColors[index] }} aria-hidden="true">
                  <span className="rank-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="rank-label">AWARD</span>
                </div>

                <button
                  className="award-cert"
                  onClick={() => setLightboxIdx(index)}
                  aria-label={`查看${award.title}证书`}
                  type="button"
                >
                  <img src={award.image} alt="" className="award-cert-img" loading="lazy" decoding="async" />
                  <span className="award-cert-overlay"><span className="cert-view">查看证书</span></span>
                </button>

                <div className="award-info">
                  <h3 className="award-title">{award.title}</h3>
                  <p className="award-subtitle">{award.subtitle}</p>
                </div>

                <div className="award-accent" style={{ background: rankColors[index] }} aria-hidden="true" />
              </article>
            </FadeContent>
          ))}
        </div>
      </div>

      {lightboxIdx !== null && (
        <ImageLightbox
          images={awards.map((award) => award.image)}
          activeIndex={lightboxIdx}
          title={awards[lightboxIdx].title}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
}
