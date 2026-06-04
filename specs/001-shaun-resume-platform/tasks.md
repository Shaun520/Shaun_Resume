# 任务：Shaun Resume 在线简历制作平台

**输入**：来自 `/specs/001-shaun-resume-platform/` 的设计文档

**前置条件**：plan.md（必填）、spec.md（用户故事必填）、research.md、data-model.md、contracts/

**组织方式**：任务按用户故事分组，以便各故事可独立实施与测试。

**宪法**：所有实施必须符合 `.specify/memory/constitution.md`。

## 格式：`[ID] [P?] [Story] 描述`

- **[P]**：可并行执行（不同文件、无依赖）
- **[Story]**：所属用户故事（例如 US1、US2、US3）
- 描述中须包含具体文件路径

## 路径约定

- 前端：`frontend/src/`
- 后端：`backend/src/`
- 模板：`frontend/src/templates/`

---

## Phase 1：搭建（共享基础设施）

**目的**：项目初始化与基础结构

- [x] T001 按实施计划创建项目目录结构（frontend/、backend/、frontend/src/components/、frontend/src/pages/ 等）
- [x] T002 初始化前端项目：React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Ant Design 5，配置 frontend/vite.config.ts、frontend/tailwind.config.ts、frontend/tsconfig.json
- [x] T003 [P] 初始化后端项目：Express + TypeScript + Prisma + PostgreSQL，配置 backend/tsconfig.json、backend/package.json
- [x] T004 [P] 配置前端 ESLint + Prettier，在 frontend/.eslintrc.cjs 和 frontend/.prettierrc 中设置规则（禁止 any、单文件 300 行限制）
- [x] T005 [P] 配置后端 ESLint + Prettier，在 backend/.eslintrc.cjs 和 backend/.prettierrc 中设置规则
- [x] T006 创建环境配置文件：backend/.env（DATABASE_URL、JWT_SECRET、PORT、CORS_ORIGIN）、frontend/.env（VITE_API_BASE_URL）

---

## Phase 2：基础（阻塞性前置）

**目的**：在任何用户故事开始前必须完成的核心基础设施

**⚠️ 关键**：本阶段完成前不得开始任何用户故事工作

- [x] T007 编写 Prisma schema：定义 User、Resume、ResumeContent、Template、TemplateSubmission 五个模型，在 backend/prisma/schema.prisma 中实现
- [x] T008 执行 Prisma 迁移并生成客户端：运行 npx prisma migrate dev --name init 和 npx prisma generate
- [x] T009 [P] 创建种子数据脚本：插入 3 个基础模板（经典、现代、极简），在 backend/prisma/seed.ts 中实现
- [x] T010 [P] 实现后端全局错误处理中间件，在 backend/src/middleware/errorHandler.ts 中实现
- [x] T011 [P] 实现文件上传中间件（Multer），配置头像和模板文件上传，在 backend/src/middleware/upload.ts 中实现
- [x] T012 实现 JWT 工具函数：签发 Access Token + Refresh Token、验证 Token、刷新 Token，在 backend/src/utils/jwt.ts 中实现
- [x] T013 实现 JWT 认证中间件：验证 Authorization Header、解析用户信息、附加到请求对象，在 backend/src/middleware/auth.ts 中实现
- [x] T014 [P] 实现请求参数校验工具，在 backend/src/utils/validation.ts 中实现（邮箱格式、密码强度、昵称长度等校验规则）
- [x] T015 [P] 创建后端 Express 应用入口：注册中间件、路由、错误处理，在 backend/src/app.ts 中实现
- [x] T016 [P] 创建后端 TypeScript 类型扩展：Express Request 类型增加 user 字段，在 backend/src/types/express.d.ts 中实现
- [x] T017 创建前端 Axios 实例：配置 baseURL、请求拦截器（附加 Token）、响应拦截器（401 自动刷新），在 frontend/src/services/apiClient.ts 中实现
- [x] T018 [P] 创建前端 TypeScript 类型定义：auth.ts、resume.ts、template.ts，在 frontend/src/types/ 目录中实现
- [x] T019 [P] 创建前端通用组件：Loading（加载中）、ErrorBoundary（错误边界）、EmptyState（空状态），在 frontend/src/components/Common/ 目录中实现
- [x] T020 [P] 创建前端布局组件：Header（顶部导航栏）、Footer，在 frontend/src/components/Layout/ 目录中实现
- [x] T021 创建前端路由配置：React Router v6 路由定义、路由守卫（鉴权），在 frontend/src/router.tsx 中实现
- [x] T022 [P] 创建前端应用入口：App.tsx 集成路由、Context Provider，在 frontend/src/App.tsx 中实现

