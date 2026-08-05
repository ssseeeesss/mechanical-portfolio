const BASE = import.meta.env.BASE_URL;

const awards = [
  {
    title: '全国大学生机械创新设计大赛',
    subtitle: '国家级三等奖 · National Mechanical Innovation Design Competition · 3rd Prize (National)',
    image: null,
    rank: 1,
  },
  {
    title: 'iCAN全国大学生创新创业大赛',
    subtitle: '国家级三等奖 · iCAN Innovation & Entrepreneurship Contest · 3rd Prize (National)',
    image: `${BASE}personal/ICAN国家级三等奖.jpg`,
    rank: 2,
  },
  {
    title: '全国大学生工程训练大赛',
    subtitle: '省级二等奖 · Engineering Training Competition · 2nd Prize (Provincial)',
    image: `${BASE}personal/工训大赛二等奖.jpg`,
    rank: 3,
  },
  {
    title: '全国3D数字化创新设计大赛',
    subtitle: '省级一等奖 · 3D Digital Innovation Design Competition · 1st Prize (Provincial)',
    image: `${BASE}personal/3D大赛一等奖.jpg`,
    rank: 4,
  },
];

export default awards;
