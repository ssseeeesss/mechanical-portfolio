import FadeContent from '../components/FadeContent';
import SectionHeader from '../components/SectionHeader';
import '../styles/shared.css';
import './ExperienceSection.css';

const internshipSections = [
  {
    title: '结构设计建模',
    content: '熟练使用 AutoCAD、UG、SolidWorks 完成结构设计，通过仿真分析与迭代优化确保系统具备良好的承载能力和稳定性；结合实际工况对多种设计方案进行评估，最终选定最优方案。',
  },
  {
    title: '驱动系统选型',
    content: '在结构设计基础上，参与电机计算与选型。根据总负载及转速要求，精准计算扭矩、功率等关键参数，并综合考虑装配空间约束，确定电机型号与尺寸。',
  },
  {
    title: '仿真环境的搭建',
    content: '将 SolidWorks 3D 模型转换为 URDF 格式，为 Y1 轮足机器人定义关节坐标系并导入惯性矩、质心等物理参数，成功将模型部署至 ROS 仿真环境，实现与软件团队的协同开发与算法验证。',
  },
  {
    title: '零部件的采购',
    content: '完成设计后负责零件工程图出图，与供应商对接技术规范，统筹钣金件、CNC 加工件及元器件的采购，在保证质量的前提下有效控制项目成本。',
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="experience section-base" aria-labelledby="experience-title">
      <div className="section-inner">
        <SectionHeader
          eyebrow="01 / INTERNSHIP EXPERIENCE"
          title="实习经历"
          titleId="experience-title"
        />

        <FadeContent threshold={0.08} duration={0.65}>
          <article className="experience-record">
            <header className="experience-position">
              <div>
                <p className="experience-company">四川省一千帧人工智能科技有限责任公司</p>
                <h3>机械结构工程师</h3>
              </div>
              <time>2026.01 — 2026.03</time>
            </header>

            <div className="experience-copy">
              {internshipSections.map((section) => (
                <section key={section.title} className="experience-entry">
                  <h4>{section.title}</h4>
                  <p>{section.content}</p>
                </section>
              ))}
            </div>
          </article>
        </FadeContent>
      </div>
    </section>
  );
}