**检查点**：基础就绪——可并行开始用户故事实施

---

## Phase 3：用户故事 1 - 新用户注册与首次创建简历（优先级：P1）🎯 MVP

**目标**：用户可注册登录、创建简历、填写结构化字段、切换模板预览、导出 PDF

**独立测试**：注册新账户 → 创建简历 → 填写各结构化字段 → 选择模板预览 → 导出 PDF，交付一份可用的简历文件

### 认证服务

- [x] T023 [US1] 实现认证服务：注册（邮箱验证+密码强度+签发Token）、登录（验证+签发Token）、刷新Token、登出，在 backend/src/services/authService.ts 中实现
- [x] T024 [US1] 实现认证路由：POST /register、POST /login、POST /refresh、POST /logout，在 backend/src/routes/auth.ts 中实现

### 用户服务

- [x] T025 [P] [US1] 实现用户服务：获取用户信息、更新用户信息、修改密码、上传头像，在 backend/src/services/userService.ts 中实现
- [x] T026 [P] [US1] 实现用户路由：GET /me、PATCH /me、PATCH /me/password、POST /me/avatar，在 backend/src/routes/users.ts 中实现

### 简历服务

- [x] T027 [US1] 实现简历服务：创建简历、获取简历详情（含内容）、获取简历列表、保存简历内容、更新简历元信息、删除简历，在 backend/src/services/resumeService.ts 中实现
- [x] T028 [US1] 实现简历路由：POST /、GET /、GET /:id、PUT /:id/content、PATCH /:id、DELETE /:id，在 backend/src/routes/resumes.ts 中实现

### 模板服务

- [x] T029 [P] [US1] 实现模板服务：获取模板列表、获取模板详情，在 backend/src/services/templateService.ts 中实现
- [x] T030 [P] [US1] 实现模板路由：GET /、GET /:id，在 backend/src/routes/templates.ts 中实现

### 前端认证

- [x] T031 [US1] 实现认证上下文：AuthContext 提供 user 状态、login/register/logout 方法、Token 自动刷新，在 frontend/src/contexts/AuthContext.tsx 中实现
- [x] T032 [US1] 实现认证 API 调用层：register、login、refresh、logout，在 frontend/src/services/authService.ts 中实现
- [x] T033 [US1] 实现注册页面：邮箱+密码+昵称表单、表单验证、注册成功自动登录跳转，在 frontend/src/pages/Register/ 中实现
- [x] T034 [P] [US1] 实现登录页面：邮箱+密码表单、表单验证、登录成功跳转，在 frontend/src/pages/Login/ 中实现

### 前端简历管理

- [x] T035 [US1] 实现简历 API 调用层：create、getList、getDetail、saveContent、updateMeta、delete，在 frontend/src/services/resumeService.ts 中实现
- [x] T036 [P] [US1] 实现模板 API 调用层：getList、getDetail，在 frontend/src/services/templateService.ts 中实现

### 前端简历编辑器

- [x] T037 [US1] 实现简历编辑状态管理 Hook：useReducer 管理本地简历数据快照、支持结构化字段编辑，在 frontend/src/hooks/useResume.ts 中实现
- [x] T038 [US1] 实现自动保存 Hook：30 秒定时同步、手动保存立即触发、网络中断检测与恢复补推，在 frontend/src/hooks/useAutoSave.ts 中实现
- [x] T039 [US1] 实现简历编辑器页面：左侧编辑区（基本信息、教育经历、工作经历、项目经历、技能列表表单）、右侧实时预览区，在 frontend/src/pages/ResumeEditor/ 中实现
- [x] T040 [US1] 实现基本信息编辑组件：姓名、电话、邮箱、地址、个人简介、头像上传，在 frontend/src/pages/ResumeEditor/BasicInfoForm.tsx 中实现
- [x] T041 [P] [US1] 实现教育经历编辑组件：动态列表（Ant Design Form.List），添加/删除/排序条目，在 frontend/src/pages/ResumeEditor/EducationForm.tsx 中实现
- [x] T042 [P] [US1] 实现工作经历编辑组件：动态列表，添加/删除/排序条目，在 frontend/src/pages/ResumeEditor/WorkForm.tsx 中实现
- [x] T043 [P] [US1] 实现项目经历编辑组件：动态列表，添加/删除/排序条目，在 frontend/src/pages/ResumeEditor/ProjectForm.tsx 中实现
- [x] T044 [P] [US1] 实现技能列表编辑组件：动态列表，添加/删除条目，在 frontend/src/pages/ResumeEditor/SkillsForm.tsx 中实现

