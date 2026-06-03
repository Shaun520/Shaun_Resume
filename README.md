# Shaun Resume Platform

Shaun Resume 是一个在线简历制作平台，支持用户注册登录、结构化简历编辑、模板实时切换与预览、PDF/图片导出等功能。

## 项目概述

本平台旨在帮助用户快速创建专业的简历，提供多种模板选择，支持实时预览和导出功能。项目采用前后端分离架构，分四阶段迭代开发：

- **第一阶段**：静态页面与交互
- **第二阶段**：MVP 核心功能（用户系统 + 简历 CRUD + 模板 + 导出）
- **第三阶段**：体验增强（模板市场 + 响应式）
- **第四阶段**：AI 能力引入

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
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/    # 通用组件
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API 服务
│   │   └── types/         # 类型定义
│   └── ...
├── backend/               # 后端项目
│   ├── src/
│   │   ├── middleware/    # 中间件
│   │   ├── types/         # 类型定义
│   │   └── utils/         # 工具函数
│   ├── prisma/            # 数据库模型与迁移
│   └── ...
├── specs/                 # 功能规格与计划
│   └── 001-shaun-resume-platform/
│       ├── spec.md        # 功能规格说明
│       ├── plan.md        # 实施计划
│       ├── tasks.md       # 任务列表
│       └── contracts/     # API 接口契约
└── docs/                  # 项目文档
```

## 快速开始

### 环境要求
- Node.js >= 18
- PostgreSQL >= 16
- npm 或 yarn

### 安装与运行

#### 前端
```bash
cd frontend
npm install
npm run dev
```

#### 后端
```bash
cd backend
npm install
# 配置环境变量
cp .env.example .env
# 执行数据库迁移
npx prisma migrate dev
# 启动服务
npm run dev
```

## 开发进度

| 阶段 | 内容 | 状态 |
|------|------|------|
| 第一阶段 | 静态页面与交互 | 🟡 进行中 |
| 第二阶段 | MVP 核心功能 | ⚪ 未开始 |
| 第三阶段 | 模板市场与响应式 | ⚪ 未开始 |
| 第四阶段 | AI 能力 | ⚪ 未开始 |

## 文档

- [功能规格](specs/001-shaun-resume-platform/spec.md)
- [实施计划](specs/001-shaun-resume-platform/plan.md)
- [任务列表](specs/001-shaun-resume-platform/tasks.md)
- [项目宪法](.specify/memory/constitution.md)

## 许可证

[待定]
