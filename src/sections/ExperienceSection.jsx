import FadeContent from '../components/FadeContent';
import SectionHeader from '../components/SectionHeader';
import '../styles/shared.css';
import './ExperienceSection.css';

const internshipRecords = [
  {
    company: '四川省一千帧人工智能科技有限责任公司（第二段）',
    title: '机械结构工程师 · H1 项目 Owner',
    date: '2026.08 — 至今',
    sections: [
      {
        title: '人形整机结构',
        content: '作为项目 Owner 从 0 到 1 主导 29 自由度双足人形机器人整机机械结构设计与项目统筹，参考智元灵犀 X1 开源方案完成架构选型；腰部与脚踝采用并联式连杆结构，完成躯干、四肢框架与模块化关节布局。',
      },
      {
        title: '力矩计算与选型',
        content: '针对腰部、脚踝并联连杆机构建立位置逆解、推导速度雅可比，基于虚功原理构建力雅可比矩阵（τ = JᵀF），将电机扭矩映射为 pitch / roll 轴扭矩，据此校核连杆强度并完成电机选型与限位设计。',
      },
      {
        title: '系统集成与成果',
        content: '协同电气、关节团队规划布线空间，设计线束固定结构与过线孔；完成 29 自由度整机结构方案定型，躯干 / 四肢 / 关节 100% 通过运动干涉检查，样机实现稳定双足行走。',
      },
    ],
  },
  {
    company: '飞捷科思智能科技（上海）有限公司',
    title: '机械结构工程师',
    date: '2026.06 — 2026.08',
    sections: [
      {
        title: '结构设计',
        content: '面向具身智能多模态数据采集需求，主导 6 自由度灵巧手外骨骼及 UMI 无本体采集设备整机结构设计，完成参数化建模 → 运动学仿真 → 3D 建模 → 2D 出图 → 加工跟进 → 装配调试全流程；设计四连杆与扭转弹簧复合随动机构，解决铝合金与 ABS 件装配干涉问题。',
      },
      {
        title: '仿真优化',
        content: '使用 UG 开展杆件静力学分析与拓扑优化，设定网格划分标准与边界载荷条件，通过变密度法迭代 3 版零件结构，实现关键承力件减重 15%、刚度提升 10%。',
      },
      {
        title: '数据采集与工程交付',
        content: '负责 Franka 机械臂及 UMI-H 设备的数据采集与调试（Ubuntu 环境）；输出 50+ 张工程图及装配图，编制覆盖 100+ 个零部件的 BOM，跟进 CNC 与 3D 打印制造，3 套工程样机均按期交付，产品在 WAIC 展出并累计交付十余套。',
      },
      {
        title: '专利',
        content: '独立撰写并提交发明专利 1 项、实用新型专利 1 项（实用新型已受理，本人第一发明人），对接专利代理机构完成技术交底与文件修改。',
      },
    ],
  },
  {
    company: '四川省一千帧人工智能科技有限责任公司',
    title: '机械结构工程师',
    date: '2026.01 — 2026.03',
    sections: [
      {
        title: '结构设计与选型',
        content: '参与 Y1 轮足机器人整机机械开发，结合实际工况建立动力学模型计算扭矩、功率及惯量匹配，在紧凑装配空间约束下完成电机型号及尺寸选型。',
      },
      {
        title: 'IP67 防水与轻量化',
        content: '主导整机 IP67 防水结构设计并完成 1 m / 30 min 浸水试验；使用 Fusion 360 生成式拓扑优化轮腿连接件，减重 12%、刚度提升 8%。',
      },
      {
        title: '仿真部署',
        content: '将 SolidWorks 模型转换为 URDF 格式，定义关节坐标系并录入质心、惯性矩等物理参数，完成 ROS 仿真环境搭建，协同软件团队完成 3 项算法验证。',
      },
      {
        title: '限位走线与采购',
        content: '负责关节机械限位与内部线束走线设计；输出 30+ 张零件工程图，负责钣金件、CNC 件采购与成本控制及金属 3D 打印全流程（选材、后处理及焊接支架设计制造），零件按期齐套。',
      },
    ],
  },
  {
    company: '成都泰金集机械有限公司',
    title: '机械助理工程师',
    date: '2025.06 — 2025.08',
    sections: [
      {
        title: '抄图与绘图',
        content: '根据工程师草图或样件，使用 AutoCAD、UG、SolidWorks 完成轴承座等支架及轴类零件的三维建模与二维工程图绘制，完成尺寸公差、形位公差及配合性质标注，图纸一次通过率 95%。',
      },
      {
        title: '零件质检',
        content: '使用游标卡尺、千分尺等量具进行关键尺寸检测，记录质检数据，协助分析尺寸偏差与装配干涉问题，配合完成工艺跟进与问题闭环。',
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