### 前端模板引擎（Level 1：Schema 驱动，MVP）

> **架构说明**：采用 Schema 驱动的混合模板架构。模板 = 纯配置对象 + 通用渲染引擎 + 可复用 Block 组件库。
> 新增内置模板只需添加 ~50 行配置文件，无需新建组件文件。详见 plan.md「模板系统架构」章节。

#### 核心类型与接口

- [x] T045 [US1] 定义模板核心类型：`ITemplate`（统一接口）、`TemplateSchema`（L1 配置结构）、`BlockType`（区块枚举）、`RenderContext`（渲染上下文），在 `frontend/src/templates/engine/interfaces.ts` 中实现
- [x] T046 [P] [US1] 定义 Block 样式配置类型：`BlockStyleConfig`、`ThemeConfig`、`LayoutConfig`、`ColorPalette`、`FontSizes`，在 `frontend/src/templates/engine/interfaces.ts` 中扩展

#### 通用渲染引擎

- [x] T047 [US1] 实现 TemplateRenderer（统一渲染入口）：根据 template.level 分发到对应渲染器，提供统一的 render(data) → ReactElement 接口，在 `frontend/src/templates/engine/TemplateRenderer.tsx` 中实现
- [x] T048 [US1] 实现 TemplateRegistry（注册中心）：registerBuiltIn / registerPlugin / registerHtmlTemplate 方法，模板查找与列表，在 `frontend/src/templates/engine/TemplateRegistry.ts` 中实现
- [x] T049 [US1] 实现 Level 1 SchemaRenderer：解析 TemplateSchema 配置，按 sections 顺序调用 BlockRenderer 组合渲染，支持 single/double 布局模式，在 `frontend/src/templates/engine/level1/SchemaRenderer.tsx` 中实现
- [x] T050 [P] [US1] 实现布局策略组件：SingleColumnLayout（单栏顺序排列）和 DoubleColumnLayout（双栏左右分栏），根据 schema.layout.mode 选择，在 `frontend/src/templates/engine/level1/layouts/` 中实现

#### 可复用 Block 组件库

- [x] T051 [US1] 实现 HeaderBlock：姓名+职位+联系方式+头像，支持 photoShape（circle/square/rounded），在 `frontend/src/templates/engine/level1/blocks/HeaderBlock.tsx` 中实现
- [x] T052 [P] [US1] 实现 SummaryBlock：个人简介文本块，在 `frontend/src/templates/engine/level1/blocks/SummaryBlock.tsx` 中实现
- [x] T052b [P] [US1] 实现 ExperienceBlock：工作经历列表（公司+职位+时间段+描述），在 `frontend/src/templates/engine/level1/blocks/ExperienceBlock.tsx` 中实现
- [x] T052c [P] [US1] 实现 EducationBlock：教育背景列表（学校+专业+学历+时间），在 `frontend/src/templates/engine/level1/blocks/EducationBlock.tsx` 中实现
- [x] T052d [P] [US1] 实现 SkillsBlock：技能标签云（名称+熟练度可选展示），在 `frontend/src/templates/engine/level1/blocks/SkillsBlock.tsx` 中实现
- [x] T052e [P] [US1] 实现 ProjectsBlock：项目经历列表（项目名+角色+描述），在 `frontend/src/templates/engine/level1/blocks/ProjectsBlock.tsx` 中实现
- [x] T052f [US1] 实现 BlockRouter：根据 BlockType 映射到对应 Block 组件的调度器，在 `frontend/src/templates/engine/level1/BlockRouter.tsx` 中实现

#### 内置模板 Schema 配置

- [x] T053 [US1] 编写 classic.ts Schema：单栏布局、terracotta 主色、传统分节样式，在 `frontend/src/templates/engine/level1/schemas/classic.ts` 中实现
- [x] T054 [P] [US1] 编写 modern.ts Schema：双栏布局（左侧信息+右侧内容）、现代感配色、卡片式区块，在 `frontend/src/templates/engine/level1/schemas/modern.ts` 中实现
- [x] T055 [P] [US1] 编写 minimal.ts Schema：单栏极简布局、大量留白、最小化装饰元素，在 `frontend/src/templates/engine/level1/schemas/minimal.ts` 中实现

