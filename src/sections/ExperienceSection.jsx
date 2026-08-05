import FadeContent from '../components/FadeContent';
import SectionHeader from '../components/SectionHeader';
import '../styles/shared.css';
import './ExperienceSection.css';

const internshipRecords = [
  {
    company: '飞捷科思智能科技（上海）有限公司',
    title: '机械结构工程师',
    date: '2026.06 — 至今',
    sections: [
      {
        title: '结构设计建模',
        content: '负责具身智能、灵巧手及人形机器人方向数据采集设备的机械结构设计、三维建模与装配调试；完成 UMI-H 外骨骼数据采集手套的结构建模、装配及轻量化设计，并参与灵巧手零部件结构优化，设计卡扣与减震结构完善数采设备。',
      },
      {
        title: '结构仿真优化',
        content: '使用 UG 仿真功能开展杆件静力学分析与拓扑优化，根据仿真结果迭代零件结构，在降低设备整体质量的同时兼顾结构刚度、可靠性与可制造性。',
      },
      {
        title: '数据采集与交付',
        content: '负责松林机械臂、Franka 机械臂及 UMI-H 无本体化数据采集设备的数据采集工作，熟练使用 Ubuntu 配合设备调试与操作验证；输出零件工程图、装配图及 BOM，跟进铝合金、ABS 等机加工件的制造、装配与质量验证。',
      },
      {
        title: '专利材料撰写',
        content: '独立撰写 UMI 无本体化数据采集设备发明专利及实用新型专利材料，对接专利代理机构完成技术交底、文件修改及申请流程跟进。',
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
    company: '四川省一千帧人工智能科技有限责任公司',
    title: '机械结构工程师',
    date: '2026.01 — 2026.03',
    sections: [
      {
        title: '结构设计建模',
        content: '熟练使用 AutoCAD、UG、SolidWorks 完成结构设计，通过仿真分析与迭代优化确保系统具备良好的承载能力和稳定性；结合实际工况对多种设计方案进行评估，最终选定最优方案。',
      },
      {
        title: '驱动系统选型',
        content: '在结构设计基础上参与电机计算与选型，根据总负载及转速要求计算扭矩、功率等关键参数，并综合考虑装配空间约束确定电机型号与尺寸。',
      },
      {
        title: '仿真环境搭建',
        content: '将 SolidWorks 3D 模型转换为 URDF 格式，为 Y1 轮足机器人定义关节坐标系并导入惯性矩、质心等物理参数，部署至 ROS 仿真环境，支持与软件团队协同开发和算法验证。',
      },
      {
        title: '零部件采购',
        content: '完成设计后负责零件工程图出图，与供应商对接技术规范，统筹钣金件、CNC 加工件及元器件采购，在保证质量的前提下控制项目成本。',
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
