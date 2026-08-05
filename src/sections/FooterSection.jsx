import FadeContent from '../components/FadeContent';
import './FooterSection.css';

export default function FooterSection() {
  return (
    <footer id="contact" className="footer" aria-labelledby="contact-title">
      <FadeContent threshold={0.08} duration={0.6}>
        <div className="footer-inner">
          <div className="footer-intro">
            <p className="footer-kicker">06 / CONTACT</p>
            <h2 id="contact-title">让结构设计真正服务于运动与交互</h2>
            <p>期待具身智能机械结构方向的项目交流、实习与校招机会。</p>
            <div className="footer-actions">
              <a className="footer-action footer-action-primary" href="mailto:3064033560@qq.com">发送邮件</a>
              <a
                className="footer-action"
                href="https://github.com/ssseeeesss/mechanical-portfolio"
                target="_blank"
                rel="noopener noreferrer"
              >
                查看 GitHub<span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="footer-rule" aria-hidden="true" />

          <div className="footer-body">
            <div className="footer-brand">
              <span className="f logo">LIU YULIN</span>
              <span className="f dot" aria-hidden="true" />
              <span className="f year">2027</span>
            </div>

            <div className="footer-info">
              <div className="finfo-row"><span className="finfo-key">UNIVERSITY</span><span className="finfo-val">沈阳理工大学</span></div>
              <div className="finfo-row"><span className="finfo-key">MAJOR</span><span className="finfo-val">材料成型及控制工程</span></div>
              <div className="finfo-row"><span className="finfo-key">FOCUS</span><span className="finfo-val">具身智能机械结构</span></div>
            </div>
          </div>

          <p className="footer-credit">React · Three.js · GSAP · Engineering Portfolio</p>
        </div>
      </FadeContent>
    </footer>
  );
}