### 前端导出功能

- [x] T058 [US1] 实现 PDF 导出工具：html2canvas + jsPDF，对 TemplateRenderer 输出截图并生成多页 PDF，在 `frontend/src/utils/exportPdf.ts` 中实现
- [x] T059 [P] [US1] 实现图片导出工具：html2canvas → Canvas.toBlob()，PNG/JPG 格式，每页独立图片，在 `frontend/src/utils/exportImage.ts` 中实现
- [x] T060 [US1] 实现导出 Hook：封装 PDF 和图片导出逻辑，兼容 L1/L2/L3 三种渲染输出，在 `frontend/src/hooks/useExport.ts` 中实现

### 前端分页线

- [x] T061 [US1] 实现分页线计算工具：基于 A4 尺寸容器高度 + ResizeObserver 监听内容溢出，在 `frontend/src/utils/pagination.ts` 中实现
- [x] T062 [US1] 在简历预览区集成分页线指示器，在 TemplateRenderer 的容器层实现，在 `frontend/src/templates/engine/TemplateRenderer.tsx` 中扩展

### 模板切换

- [x] T056 [US1] 实现模板选择面板：从 TemplateRegistry 获取可用模板列表、缩略图展示、点击预览（SchemaRenderer 实时渲染）、应用切换，在 frontend/src/pages/ResumeEditor/TemplatePanel.tsx 中实现
- [x] T057 [US1] 实现模板切换逻辑：通过 TemplateRegistry 切换 Schema 引用、内容自动适配（数据保留+不支持字段隐藏）、编辑区始终显示所有字段，在 frontend/src/pages/ResumeEditor/ 中集成

### 集成与状态

- [x] T063 [US1] 为所有交互元素添加 ARIA 标签与键盘导航支持
- [x] T064 [US1] 实现 Loading、Error、Empty 状态（注册/登录/简历列表/编辑器各场景）

**检查点**：此时用户故事 1 应可完整独立运行与测试——用户可注册、创建简历、编辑、切换模板、导出 PDF

---

## Phase 4：用户故事 2 - 回访用户编辑与管理多份简历（优先级：P1）

**目标**：用户可查看简历列表、编辑已有简历、创建新简历、删除简历

**独立测试**：登录 → 查看简历列表 → 编辑已有简历 → 创建新简历 → 删除简历，交付简历增删改查全流程

### 简历列表页

- [x] T065 [US2] 实现我的简历页面：简历列表展示（标题、最后编辑时间、缩略图）、分页、创建新简历入口，在 frontend/src/pages/ResumeList/ 中实现
- [x] T066 [US2] 实现简历卡片组件：缩略图（由 TemplateRenderer 截图生成）、标题、编辑时间、编辑/删除操作按钮，在 frontend/src/pages/ResumeList/ResumeCard.tsx 中实现
- [x] T067 [US2] 实现删除简历确认弹窗：二次确认后调用删除 API，在 frontend/src/pages/ResumeList/ 中集成

### 简历编辑恢复

- [x] T068 [US2] 实现编辑器数据加载：从服务端获取简历详情并填充到本地状态，在 frontend/src/hooks/useResume.ts 中扩展
- [x] T069 [US2] 实现简历保存状态指示器：显示上次保存时间、同步中/已同步/同步失败状态，在 frontend/src/pages/ResumeEditor/SaveIndicator.tsx 中实现

### 集成与状态

- [x] T070 [US2] 为简历列表页添加 Loading、Error、Empty 状态
- [x] T071 [US2] 为简历列表页交互元素添加 ARIA 标签与键盘导航

**检查点**：用户故事 2 完成——用户可管理多份简历的完整生命周期

---

## Phase 5：用户故事 3 - 用户在模板列表中选择与预览模板（优先级：P2）

**目标**：用户可浏览所有可用模板、预览效果、应用到当前简历

**独立测试**：进入模板列表页 → 浏览模板缩略图 → 预览模板效果 → 应用到简历

### 模板列表页

- [x] T072 [US3] 实现模板列表页：从 TemplateRegistry 获取所有已注册模板（L1 内置 + 未来 L2/L3）、展示缩略图和名称、按级别/分类筛选，在 frontend/src/pages/TemplateList/ 中实现
- [x] T073 [US3] 实现模板卡片组件：缩略图（SchemaRenderer 快照）、名称、描述、适用行业标签、级别标识（内置/社区/自定义）、预览/应用按钮，在 frontend/src/pages/TemplateList/TemplateCard.tsx 中实现
- [x] T074 [US3] 实现模板预览弹窗：以当前简历内容通过 TemplateRenderer 渲染目标模板效果、支持切换不同模板实时对比、确认后应用，在 frontend/src/pages/TemplateList/TemplatePreviewModal.tsx 中实现

