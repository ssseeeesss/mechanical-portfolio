import { useCallback, useState } from 'react';
import FadeContent from '../components/FadeContent';
import SectionHeader from '../components/SectionHeader';
import ImageLightbox from '../components/ImageLightbox';
import awards, { certificates } from '../data/awards';
import '../styles/shared.css';
import './AwardsSection.css';

const rankColors = ['#f5c451', '#b8c4d6', '#cc8f61', '#7f91aa'];
const awardsWithImages = awards.filter((award) => award.image);
const certsWithImages = certificates.filter((cert) => cert.image);

export default function AwardsSection() {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [certIdx, setCertIdx] = useState(null);
  const closeLightbox = useCallback((newIndex) => setLightboxIdx(newIndex ?? null), []);
  const closeCert = useCallback((newIndex) => setCertIdx(newIndex ?? null), []);

  return (
    <section id="awards" className="awards section-base" aria-labelledby="awards-title">
      <div className="section-inner">
        <SectionHeader
          eyebrow="05 / HONORS & RECOGNITION"
          title="竞赛荣誉与证书"
          subtitle="以项目实践验证机械设计、工程实现与团队协作能力；附语言与计算机等级证书。"
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

                {award.image ? (
                  <button
                    className="award-cert"
                    onClick={() => setLightboxIdx(awardsWithImages.indexOf(award))}
                    aria-label={`查看${award.title}证书`}
                    type="button"
                  >
                    <img src={award.image} alt="" className="award-cert-img" loading="lazy" decoding="async" />
                    <span className="award-cert-overlay"><span className="cert-view">查看证书</span></span>
                  </button>
                ) : (
                  <div className="award-cert award-cert-placeholder" role="img" aria-label={`${award.title}证书图片待补充`}>
                    <span>证书图待补充</span>
                  </div>
                )}

                <div className="award-info">
                  <h3 className="award-title">{award.title}</h3>
                  <p className="award-subtitle">{award.subtitle}</p>
                </div>

                <div className="award-accent" style={{ background: rankColors[index] }} aria-hidden="true" />
              </article>
            </FadeContent>
          ))}
        </div>

        <h3 className="certs-heading">证书与资格 <span>CERTIFICATES</span></h3>
        <div className="certs-grid">
          {certificates.map((cert, index) => (
            <FadeContent key={cert.title} threshold={0.08} duration={0.55} delay={index * 0.07}>
              <article className="award-card cert-card">
                {cert.image ? (
                  <button
                    className="award-cert"
                    onClick={() => setCertIdx(certsWithImages.indexOf(cert))}
                    aria-label={`查看${cert.title}证书`}
                    type="button"
                  >
                    <img src={cert.image} alt="" className="award-cert-img" loading="lazy" decoding="async" />
                    <span className="award-cert-overlay"><span className="cert-view">查看证书</span></span>
                  </button>
                ) : (
                  <div className="award-cert award-cert-placeholder" role="img" aria-label={`${cert.title}（证件不公开）`}>
                    <span>证件不公开展示</span>
                  </div>
                )}

                <div className="award-info">
                  <h3 className="award-title">{cert.title}</h3>
                  <p className="award-subtitle">{cert.subtitle}</p>
                </div>

                <div className="award-accent cert-accent" aria-hidden="true" />
              </article>
            </FadeContent>
          ))}
        </div>
        <p className="certs-note">证书可凭校验码在中国教育考试网（www.neea.edu.cn）查询，公开图片已隐去身份证号。</p>
      </div>

      {certIdx !== null && certsWithImages[certIdx] && (
        <ImageLightbox
          images={certsWithImages.map((cert) => cert.image)}
          activeIndex={certIdx}
          title={certsWithImages[certIdx].title}
          onClose={closeCert}
        />
      )}

      {lightboxIdx !== null && awardsWithImages[lightboxIdx] && (
        <ImageLightbox
          images={awardsWithImages.map((award) => award.image)}
          activeIndex={lightboxIdx}
          title={awardsWithImages[lightboxIdx].title}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
}
