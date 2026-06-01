# 实施计划：Shaun Resume 在线简历制作平台

**分支**：`001-shaun-resume-platform` | **日期**：2026-06-01 | **规格**：[spec.md](./spec.md)

**输入**：来自 `/specs/001-shaun-resume-platform/spec.md` 的功能规格说明

## 摘要

Shaun Resume 是一个在线简历制作平台，支持用户注册登录、结构化简历编辑、模板实时切换与预览、PDF/图片导出。采用分四阶段迭代开发：第一阶段搭建静态页面与交互，第二阶段实现 MVP 核心功能（用户系统+简历 CRUD+模板+导出），第三阶段增强体验（模板市场+响应式），第四阶段引入 AI 能力。技术方案基于 React + TypeScript + Ant Design + Tailwind CSS 4（前端）和 Express + TypeScript + PostgreSQL + Prisma + JWT（后端），导出采用 html2canvas + jsPDF，模板系统采用 React 组件 + Props 驱动渲染。

## 技术上下文

**语言/版本**：TypeScript 5.x

**主要依赖**：
- 前端：React 19+、Ant Design 5.x、Tailwind CSS 4、Vite 8、React Router v6、html2canvas、jsPDF
- 后端：Express 4.x、Prisma、jsonwebtoken、bcrypt、Multer、cors

**存储**：PostgreSQL 16+

**测试**：Vitest + React Testing Library（前端）、Vitest + Supertest（后端）

**目标平台**：Web 浏览器（PC 端优先，第三阶段扩展移动端）

**项目类型**：web-service（前后端分离）

**性能目标**：UI 交互反馈 ≤ 100ms；模板切换预览 ≤ 2s；自动保存间隔 30s

**约束**：遵守 `.specify/memory/constitution.md` 全部门禁；中文文档；禁止蓝紫渐变；禁止字体图标；禁止 `any`；单文件 ≤ 300 行

**规模/范围**：MVP 面向个人用户，预计 1000 用户级别；2-3 个基础模板；7 个主要页面

## 宪法检查

*门禁：Phase 0 调研前必须通过。Phase 1 设计后须重新检查。*

参考：`.specify/memory/constitution.md`

| 门禁 | 要求 | 状态 |
|------|------|------|
| Skill 优先 | 实施前已查阅相关 skills | ☑ |
| 设计 | 无蓝紫渐变；无字体图标；风格一致 | ☑ |
| 技术栈 | 仅使用已批准栈（前端 React/TS/Ant Design/Tailwind 4/Vite 8；后端 Express/PostgreSQL/Prisma/JWT/TS） | ☑ |
| 样式 | 仅 Tailwind CSS（除非批准，否则禁止 CSS-in-JS 或 CSS Modules） | ☑ |
| 状态 | 优先 URL 参数；优先 React 内置能力而非第三方状态库 | ☑ |
| 极简 | 最简单方案；无不必要依赖 | ☑ |
| 类型安全 | 禁止 `any`；单文件 ≤ 300 行 | ☑ |
| 内容 | 禁止 Lorem Ipsum；实现真实 Loading/Error/Empty 状态 | ☑ |
| 安全 | 前端禁止硬编码 API Key | ☑ |
| 无障碍 | 交互元素含 ARIA 标签并支持键盘导航 | ☑ |
| 交互 | UI 反馈 ≤ 100ms；破坏性操作须用户确认 | ☑ |
| 文档 | 所有项目文档（spec、plan、tasks、README 等）使用中文 | ☑ |

所有门禁通过，无需复杂度追踪。

## 项目结构

### 文档（本功能）

```text
specs/001-shaun-resume-platform/
├── plan.md              # 本文件（/speckit-plan 命令输出）
├── spec.md              # 功能规格说明
├── research.md          # Phase 0 输出（技术调研）
├── data-model.md        # Phase 1 输出（数据模型）
├── quickstart.md        # Phase 1 输出（快速入门）
├── contracts/           # Phase 1 输出（API 接口契约）
│   ├── auth.md          # 认证相关接口
│   ├── users.md         # 用户管理接口
│   ├── resumes.md       # 简历管理接口
│   └── templates.md     # 模板管理接口
├── checklists/
│   └── requirements.md  # 规格质量检查清单
└── tasks.md             # Phase 2 输出（/speckit-tasks 命令）
```

