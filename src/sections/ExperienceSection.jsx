import FadeContent from '../components/FadeContent';
import SectionHeader from '../components/SectionHeader';
import '../styles/shared.css';
import './ExperienceSection.css';

const internshipRecords = [
  {
    company: '具身智能设备企业（实习）',
    title: '机械结构工程师',
    date: '2026.06 — 至今',
    sections: [
      {
        title: '结构设计建模',
        content: '参与灵巧手动作采集与遥操作穿戴设备的机械结构开发，完成需求拆解、随动传动方案、模块化架构和参数化尺寸版本设计，并推进结构建模、装配与轻量化迭代。',
      },
      {
        title: '结构仿真优化',
        content: '使用 UG 仿真功能开展杆件静力学分析与拓扑优化，根据仿真结果迭代零件结构，在降低设备整体质量的同时兼顾结构刚度、可靠性与可制造性。',
      },
      {
        title: '数据采集与交付',
        content: '完成穿戴式设备 3D 打印验证、整机与零件工程图、物料清单、公差和粗糙度标注、材料选型及加工资料输出，推进零件制造、装配、电控接口确认和操作验证。',
      },
      {
        title: '专利材料撰写',
        content: '独立撰写机械结构相关发明专利及实用新型专利材料，对接专利代理机构完成技术交底、文件修改及申请流程跟进。',
      },
    ],
  },
  {
    company: '成都泰金集机械有限公司',
    title: '机械助理工程师',
    date: '2025.06 — 2025.08',
    sections: [
      {
        title: '零件建模与出图',
        content: '使用 AutoCAD、UG、SolidWorks 协助完成机械零部件、轴与轴承等结构的三维建模和二维工程图出图，核对尺寸、公差、材料及装配要求。',
      },
      {
        title: '工艺评审与生产跟进',
        content: '参与零部件加工工艺评审，结合材料特性、加工精度及生产条件梳理工艺要求；跟进 CNC 加工、钣金及模具制造进度，协助处理图纸疑问和现场加工异常。',
      },
      {
        title: '质量闭环与采购',
        content: '配合完成零部件首件及过程检验，使用量具记录关键尺寸数据，协助分析尺寸偏差、装配干涉等问题并推动资料迭代；对接供应商技术规范，统筹钣金件、CNC 加工件及元器件采购。',
      },
    ],
  },
  {
    company: '机器人企业（实习）',
    title: '机械结构工程师',
    date: '2026.01 — 2026.03',
    sections: [
      {
        title: '轮腿结构优化',
        content: '参与轮足机器人整机机械开发，负责机身与轮腿相关结构设计；使用 Fusion 360 对连接部位开展生成式拓扑优化，在满足结构强度的前提下减重并改善构件综合力学性能。',
      },
      {
        title: '驱动系统选型',
        content: '在结构设计基础上参与电机计算与选型，根据总负载及转速要求计算扭矩、功率等关键参数，并综合考虑装配空间约束确定电机型号与尺寸。',
      },
      {
        title: '仿真环境搭建',
        content: '将 SolidWorks 三维模型转换为 URDF 格式，为轮足机器人定义关节坐标系并录入质心、惯性矩等物理属性参数，完成 ROS 仿真环境部署，配合算法团队开展样机仿真验证。',
      },
      {
        title: '密封设计与项目落地',
        content: '完成整机防水结构及静密封、动密封方案设计，协助优化过线孔、安装孔位置以满足密封和装配工艺要求；完成工程图输出、供应商技术对接及钣金件、CNC 加工件和元器件采购。',
      },
    ],
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

        <div className="experience-list">
          {internshipRecords.map((record, index) => (
            <FadeContent key={record.company} threshold={0.08} duration={0.65} delay={index * 0.06}>
              <article className="experience-record">
                <header className="experience-position">
                  <div>
                    <p className="experience-company">{record.company}</p>
                    <h3>{record.title}</h3>
                  </div>
                  <time>{record.date}</time>
                </header>

                <div className="experience-copy">
                  {record.sections.map((section) => (
                    <section key={section.title} className="experience-entry">
                      <h4>{section.title}</h4>
                      <p>{section.content}</p>
                    </section>
                  ))}
                </div>
              </article>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