### 集成与状态

- [x] T075 [US3] 为模板列表页添加 Loading、Error、Empty 状态
- [x] T076 [US3] 为模板列表页交互元素添加 ARIA 标签与键盘导航

**检查点**：用户故事 3 完成——用户可独立浏览和预览模板

---

## Phase 6：用户故事 4 - 用户管理个人账户信息（优先级：P2）

**目标**：用户可修改昵称、密码、头像

**独立测试**：登录 → 进入个人设置 → 修改昵称 → 保存 → 验证修改生效

### 个人设置页

- [x] T077 [US4] 实现个人设置页面：显示当前账户信息（昵称、邮箱、注册时间）、修改昵称表单、修改密码表单、头像上传，在 frontend/src/pages/Settings/ 中实现
- [x] T078 [US4] 实现修改密码组件：当前密码+新密码+确认密码表单、密码强度校验，在 frontend/src/pages/Settings/PasswordForm.tsx 中实现
- [x] T079 [US4] 实现头像上传组件：Ant Design Upload、图片预览、裁剪提示（5MB 限制、JPG/PNG 格式），在 frontend/src/pages/Settings/AvatarUpload.tsx 中实现

### 集成与状态

- [x] T080 [US4] 为个人设置页添加 Loading、Error 状态
- [x] T081 [US4] 为个人设置页交互元素添加 ARIA 标签与键盘导航

**检查点**：用户故事 4 完成——用户可独立管理账户信息

---

## Phase 7：用户故事 5 - 用户上传与提交模板（优先级：P3）

**目标**：用户可上传 Level 2 插件包或 Level 3 HTML 模板，提交后默认通过并可立即在模板列表中查看

**独立测试**：登录 → 进入模板提交页 → 选择模板级别 → 填写信息 → 上传文件 → 提交 → 在我的提交中查看状态（approved） → 在模板列表中看到新模板

> **架构说明**：此阶段实现模板上传的基础设施。Level 3（HTML 模板）在 Phase 13 实现，Level 2（插件包）在 Phase 14 实现。
> 本阶段聚焦于：上传 UI + 文件存储 + 自动审核通过（提交后状态直接为 approved） + 前端展示。
>
> **审核策略（暂行）**：本阶段不做人工审核，提交后 `TemplateSubmission.status` 直接置为 `approved`，`reviewedAt` 默认为提交时间，并在 `Template` 表中立即创建对应记录（`status='active'`），使其对所有用户可见。
> **审核功能**：待后续独立阶段补充完整的人工审核后台（管理员端审核界面、驳回原因、重新提交等），届时将移除此处的默认通过逻辑。

### 后端模板提交基础设施

- [ ] T082 [US5] 实现模板存储服务：支持 L2 zip 包和 L3 HTML 文件的上传与存储，在 backend/src/services/templateStorageService.ts 中实现
- [ ] T083 [US5] 实现模板提交服务：创建提交记录、关联用户、自动审核通过（status=approved、reviewedAt=now），并同步在 Template 表中创建对应记录（level=2/3、status=active）使其立即可用，在 backend/src/services/templateService.ts 中扩展
- [ ] T084 [US5] 实现模板提交路由：POST /templates/submit（上传+元数据）、GET /templates/submissions（我的提交），在 backend/src/routes/templates.ts 中扩展

### 前端模板提交

- [ ] T085 [US5] 实现模板提交页面：选择模板级别（L2 插件包 / L3 HTML 模板）、填写元数据（名称/描述/分类/标签）、文件上传、缩略图上传，在 frontend/src/pages/TemplateSubmit/ 中实现
- [ ] T086 [US5] 实现我的提交页面：展示用户提交的模板列表及状态（当前主要为 approved，预留 pending/rejected 状态展示位以便后续审核功能接入）、查看详情，在 frontend/src/pages/MySubmissions/ 中实现

### 集成与状态

- [ ] T087 [US5] 为模板提交和我的提交页面添加 Loading、Error、Empty 状态
- [ ] T088 [US5] 为模板提交和我的提交页面交互元素添加 ARIA 标签与键盘导航