### 源代码（仓库根目录）

```text
frontend/
├── public/
├── src/
│   ├── components/          # 通用组件
│   │   ├── Layout/          # 布局组件（Header、Footer、Sidebar）
│   │   └── Common/          # 通用 UI 组件（Loading、ErrorBoundary、EmptyState）
│   ├── pages/               # 页面组件
│   │   ├── Home/            # 首页
│   │   ├── Login/           # 登录页
│   │   ├── Register/        # 注册页
│   │   ├── ResumeList/      # 我的简历
│   │   ├── ResumeEditor/    # 简历编辑器
│   │   ├── TemplateList/    # 模板列表
│   │   ├── TemplateMarket/  # 模板市场（第三阶段）
│   │   ├── TemplateSubmit/  # 模板提交（第三阶段）
│   │   ├── MySubmissions/   # 我的提交（第三阶段）
│   │   └── Settings/        # 个人设置
│   ├── templates/           # 简历模板组件
│   │   ├── Classic/         # 经典模板
│   │   ├── Modern/          # 现代模板
│   │   └── Minimal/         # 极简模板
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useAuth.ts       # 认证状态管理
│   │   ├── useResume.ts     # 简历编辑状态（本地优先）
│   │   ├── useAutoSave.ts   # 自动保存逻辑
│   │   └── useExport.ts     # 导出逻辑
│   ├── services/            # API 调用层
│   │   ├── apiClient.ts     # Axios 实例（含 Token 拦截器）
│   │   ├── authService.ts   # 认证 API
│   │   ├── resumeService.ts # 简历 API
│   │   └── templateService.ts # 模板 API
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx   # 认证上下文
│   ├── types/               # TypeScript 类型定义
│   │   ├── auth.ts
│   │   ├── resume.ts
│   │   └── template.ts
│   ├── utils/               # 工具函数
│   │   ├── exportPdf.ts     # PDF 导出
│   │   ├── exportImage.ts   # 图片导出
│   │   └── pagination.ts    # 分页线计算
│   ├── App.tsx              # 应用入口
│   ├── main.tsx             # 渲染入口
│   └── router.tsx           # 路由配置
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json

backend/
├── prisma/
│   ├── schema.prisma        # 数据库 Schema
│   └── seed.ts              # 种子数据
├── src/
│   ├── middleware/           # 中间件
│   │   ├── auth.ts          # JWT 验证中间件
│   │   ├── errorHandler.ts  # 全局错误处理
│   │   └── upload.ts        # 文件上传配置
│   ├── routes/              # 路由
│   │   ├── auth.ts          # 认证路由
│   │   ├── users.ts         # 用户路由
│   │   ├── resumes.ts       # 简历路由
│   │   └── templates.ts     # 模板路由
│   ├── services/            # 业务逻辑
│   │   ├── authService.ts   # 认证逻辑
│   │   ├── userService.ts   # 用户逻辑
│   │   ├── resumeService.ts # 简历逻辑
│   │   └── templateService.ts # 模板逻辑
│   ├── utils/               # 工具函数
│   │   ├── jwt.ts           # JWT 签发/验证
│   │   └── validation.ts    # 请求参数校验
│   ├── types/               # TypeScript 类型定义
│   │   └── express.d.ts     # Express 类型扩展
│   └── app.ts               # Express 应用入口
├── tsconfig.json
└── package.json
```

**结构决策**：
- 前后端分离，独立目录、独立构建
- 前端按功能模块组织（pages/components/hooks/services），单文件不超过 300 行
- 后端按分层架构组织（routes → services → prisma），职责清晰
- 模板组件独立目录 `templates/`，每个模板一个子目录，便于扩展

## 复杂度追踪

> 所有宪法门禁通过，无需记录违规项。

| 违规项 | 为何需要 | 更简单方案被拒绝的原因 |
|--------|----------|------------------------|
| 无 | — | — |
