# Shaun Resume Platform

Shaun Resume 是一个在线简历制作平台，支持用户注册登录、结构化简历编辑、模板实时切换与预览、PDF/图片导出等功能。

## 项目概述

本平台旨在帮助用户快速创建专业的简历，提供多种模板选择，支持实时预览和导出功能。项目采用前后端分离架构，分多阶段迭代开发：

- **第一阶段**：静态页面与交互
- **第二阶段**：MVP 核心功能（用户系统 + 简历 CRUD + Schema 驱动模板引擎 + 导出）
- **第三阶段**：体验增强（HTML 模板上传 + 响应式）
- **第四阶段**：生态扩展（插件包系统 + AI 能力）

## 技术栈

### 前端
- React 19+
- TypeScript 5.x
- Ant Design 5.x
- Tailwind CSS 4
- Vite 8
- React Router v6

### 后端
- Express 4.x
- TypeScript 5.x
- PostgreSQL 16+
- Prisma ORM
- JWT 认证

### 导出功能
- html2canvas
- jsPDF

## 项目结构

```
Shaun-Resume-V3/
├── apps/                    # 应用（pnpm monorepo 工作区）
│   ├── frontend/            # 前端项目
│   │   ├── src/
│   │   │   ├── components/  # 通用组件
│   │   │   ├── pages/       # 页面组件
│   │   │   ├── services/    # API 服务
│   │   │   ├── templates/   # 模板引擎（分层混合架构）
│   │   │   │   └── engine/  # L1 Schema 驱动 / L2 插件包 / L3 HTML 模板
│   │   │   └── types/       # 类型定义
│   │   └── ...
│   └── backend/             # 后端项目
│       ├── src/
│       │   ├── middleware/  # 中间件
│       │   ├── types/       # 类型定义
│       │   └── utils/       # 工具函数
│       ├── prisma/          # 数据库模型与迁移
│       └── ...
├── packages/                # 共享包
│   └── shared/              # 前后端共享类型（简历内容 / AI）
├── pnpm-workspace.yaml      # pnpm 工作区配置
├── specs/                   # 功能规格与计划
│   └── 001-shaun-resume-platform/
│       ├── spec.md          # 功能规格说明
│       ├── plan.md          # 实施计划
│       ├── tasks.md         # 任务列表
│       └── contracts/       # API 接口契约
└── docs/                    # 项目文档
```

## 快速开始

### 环境要求
- Node.js >= 20
- PostgreSQL >= 16
- pnpm >= 10

### 安装与运行

```bash
# 仓库根目录一次性安装依赖
pnpm install

# 一键同时启动前后端
pnpm dev

# 初始化数据库（随后端）
cd apps/backend
cp .env.example .env      # 配置环境变量
npx prisma migrate dev    # 执行数据库迁移
npx prisma db seed        # 种子数据
```

单独启动某一端：

```bash
pnpm --filter @shaun-resume/frontend dev   # 前端（端口 5173）
pnpm --filter @shaun-resume/backend dev    # 后端（端口 3000）
```

## 开发进度

| 阶段 | 内容 | 状态 |
|------|------|------|
| 第一阶段 | 静态页面与交互 |  进行中 |
| 第二阶段 | MVP 核心功能（Schema 驱动模板引擎） | ⚪ 未开始 |
| 第三阶段 | HTML 模板上传与响应式 |  未开始 |
| 第四阶段 | 插件包系统与 AI 能力 | ⚪ 未开始 |

### 已完成页面（第一阶段）

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 平台介绍、功能亮点、CTA 入口 |
| 登录 | `/login` | 邮箱密码登录，全屏布局 |
| 注册 | `/register` | 邮箱密码注册，全屏布局 |
| 我的简历 | `/resumes` | 简历列表管理 |
| 模板列表 | `/templates` | 可用模板浏览 |
| 简历编辑器 | `/resumes/:id/edit` | 三栏编辑器（模块管理 + 实时预览 + 样式设置） |
| 个人设置 | `/settings` | 账户信息管理 |

## 文档

- [功能规格](specs/001-shaun-resume-platform/spec.md)
- [实施计划](specs/001-shaun-resume-platform/plan.md)
- [任务列表](specs/001-shaun-resume-platform/tasks.md)
- [项目宪法](.specify/memory/constitution.md)

## 许可证

[待定]