**检查点**：用户故事 5 完成——用户可提交模板并立即在模板列表中看到该模板（审核后台待后续阶段接入）

---

## Phase 8：用户故事 6 - AI 辅助优化简历内容（优先级：P4）

**目标**：用户可选中文字调用 AI 优化，获取优化建议并替换

**独立测试**：编辑简历 → 选中一段文字 → 点击 AI 优化 → 查看建议 → 选择替换

### 后端 AI 服务

- [ ] T089 [US6] 实现 AI 优化服务：调用第三方 AI API、解析响应、返回优化建议，在 backend/src/services/aiService.ts 中实现
- [ ] T090 [US6] 实现 AI 路由：POST /ai/optimize，在 backend/src/routes/ai.ts 中实现

### 前端 AI 功能

- [ ] T091 [US6] 实现 AI 优化 API 调用层，在 frontend/src/services/aiService.ts 中实现
- [ ] T092 [US6] 实现 AI 优化按钮与建议面板：选中文字后显示优化按钮、展示 2-3 个优化建议、选择替换，在 frontend/src/pages/ResumeEditor/AiOptimizePanel.tsx 中实现
- [ ] T093 [US6] 实现 AI 服务不可用时的降级策略：编辑器正常工作、AI 按钮显示不可用状态、提示用户稍后重试

**检查点**：用户故事 6 完成——用户可使用 AI 辅助优化简历内容

---

## Phase 9：用户故事 7 - 简历一键迁移到新模板（优先级：P4）

**目标**：用户可将已有简历一键迁移到新模板，内容自动适配

**独立测试**：选择已有简历 → 选择新模板 → 点击迁移 → 验证内容完整适配

### 迁移功能

- [ ] T094 [US7] 实现简历迁移服务：字段映射、不支持字段标记保留、自动适配新布局（Schema 驱动下自动适配不同模板的 sections 配置），在 backend/src/services/resumeService.ts 中扩展
- [ ] T095 [US7] 实现迁移 API：POST /resumes/:id/migrate，在 backend/src/routes/resumes.ts 中扩展
- [ ] T096 [US7] 实现前端迁移 API 调用层，在 frontend/src/services/resumeService.ts 中扩展
- [ ] T097 [US7] 实现迁移确认弹窗：预览迁移效果（使用目标 Schema 渲染）、确认后执行迁移、迁移完成提示，在 frontend/src/pages/ResumeList/MigrateModal.tsx 中实现

**检查点**：用户故事 7 完成——用户可一键迁移简历到新模板

---

## Phase 10：首页与静态页面（第一阶段需求）

**目的**：实现第一阶段的静态页面与交互（首页、导航跳转、动画效果）

- [x] T089 实现首页：平台介绍、核心功能亮点、引导注册/登录入口，在 frontend/src/pages/Home/ 中实现
- [x] T091 实现导航栏跳转逻辑：首页/我的简历/模板列表/个人设置页面间跳转，在 frontend/src/components/Layout/Header.tsx 中集成
- [x] T033 [US1] 实现注册页面（静态）：邮箱+密码+昵称表单、表单验证，在 frontend/src/pages/Register/ 中实现
- [x] T034 [P] [US1] 实现登录页面（静态）：邮箱+密码表单、表单验证，在 frontend/src/pages/Login/ 中实现
- [x] T039 [US1] 实现简历编辑器页面（静态）：三栏布局（左侧模块管理 + 中间实时预览 + 右侧样式设置），在 frontend/src/pages/ResumeEditor/ 中实现
- [ ] T098 [P] 实现页面切换过渡动画：React Transition Group 或 CSS Transition，在 frontend/src/App.tsx 中集成

---

## Phase 11：响应式布局（第三阶段需求）

**目的**：PC / 移动端适配

- [x] T100 实现响应式布局：Tailwind CSS 断点适配、移动端导航菜单、编辑器移动端布局（上下分栏），在 frontend/src/ 中各页面组件中实现

---

## Phase 12：打磨与横切关注点

**目的**：影响多个用户故事的改进项

- [ ] T101 宪法合规审查：设计禁令（无蓝紫渐变、无字体图标）、类型安全（禁止 any）、单文件 ≤ 300 行
- [ ] T102 文档语言检查：所有文档使用中文
- [ ] T103 [P] 无障碍审计：ARIA 标签完整性、键盘导航覆盖、焦点管理
- [ ] T104 [P] 安全审查：前端无硬编码凭证、Token 存储安全、XSS/CSRF 防护
- [ ] T105 [P] 性能检查：UI 反馈 ≤ 100ms、模板切换 ≤ 2s、自动保存 30s 间隔
- [ ] T106 运行 quickstart.md 验证：从零搭建环境、启动前后端、完成核心流程

