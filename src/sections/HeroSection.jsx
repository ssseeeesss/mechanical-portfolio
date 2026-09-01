import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';
import './HeroSection.css';

const Beams = lazy(() => import('../components/Beams'));

const BASE = import.meta.env.BASE_URL;

export default function HeroSection() {
  const sectionRef = useRef(null);
  const isCompact = useMediaQuery('(max-width: 900px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [isInView, setIsInView] = useState(true);
  const [renderBeams, setRenderBeams] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '120px 0px' },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isCompact || prefersReducedMotion || !isInView) return undefined;
    const timer = window.setTimeout(() => setRenderBeams(true), 180);
    return () => window.clearTimeout(timer);
  }, [isCompact, prefersReducedMotion, isInView]);

  const showBeams = !isCompact && !prefersReducedMotion && isInView && renderBeams;

  return (
    <section id="hero" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        {showBeams ? (
          <Suspense fallback={<div className="hero-fallback" />}>
            <Beams
              beamWidth={2.8}
              beamHeight={18}
              beamNumber={7}
              lightColor="#2fc8f2"
              speed={0.7}
              noiseIntensity={0.75}
              scale={0.08}
            />
          </Suspense>
        ) : (
          <div className="hero-fallback" />
        )}
      </div>

      <div className="hero-grid-overlay" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-frame" aria-hidden="true">
        <span>SYLU / ME / 2027</span>
        <span>STRUCTURE · MOTION · PROTOTYPE</span>
      </div>

      <div className="hero-content">
        <figure className="hero-portrait">
          <img
            src={`${BASE}personal/刘雨林证件照.jpg`}
            alt="刘雨林个人头像"
            width="2102"
            height="3000"
            loading="eager"
            fetchPriority="high"
          />
        </figure>

        <div className="hero-identity">
          <p className="hero-eyebrow">EMBODIED INTELLIGENCE · MECHANICAL DESIGN</p>
          <h1 id="hero-title" className="hero-name">刘雨林</h1>
          <p className="hero-role">求职方向 · 机械工程师 / 机械结构工程师</p>
        </div>

        <div className="hero-details">
          <p className="hero-summary">
            沈阳理工大学材料成型及控制工程专业本科生，求职方向为机械工程师 / 机械结构工程师。具备从功能需求分析、机构与传动方案设计、三维建模和电机选型，到工程图与 BOM 输出、外协加工及样机装调的项目实践；实习期间参与机器人结构方案迭代、驱动系统选型和穿戴式设备工程化交付，并完成机器人 CAD 模型向 URDF、ROS 仿真环境的转换。
          </p>
          <p className="hero-summary">
            曾主导多功能杀鱼机整机与传动系统开发，独立完成 CoreXY 智能分类装置机械系统设计；实习期间参与灵巧手动作采集穿戴设备机械方案落地和机器人结构开发，关注人形机器人、灵巧手与穿戴式设备的机构设计、轻量化和工程落地。
          </p>

          <div className="hero-education" aria-label="教育信息">
            <span>沈阳理工大学</span>
            <span>材料成型及控制工程</span>
            <span>2027 届本科</span>
          </div>

          <div className="hero-public-info" aria-label="公开个人信息">
            <div>
              <span>所在地</span>
              <strong>绵阳</strong>
            </div>
            <div className="hero-public-info-wide">
              <span>邮箱</span>
              <a href="mailto:3064033560@qq.com">3064033560@qq.com</a>
            </div>
            <div>
              <span>GitHub</span>
              <a href="https://github.com/ssseeeesss/mechanical-portfolio" target="_blank" rel="noopener noreferrer">
                ssseeeesss
              </a>
            </div>
          </div>

          <div className="hero-actions">
            <a className="hero-action hero-action-primary" href="#experience">查看实习经历</a>
            <a className="hero-action" href="#projects">查看重点项目</a>
          </div>
        </div>
      </div>
    </section>
  );
}
