import FadeContent from '../components/FadeContent';
import SectionHeader from '../components/SectionHeader';
import '../styles/shared.css';
import './ProfileSection.css';

export default function ProfileSection() {
  return (
    <section id="profile" className="profile section-base" aria-labelledby="profile-title">
      <div className="section-inner">
        <SectionHeader
          eyebrow="04 / EDUCATION & COLLABORATION"
          title="教育与协作背景"
          subtitle="教育背景、机械创新协会协作与具身智能设备工程实践。"
          titleId="profile-title"
        />

        <FadeContent threshold={0.1} duration={0.7}>
          <div className="profile-background-grid">
            <article className="info-block">
              <h3 className="info-heading"><span className="info-bullet" />教育背景</h3>
              <div className="info-card education-grid">
                <div><span className="info-key">院校</span><span className="info-val">沈阳理工大学</span></div>
                <div><span className="info-key">专业</span><span className="info-val">材料成型及控制工程</span></div>
                <div><span className="info-key">时间</span><span className="info-val">2023.09 — 2027.06</span></div>
                <div><span className="info-key">学历</span><span className="info-val">本科</span></div>
                <div className="education-courses">
                  <span className="info-key">主修课程</span>
                  <span className="info-val">机械设计、工程力学、工程制图、互换性与公差、电工与电子技术、金属热处理</span>
                </div>
              </div>
            </article>

            <article className="info-block">
              <h3 className="info-heading"><span className="info-bullet bullet-green" />组织与项目协作</h3>
              <div className="info-card collaboration-card">
                <div className="timeline-header">
                  <span className="timeline-title">沈阳理工大学 · 机械创新协会</span>
                  <time className="timeline-date">2023.09 — 至今</time>
                </div>
                <ul className="detail-list">
                  <li>参与机械结构设计、配套程序开发、零件采购、实物装配和作品路演</li>
                  <li>多次参与竞赛项目申报、答辩与结题，积累项目统筹和跨专业协作经验</li>
                  <li>在飞捷科思参与 UMI-H 外骨骼数据采集设备的结构设计、工程交付与样机验证</li>
                  <li>具备机械类专利技术交底书撰写与专利代理协作经验</li>
                </ul>
              </div>
            </article>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
