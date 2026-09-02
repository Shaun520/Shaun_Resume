import type { ResumeContent } from '../../types/resume'

export const SAMPLE_RESUME_DATA: ResumeContent = {
  basicInfo: {
    name: '张小明',
    phone: '138-0000-0000',
    email: 'zhangxiaoming@example.com',
    address: '上海市浦东新区',
    avatarUrl: '',
    englishName: 'Shaun Zhang',
    objective: '高级前端工程师',
    summary:
      '5 年前端开发经验，熟练掌握 React、TypeScript、Node.js 等技术栈，主导过多个中后台系统的架构设计与团队建设，注重工程效能与产品体验的平衡。',
  },
  education: [
    {
      id: 'edu-1',
      school: '浙江大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2015-09',
      endDate: '2019-06',
    },
  ],
  workExperience: [
    {
      id: 'work-1',
      company: '某互联网科技公司',
      position: '高级前端工程师',
      startDate: '2022-03',
      endDate: '至今',
      description:
        '• 主导 B 端中后台框架从 0 到 1 搭建，沉淀 30+ 业务组件，团队开发效率提升约 40%。\n• 推进微前端架构落地（qiankun），支撑 5 条业务线独立交付与发布。\n• 推动团队工程化建设：CI/CD、ESLint 规范、E2E 自动化测试、错误监控系统。',
    },
    {
      id: 'work-2',
      company: '某电商公司',
      position: '前端工程师',
      startDate: '2019-07',
      endDate: '2022-02',
      description:
        '• 负责商家端与运营后台核心模块开发，独立交付 20+ 需求。\n• 深度参与营销活动 H5 项目，封装通用动效与模板，活动搭建效率提升 60%。\n• 多次获得季度优秀员工，主导前端 Code Review 与新人培养。',
    },
  ],
  projectExperience: [
    {
      id: 'proj-1',
      name: 'Shaun Resume 简历平台',
      role: '前端负责人',
      startDate: '2024-01',
      endDate: '至今',
      description:
        '面向求职者的在线简历编辑器，支持多模板实时切换、PDF/图片导出与多人协作。\n• 基于 React 19 + TypeScript + Vite 搭建，引入 Schema 驱动的模板引擎，模板接入成本降低 70%。\n• 通过懒加载 + 路由级分包，首屏加载时间从 3.2s 优化至 1.1s。',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'React / Next.js', proficiency: '精通' },
    { id: 'skill-2', name: 'TypeScript', proficiency: '精通' },
    { id: 'skill-3', name: 'Node.js / Express', proficiency: '熟练' },
    { id: 'skill-4', name: 'Webpack / Vite', proficiency: '熟练' },
    { id: 'skill-5', name: 'Tailwind / Ant Design', proficiency: '熟练' },
  ],
  orgExperience: [
    {
      id: 'org-1',
      org: '校学生技术协会',
      role: '副会长',
      startDate: '2016-09',
      endDate: '2018-06',
      description:
        '• 统筹协会 20+ 场技术分享活动，覆盖 500+ 人次。\n• 组建 Web 方向学习小组，制定课程计划并担任主讲。',
    },
  ],
  honors: [
    { id: 'honor-1', title: '国家奖学金', level: '国家级', date: '2018-10', description: '综合测评专业前 1%。' },
    { id: 'honor-2', title: '蓝桥杯程序设计大赛', level: '省级一等奖', date: '2017-05' },
  ],
}
