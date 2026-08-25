# 实施计划：Shaun Resume 在线简历制作平台

**分支**：`001-shaun-resume-platform` | **日期**：2026-06-01（OSS 计划 2026-06-08 追加） | **规格**：[spec.md](./spec.md)

**输入**：来自 `/specs/001-shaun-resume-platform/spec.md` 的功能规格说明

## 摘要

Shaun Resume 是一个在线简历制作平台，支持用户注册登录、结构化简历编辑、模板实时切换与预览、PDF/图片导出。采用分四阶段迭代开发：第一阶段搭建静态页面与交互，第二阶段实现 MVP 核心功能（用户系统+简历 CRUD+模板+导出），第三阶段增强体验（模板市场+响应式），第四阶段引入 AI 能力。技术方案基于 React + TypeScript + Ant Design + Tailwind CSS 4（前端）和 Express + TypeScript + PostgreSQL + Prisma + JWT（后端），导出采用 html2canvas + jsPDF，模板系统采用**分层混合架构**：Level 1 Schema 驱动（内置模板，配置对象 + 通用渲染引擎）、Level 2 插件包（用户 JS 包，iframe 沙箱执行）、Level 3 HTML 模板（用户 HTML+CSS+数据绑定）。MVP 阶段实现 Level 1，后续渐进扩展 L2/L3。

### 当前进度

第一阶段静态页面已完成：首页、登录页、注册页、我的简历页、模板列表页、简历编辑器（三栏布局）、个人设置页。所有页面已实现路由配置和全屏/主布局分离。

第二阶段 MVP 核心功能（用户系统 / 简历 CRUD / 模板 / 导出）已落地，本地磁盘文件存储（`./uploads/`）可用。

