import FadeContent from '../components/FadeContent';
import SectionHeader from '../components/SectionHeader';
import { skillGroups, extraStats } from '../data/skills';
import '../styles/shared.css';
import './SkillsSection.css';

export default function SkillsSection() {
  return (
    <section id="skills" className="skills section-base" aria-labelledby="skills-title">
      <div className="section-inner">
        <SectionHeader
          eyebrow="03 / ENGINEERING CAPABILITIES"
          title="能力矩阵"
          subtitle="不以主观百分比定义熟练度，而以工具、工程任务和已完成的项目链路呈现能力。"
          titleId="skills-title"
        />

        <div className="skills-list">
          {skillGroups.map((group, groupIndex) => (
            <FadeContent key={group.label} threshold={0.08} duration={0.55} delay={groupIndex * 0.07}>
              <article className="skill-group">
                <div className="skill-group-header">
                  <div className="skill-group-index" aria-hidden="true">
                    {String(groupIndex + 1).padStart(2, '0')}
                  </div>

                  <div className="skill-group-overview">
                    <div className="skill-group-title-row">
                      <h3 className="skill-group-label">{group.label}</h3>
                      <span className="skill-level">{group.level}</span>
                    </div>
                    <p className="skill-group-summary">{group.summary}</p>
                    <ul className="skill-tags" aria-label={`${group.label}核心技能`}>
                      {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                    </ul>
                  </div>
                </div>

                <details className="skill-details" open={groupIndex === 0}>
                  <summary>查看能力说明、可完成工作、实践依据与应用价值</summary>
                  <div className="skill-detail-grid">
                    <section className="skill-capability">
                      <h4>能力说明</h4>
                      <div className="skill-detail-copy">
                        {group.capability.map((item) => <p key={item}>{item}</p>)}
                      </div>
                    </section>

                    <section className="skill-tasks">
                      <h4>可完成工作</h4>
                      <ul>
                        {group.tasks.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </section>

                    <section className="skill-evidence">
                      <h4>实践依据</h4>
                      <ul>
                        {group.evidence.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </section>

                    <section className="skill-value">
                      <h4>应用价值</h4>
                      <div className="skill-detail-copy">
                        {group.value.map((item) => <p key={item}>{item}</p>)}
                      </div>
                    </section>
                  </div>
                </details>
              </article>
            </FadeContent>
          ))}
        </div>

        <div className="extra-grid" aria-label="个人概览">
          {extraStats.map((stat) => (
            <div key={stat.label} className="extra-item">
              <span className="extra-num">{stat.value}</span>
              <span className="extra-label">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
