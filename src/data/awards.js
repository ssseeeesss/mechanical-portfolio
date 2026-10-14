const BASE = import.meta.env.BASE_URL;

const awards = [
  {
    title: '第十二届全国大学生机械创新设计大赛',
    subtitle: '全国决赛三等奖 · 2026.07 · National Mechanical Innovation Design Competition · 3rd Prize (National)',
    image: `${BASE}personal/mechanical-innovation-national-third-prize.jpg`,
    rank: 1,
  },
  {
    title: '第十九届 iCAN 大学生创新创业大赛',
    subtitle: '全国总决赛三等奖 · 2025.11 · iCAN Innovation Contest Finals (China) · 3rd Prize',
    image: `${BASE}personal/ICAN国家级三等奖.jpg`,
    rank: 2,
  },
  {
    title: '辽宁省大学生工程实践与创新能力大赛（国赛选拔赛）',
    subtitle: '省级二等奖 · 2024.11 · Liaoning Engineering Practice & Innovation Competition · 2nd Prize',
    image: `${BASE}personal/工训大赛二等奖.jpg`,
    rank: 3,
  },
  {
    title: '第 18 届全国三维数字化创新设计大赛',
    subtitle: '辽宁赛区一等奖（龙鼎奖） · 2025.10 · 3D Digital Innovation Design Competition · 1st Prize (Liaoning)',
    image: `${BASE}personal/3D大赛一等奖.jpg`,
    rank: 4,
  },
];

// 证书图片已对身份证号打码后再放入 public/
export const certificates = [
  {
    title: '大学英语四级 CET-4',
    subtitle: '481 分 · 2026.06 · 听力 186 / 阅读 162 / 写作与翻译 133',
    image: `${BASE}personal/cert-cet4.jpg`,
  },
  {
    title: '全国计算机等级考试二级',
    subtitle: '合格 · 2026.03 · WPS Office 高级应用与设计',
    image: `${BASE}personal/cert-ncre-level2.jpg`,
  },
  {
    title: '机动车驾驶证',
    subtitle: 'C1 准驾车型',
  },
];

export default awards;