阶段二增强：OSS 文件存储方案已纳入计划（详见 [§OSS 文件存储计划](#oss-文件存储计划阶段二新增)），涉及个人中心头像上传与简历内头像上传两个核心场景。

## 技术上下文

**语言/版本**：TypeScript 5.x

**主要依赖**：
- 前端：React 19+、Ant Design 5.x、Tailwind CSS 4、Vite 8、React Router v6、html2canvas、jsPDF
- 后端：Express 4.x、Prisma、jsonwebtoken、bcryptjs、Multer、cors

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
apps/frontend/
├── public/
── src/
│   ├── components/          # 通用组件
│   │   ├── Layout/          # 布局组件（Header、Footer）
│   │   └── Common/          # 通用 UI 组件（Loading、ErrorBoundary、EmptyState）
│   ├── pages/               # 页面组件
│   │   ├── Home/            # 首页 ✅
│   │   ├── Login/           # 登录页 ✅
│   │   ├── Register/        # 注册页 ✅
│   │   ├── ResumeList/      # 我的简历 ✅
│   │   ├── ResumeEditor/    # 简历编辑器 ✅
│   │   ├── TemplateList/    # 模板列表 ✅
│   │   ├── TemplateMarket/  # 模板市场（第三阶段）
│   │   ├── TemplateSubmit/  # 模板提交（第三阶段）
│   │   ├── MySubmissions/   # 我的提交（第三阶段）
│   │   └── Settings/        # 个人设置 ✅
│   ├── templates/           # 模板引擎（混合架构）
│   │   ├── engine/
│   │   │   ├── TemplateRenderer.tsx  ← 统一渲染入口
│   │   │   ├── TemplateRegistry.ts    ← 模板注册中心
│   │   │   ├── interfaces.ts          ← ITemplate 类型定义
│   │   │   ├── level1/                 ← L1: Schema 驱动（MVP）
│   │   │   │   ├── SchemaRenderer.tsx
│   │   │   │   ├── blocks/              ← 可复用 Block 组件库
│   │   │   │   │   ├── HeaderBlock.tsx
│   │   │   │   │   ├── SummaryBlock.tsx
│   │   │   │   │   ├── ExperienceBlock.tsx
│   │   │   │   │   ├── EducationBlock.tsx
│   │   │   │   │   ├── SkillsBlock.tsx
│   │   │   │   │   └── ProjectsBlock.tsx
│   │   │   │   ├── layouts/
│   │   │   │   │   ├── SingleColumn.tsx
│   │   │   │   │   └── DoubleColumn.tsx
│   │   │   │   └── schemas/             ← 内置模板配置（纯数据）
│   │   │   │       ├── classic.ts
│   │   │   │       ├── modern.ts
│   │   │   │       └── minimal.ts
│   │   │   ├── level2/                 ← L2: 插件包（V2.0）
│   │   │   │   ├── PluginLoader.ts
│   │   │   │   ├── PluginSandbox.tsx     ← iframe 沙箱
│   │   │   │   └── PluginValidator.ts
│   │   │   └── level3/                 ← L3: HTML 模板（V1.5）
│   │   │       ├── HtmlRenderer.tsx
│   │   │       ├── BindingEngine.ts     ← Handlebars 封装
│   │   │       ├── HtmlSandbox.tsx      ← iframe 沙箱
│   │   │       └── HtmlValidator.ts
│   │   └── plugins/         # 用户上传的模板（运行时加载）
│   ├── hooks/               # 自定义 Hooks（第二阶段）
│   │   ├── useAuth.ts       # 认证状态管理
│   │   ├── useResume.ts     # 简历编辑状态（本地优先）
│   │   ├── useAutoSave.ts   # 自动保存逻辑
│   │   └── useExport.ts     # 导出逻辑
│   ├── services/            # API 调用层（第二阶段）
│   │   ├── apiClient.ts     # Axios 实例（含 Token 拦截器）
│   │   ├── authService.ts   # 认证 API
│   │   ├── resumeService.ts # 简历 API
│   │   └── templateService.ts # 模板 API
│   ├── contexts/            # React Context（第二阶段）
│   │   └── AuthContext.tsx  # 认证上下文
│   ├── types/               # TypeScript 类型定义（第二阶段）
│   │   ├── auth.ts
│   │   ├── resume.ts        # 领域类型来自 packages/shared 再导出
│   │   └── template.ts
│   ├── utils/               # 工具函数（第二阶段）
│   │   ├── exportPdf.ts     # PDF 导出
│   │   ├── exportImage.ts   # 图片导出
│   │   └── pagination.ts    # 分页线计算
│   ├── App.tsx              # 应用入口 ✅
│   ├── main.tsx             # 渲染入口 ✅
│   └── router.tsx           # 路由配置 ✅
├── index.html
── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json

apps/backend/
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
│   │   ├── templates.ts     # 模板路由
│   │   ├── ai.ts            # AI 优化路由
│   │   └── uploads.ts       # 文件上传路由
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

packages/shared/             # 前后端共享类型（pnpm 工作区）
├── src/
│   ├── resume.ts            # 简历内容领域类型
│   ├── ai.ts                # AI 优化类型
│   └── index.ts
├── tsconfig.json
└── package.json
```

> ✅ 表示第一阶段已完成（静态页面）

**结构决策**：
- 前后端分离，独立目录、独立构建
- 前端按功能模块组织（pages/components/hooks/services），单文件不超过 300 行
- 后端按分层架构组织（routes → services → prisma），职责清晰
- **模板系统采用分层混合架构**（详见下方「模板系统架构」），避免每模板一组件的扩展性瓶颈

## 模板系统架构

### 设计目标

| 目标 | 说明 |
|------|------|
| 扩展性 | 新增模板只需添加配置对象或上传文件，无需修改核心代码 |
| 用户上传 | 支持设计师（HTML）和开发者（JS 包）两种模板贡献方式 |
| 安全隔离 | 用户模板在沙箱中运行，无法访问主页面数据 |
| 渐进式实现 | MVP 仅需 Level 1，L2/L3 按需后续添加 |

### 三级分层体系

```
                    ┌─────────────────────────┐
                    │     TemplateRenderer      │
                    │     （统一渲染引擎）        │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
  │ Level 1: 内置  │    │ Level 2: 社区  │    │ Level 3: 自定义  │
  │ (Schema 驱动)  │    │ (插件包)       │    │ (HTML 模板)     │
  ├───────────────┤    ├───────────────┤    ├───────────────┤
  │ • 配置对象驱动  │    │ • 用户 JS 包   │    │ • HTML + CSS    │
  │ • 固定 Block 库│    │ • 完全自定义   │    │ • 数据绑定语法  │
  │ • 开箱即用     │    │ • iframe 沙箱  │    │ • iframe 沙箱   │
  │ • 性能最优     │    │ • 需代码审核   │    │ • 设计师友好    │
  └───────────────┘    └───────────────┘    └───────────────┘
  ★ MVP 实现           V2.0 引入            V1.5 引入
```

### 各级别详情

**Level 1 — Schema 驱动（MVP）**
- 模板 = 纯 JSON/TS 配置对象（`TemplateSchema`）
- 通用渲染引擎解释配置，调用 Block 组件组合渲染
- 新增内置模板：新增 ~50 行配置文件，零组件代码
- 无安全风险（配置由官方维护）

**Level 2 — 插件包（V2.0+）**
- 模板 = 自包含 JS 包，实现 `ITemplate` 接口
- 在 iframe sandbox 中执行，`sandbox="allow-scripts"`
- 支持：任意布局、自定义交互、完整样式控制
- 需要：代码审核 + 权限声明机制

**Level 3 — HTML 模板（V1.5+）**
- 模板 = HTML + CSS + Handlebars 数据绑定语法
- BindingEngine 将简历数据注入模板占位符
- 在 iframe sandbox 中渲染
- 上传门槛最低（会 HTML/CSS 即可）

### 核心类型定义

```typescript
// 所有级别共用的统一接口
interface ITemplate {
  readonly level: 1 | 2 | 3
  readonly meta: {
    id: string; name: string; author: string;
    category: string; tags: string[]; thumbnail: string
  }
  render(data: ResumeData, ctx: RenderContext): React.ReactElement
}

// Level 1 Schema 结构（简化版）
interface TemplateSchema {
  id: string; name: string; category: string
  layout: { mode: 'single' | 'double'; spacing: number; padding: Padding }
  theme: { primaryColor: string; fontFamily: string; fontSize: FontSizes; colors: ColorPalette }
  sections: Array<{ type: BlockType; column?: 'left' | 'right'; visible: boolean }>
}
```

### 迭代路线

| 版本 | 内容 | 对应任务 |
|------|------|----------|
| **MVP** | Level 1 Schema 引擎 + 3 个内置模板 | T045~T054 |
| **V1.5** | Level 3 HTML 模板 + 上传审核流 | T099~T104（Phase 13）|
| **V2.0** | Level 2 插件包 + 沙箱执行 | T105~T110（Phase 14）|

---

## OSS 文件存储计划（阶段二新增）

> 详细调研见 [research.md §5](./research.md#5-文件上传方案mvp--oss-迁移)，数据模型见 [data-model.md §文件存储](./data-model.md#文件存储oss-集成)，接口契约见 [uploads.md](./contracts/uploads.md)。

### 目标

将 MVP 阶段的本地磁盘文件存储（`./uploads/`）迁移到阿里云 OSS，所有用户上传的图片（个人头像、简历内头像、模板缩略图等）走「STS 临时凭证 + 浏览器直传」流程，后端不再中转文件流。

### 范围

| 场景 | 旧实现 | 新实现 |
|------|--------|--------|
| 个人中心头像 | `POST /api/users/me/avatar`（multipart）→ `/uploads/avatars/...` | STS 直传 → OSS `avatars/{userId}/` → `PATCH /api/users/me` |
| 简历内头像 | 前端生成 blob URL，未真正上传 | STS 直传 → OSS `resumes/{userId}/{resumeId}/avatar/` → `PUT /api/resumes/:id/content` |
| 模板缩略图 | `POST /api/templates/submit` 携带 multipart | STS 直传 → OSS `templates/thumbnails/` → `POST /api/templates/submit` (json) |
| 用户提交模板文件 | 同上 multipart | STS 直传 → OSS `submissions/{userId}/`（私有）→ json 提交 |

### 后端组件

| 路径 | 职责 | 备注 |
|------|------|------|
| `backend/src/services/ossProvider.ts` | OSS 客户端封装 + 适配器接口 | 默认实现 `aliyunOssProvider`，可替换为其他云 |
| `backend/src/services/stsService.ts` | 调用阿里云 STS 签发临时凭证 | 依赖 `@alicloud/sts-sdk` |
| `backend/src/routes/uploads.ts` | `POST /api/uploads/sts-token`、`POST /api/uploads/sign-read`、`POST /api/uploads/delete` | 新增 |
| `backend/src/middleware/upload.ts` | 保留 multer 中间件，`OSS_ENABLED=false` 时回退 | 兼容旧版 |
| `backend/src/config/oss.ts` | 读取环境变量，校验 OSS 配置完整性 | 启动期 fail-fast |

### 前端组件

| 路径 | 职责 |
|------|------|
| `frontend/src/services/ossService.ts` | 封装「申请 STS → 浏览器直传 → 回调业务接口」流程 |
| `frontend/src/hooks/useOssUpload.ts` | 通用上传 Hook：进度条、错误重试、失败回滚 |
| `frontend/src/pages/Settings/AvatarUpload.tsx` | 改造为调用 `useOssUpload({ scene: 'avatar' })` |
| `frontend/src/pages/ResumeEditor/BasicInfoForm.tsx` | 改造为 `useOssUpload({ scene: 'resume-image', resumeId })` |

### 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `OSS_ENABLED` | 是 | `true` 启用 OSS 流程，`false` 走本地落盘（开发友好） |
| `OSS_REGION` | 启用时必填 | 如 `oss-cn-hangzhou` |
| `OSS_BUCKET` | 启用时必填 | Bucket 名称 |
| `OSS_ACCESS_KEY_ID` | 启用时必填 | RAM 子账号 AK（仅 `AssumeRole` 权限） |
| `OSS_ACCESS_KEY_SECRET` | 启用时必填 | RAM 子账号 SK |
| `OSS_ROLE_ARN` | 启用时必填 | 角色 ARN：`acs:ram::{uid}:role/shaun-resume-upload` |
| `OSS_ROLE_SESSION_NAME` | 否 | 默认 `shaun-resume-session` |
| `OSS_CDN_HOST` | 否 | 自定义 CDN 域名（用于返回给前端的公开 URL） |
| `OSS_STS_DURATION_SECONDS` | 否 | 默认 3600，最大 3600 |
| `OSS_MAX_FILE_SIZE` | 否 | 默认 5MB（头像场景） |

### 兼容性策略

- DB 现有 `avatarUrl` / `thumbnailUrl` 字段继续返回本地路径，由 `app.use('/uploads', ...)` 静态服务支持读取
- 新上传的图片仅产生 OSS URL，不再落盘
- 旧版 `POST /api/users/me/avatar`（multipart）在 `OSS_ENABLED=true` 时返回 `410 Gone`，引导前端走新流程
- 客户端类型 `User.avatarUrl`、`ResumeContent.basicInfo.avatarUrl` 接受 `string`（兼容两类 URL）

### 安全要点

- 后端 **不持有** 长期 AccessKey 写 OSS 的权限；STS 临时凭证最小化（`oss:PutObject` + 指定 prefix）
- STS 凭证 1 小时过期；同一用户申请频率限制（1 分钟 10 次）
- 头像 URL 校验：仅接受 `https://{cdnHost}/...`、本站 `/uploads/avatars/...`，拒绝任意外部 URL（防 SSRF / 跨域追踪）
- OSS Bucket 设置 CORS 白名单（仅允许 `CORS_ORIGIN` 来源）

### 验证 / 测试

- 单元测试：`stsService`（mock 阿里云 SDK）、`ossProvider`（mock `ali-oss`）
- 集成测试：用阿里云 OSS 真实 bucket（或 `s3rver` / 本地 minio 容器）跑通直传
- 端到端测试：登录 → 进入设置 → 上传新头像 → 验证 DB 中 `avatarUrl` 为 OSS URL → 退出再登录头像仍展示
- 性能：5MB 图片直传 P95 < 3s（依赖客户端网络）

### 风险与缓解

| 风险 | 缓解 |
|------|------|
| 阿里云 STS 服务不可用 | 后端缓存 STS 凭证 30 秒；前端拿到后 1 小时内有效 |
| 直传中 OSS 成功但 DB 失败 | 触发式清理接口 + 7 天 lifecycle 兜底 |
| 历史 `/uploads/avatars/...` 数据迁移 | 不主动迁移；旧数据继续走静态服务；新数据走 OSS |
| CORS 跨域问题 | 后端启动时校验并打印 OSS CORS 配置；前端报错时给出明确提示 |

---

## 复杂度追踪

> 所有宪法门禁通过，无需记录违规项。

| 违规项 | 为何需要 | 更简单方案被拒绝的原因 |
|--------|----------|------------------------|
| 无 | — | — |