---

## 依赖与执行顺序

### 阶段依赖

```text
Phase 1（搭建）
  └→ Phase 2（基础）
       ├→ Phase 3（US1 - P1）🎯 MVP
       │    ├→ Phase 4（US2 - P1）
       │    ├→ Phase 5（US3 - P2）
       │    ├→ Phase 6（US4 - P2）
       │    ├→ Phase 7（US5 - P3）── 模板提交基础设施
       │    │    ├→ Phase 13（L3 HTML 模板 - P2）📄 设计师友好
       │    │    └→ Phase 14（L2 插件包 - P3）🧩 开发者生态
       │    ├→ Phase 8（US6 - P4）
       │    └→ Phase 9（US7 - P4）
       └→ Phase 10（首页与静态页面）
            └→ Phase 11（响应式布局）
                 └→ Phase 12（打磨）
```

### 每个用户故事内部

- Model 先于 Service
- Service 先于 Route
- 后端先于前端 API 调用层
- 核心实现先于集成
- 完成当前故事后再进入下一优先级

### 并行执行示例

**Phase 2 中可并行的任务**：
- T009（种子数据）‖ T010（错误处理）‖ T011（文件上传）‖ T014（参数校验）‖ T016（类型扩展）‖ T018（前端类型）‖ T019（通用组件）‖ T020（布局组件）

**Phase 3（US1）中可并行的任务**：
- T025（用户服务）‖ T029（模板服务）
- T026（用户路由）‖ T030（模板路由）
- T034（登录页）‖ T041~T044（各经历编辑组件）
- T045（类型定义）‖ T048（Block 组件库）
- T049（TemplateRenderer）‖ T051（布局策略）
- T053~T055（Schema 配置）
- T058（PDF 导出）‖ T059（图片导出）

---

## 实施策略

### MVP 范围

**MVP = Phase 1 + Phase 2 + Phase 3（US1）**

MVP 交付后，用户即可完成核心旅程：注册 → 创建简历 → 编辑 → 切换模板 → 导出 PDF。

### 增量交付顺序

1. **MVP**：Phase 1 + 2 + 3 → 用户可创建、编辑简历并导出 PDF（Level 1 Schema 引擎 + 3 个内置模板）
2. **V1.1**：Phase 4 → 多简历管理
3. **V1.2**：Phase 5 + 6 → 模板浏览 + 账户管理
4. **V1.3**：Phase 10 + 11 → 首页 + 响应式
5. **V1.4**：Phase 13 → Level 3 HTML 模板（用户上传 HTML+CSS 模板）
6. **V1.5**：Phase 7 → 模板提交基础设施 + 审核流
7. **V2.0**：Phase 14 → Level 2 插件包（开发者自定义 JS 包）
8. **V2.5**：Phase 8 + 9 → AI 能力 + 简历迁移
9. **最终**：Phase 12 → 打磨

---

## Phase 13：Level 3 — HTML 模板系统（优先级：P2）

**目标**：用户可上传 HTML+CSS 模板（含 Handlebars 数据绑定语法），平台在沙箱中安全渲染

**前置依赖**：Phase 7（模板提交基础设施）、Phase 3（TemplateRenderer 已就绪）

**独立测试**：上传 HTML 模板 → 审核通过 → 在模板列表中可见 → 应用到简历 → 预览效果正常

> **架构说明**：Level 3 面向设计师群体。用户编写 HTML + CSS + `{{handlebars}}` 数据绑定语法，平台 BindingEngine 将 ResumeData 注入模板，在 iframe sandbox 中渲染。
> 安全性：iframe `sandbox="allow-scripts"` 隔离，禁止访问主页面 DOM/Storage/Cookie。

### 后端 L3 支持

- [ ] T107 [L3] 实现 HTML 模板验证服务：检查 Handlebars 语法合法性、检测危险标签（script/embed/object）、文件大小 ≤ 2MB、必填字段（`{{name}}`, `{{email}}`），在 backend/src/services/htmlValidator.ts 中实现
- [ ] T108 [L3] 扩展模板存储：支持 HTML 模板的版本管理（用户可多次上传同一模板的不同版本），在 backend/src/services/templateStorageService.ts 中扩展

### 前端 L3 渲染引擎

- [ ] T109 [L3] 实现 HtmlRenderer：创建 iframe sandbox、注入模板 HTML+CSS、通过 postMessage 传递 ResumeData，在 frontend/src/templates/engine/level3/HtmlRenderer.tsx 中实现
- [ ] T110 [L3] 实现 BindingEngine：Handlebars 封装层，将 ResumeData 映射为模板变量（name/email/phone/experiences[] 等），在 frontend/src/templates/engine/level3/BindingEngine.ts 中实现
- [ ] T111 [L3] 实现 HtmlSandbox 组件：管理 iframe 生命周期（创建→加载→通信→销毁）、错误边界（模板渲染失败时显示友好提示），在 frontend/src/templates/engine/level3/HtmlSandbox.tsx 中实现
- [ ] T112 [L3] 在 TemplateRenderer 中接入 Level 3 分支：当 template.level === 3 时路由到 HtmlRenderer，在 frontend/src/templates/engine/TemplateRenderer.tsx 中扩展

### 用户交互

- [ ] T113 [L3] 实现 HTML 模板上传向导：步骤引导（选择文件 → 填写元数据 → 预览效果 → 提交审核），实时预览使用 BindingEngine 渲染，在 frontend/src/pages/TemplateSubmit/HtmlUploadWizard.tsx 中实现
- [ ] T114 [L3] 扩展模板列表页：显示 L3 模板的「自定义」标识、作者信息、下载量统计，在 frontend/src/pages/TemplateList/TemplateCard.tsx 中扩展

**检查点**：Level 3 完成——设计师可通过 HTML+CSS 贡献模板

---

## Phase 14：Level 2 — 插件包系统（优先级：P3）

**目标**：开发者可上传自包含 JS 插件包（实现 ITemplate 接口），平台在沙箱中执行并渲染

**前置依赖**：Phase 7（模板提交基础设施）、Phase 3（ITemplate 接口已定义）

**独立测试**：开发者打包插件 → 上传 → 审核通过 → 用户选用 → 正常渲染

> **架构说明**：Level 2 面向开发者群体。插件包 = 自包含 JS bundle，导出实现 ITemplate 接口的对象。平台 PluginLoader 动态 import() 加载，在 iframe sandbox 中执行 render() 方法。
> 权限模型：插件声明所需权限（如 customLayout/fullStyleControl），审核时人工确认。

### 后端 L2 支持

- [ ] T115 [L2] 实现插件包验证服务：检查 package.json 合规性、ITemplate 接口实现完整性、权限声明合法性、bundle 大小 ≤ 5MB，在 backend/src/services/pluginValidator.ts 中实现
- [ ] T116 [L2] 实现插件权限审核工作流：待审核 → 人工审核（查看权限声明+代码扫描结果）→ 通过/拒绝，在 backend/src/services/pluginReviewService.ts 中实现

### 前端 L2 引擎

- [ ] T117 [L2] 实现 PluginLoader：动态 import() 加载插件包、缓存已加载模块、错误处理（加载失败降级提示），在 frontend/src/templates/engine/level2/PluginLoader.ts 中实现
- [ ] T118 [L2] 实现 PluginSandbox：创建 iframe sandbox、注入插件代码、通过 postMessage 调用 render() 并接收渲染结果，在 frontend/src/templates/engine/level2/PluginSandbox.tsx 中实现
- [ ] T119 [L2] 在 TemplateRenderer 中接入 Level 2 分支：当 template.level === 2 时路由到 PluginSandbox，在 frontend/src/templates/engine/TemplateRenderer.tsx 中扩展

### 开发者工具

- [ ] T120 [L2] 编写插件开发 SDK 文档：ITemplate 接口规范、本地调试指南、打包配置示例、权限声明格式、提交流程，在 docs/plugin-sdk.md 中实现
- [ ] T121 [L2] 实现插件本地调试工具：开发者可在本地运行插件并预览效果（无需部署到平台），在 frontend/src/pages/PluginDevTools/ 中实现

**检查点**：Level 2 完成——开发者可通过 JS 插件包贡献完全自定义的模板

---

## 备注

- [P] 任务 = 不同文件、无依赖，可并行执行
- [Story] 标签将任务映射到具体用户故事，便于追溯
- 每个用户故事应可独立完成与测试
- 单文件不得超过 300 行（宪法限制）
- 实施前查阅相关 skills（ui-ux-pro-max、api-design、database-design、tailwindcss、react-typescript）
