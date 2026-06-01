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

- [ ] T023 [US1] 实现认证服务：注册（邮箱验证+密码强度+签发Token）、登录（验证+签发Token）、刷新Token、登出，在 backend/src/services/authService.ts 中实现
- [ ] T024 [US1] 实现认证路由：POST /register、POST /login、POST /refresh、POST /logout，在 backend/src/routes/auth.ts 中实现

### 用户服务

- [ ] T025 [P] [US1] 实现用户服务：获取用户信息、更新用户信息、修改密码、上传头像，在 backend/src/services/userService.ts 中实现
- [ ] T026 [P] [US1] 实现用户路由：GET /me、PATCH /me、PATCH /me/password、POST /me/avatar，在 backend/src/routes/users.ts 中实现

### 简历服务

- [ ] T027 [US1] 实现简历服务：创建简历、获取简历详情（含内容）、获取简历列表、保存简历内容、更新简历元信息、删除简历，在 backend/src/services/resumeService.ts 中实现
- [ ] T028 [US1] 实现简历路由：POST /、GET /、GET /:id、PUT /:id/content、PATCH /:id、DELETE /:id，在 backend/src/routes/resumes.ts 中实现

### 模板服务

- [ ] T029 [P] [US1] 实现模板服务：获取模板列表、获取模板详情，在 backend/src/services/templateService.ts 中实现
- [ ] T030 [P] [US1] 实现模板路由：GET /、GET /:id，在 backend/src/routes/templates.ts 中实现

### 前端认证

- [ ] T031 [US1] 实现认证上下文：AuthContext 提供 user 状态、login/register/logout 方法、Token 自动刷新，在 frontend/src/contexts/AuthContext.tsx 中实现
- [ ] T032 [US1] 实现认证 API 调用层：register、login、refresh、logout，在 frontend/src/services/authService.ts 中实现
- [ ] T033 [US1] 实现注册页面：邮箱+密码+昵称表单、表单验证、注册成功自动登录跳转，在 frontend/src/pages/Register/ 中实现
- [ ] T034 [P] [US1] 实现登录页面：邮箱+密码表单、表单验证、登录成功跳转，在 frontend/src/pages/Login/ 中实现

### 前端简历管理

- [ ] T035 [US1] 实现简历 API 调用层：create、getList、getDetail、saveContent、updateMeta、delete，在 frontend/src/services/resumeService.ts 中实现
- [ ] T036 [P] [US1] 实现模板 API 调用层：getList、getDetail，在 frontend/src/services/templateService.ts 中实现

### 前端简历编辑器

- [ ] T037 [US1] 实现简历编辑状态管理 Hook：useReducer 管理本地简历数据快照、支持结构化字段编辑，在 frontend/src/hooks/useResume.ts 中实现
- [ ] T038 [US1] 实现自动保存 Hook：30 秒定时同步、手动保存立即触发、网络中断检测与恢复补推，在 frontend/src/hooks/useAutoSave.ts 中实现
- [ ] T039 [US1] 实现简历编辑器页面：左侧编辑区（基本信息、教育经历、工作经历、项目经历、技能列表表单）、右侧实时预览区，在 frontend/src/pages/ResumeEditor/ 中实现
- [ ] T040 [US1] 实现基本信息编辑组件：姓名、电话、邮箱、地址、个人简介、头像上传，在 frontend/src/pages/ResumeEditor/BasicInfoForm.tsx 中实现
- [ ] T041 [P] [US1] 实现教育经历编辑组件：动态列表（Ant Design Form.List），添加/删除/排序条目，在 frontend/src/pages/ResumeEditor/EducationForm.tsx 中实现
- [ ] T042 [P] [US1] 实现工作经历编辑组件：动态列表，添加/删除/排序条目，在 frontend/src/pages/ResumeEditor/WorkForm.tsx 中实现
- [ ] T043 [P] [US1] 实现项目经历编辑组件：动态列表，添加/删除/排序条目，在 frontend/src/pages/ResumeEditor/ProjectForm.tsx 中实现
- [ ] T044 [P] [US1] 实现技能列表编辑组件：动态列表，添加/删除条目，在 frontend/src/pages/ResumeEditor/SkillsForm.tsx 中实现

### 前端模板组件

- [ ] T045 [US1] 实现经典简历模板组件：接收 ResumeContent Props 渲染 A4 尺寸简历布局，在 frontend/src/templates/Classic/ 中实现
- [ ] T046 [P] [US1] 实现现代简历模板组件：不同布局风格，在 frontend/src/templates/Modern/ 中实现
- [ ] T047 [P] [US1] 实现极简简历模板组件：极简布局风格，在 frontend/src/templates/Minimal/ 中实现

### 前端导出功能

- [ ] T048 [US1] 实现 PDF 导出工具：html2canvas + jsPDF，支持多页导出，在 frontend/src/utils/exportPdf.ts 中实现
- [ ] T049 [P] [US1] 实现图片导出工具：html2canvas → Canvas.toBlob()，PNG/JPG 格式，每页独立图片，在 frontend/src/utils/exportImage.ts 中实现
- [ ] T050 [US1] 实现导出 Hook：封装 PDF 和图片导出逻辑，在 frontend/src/hooks/useExport.ts 中实现

### 前端分页线

- [ ] T051 [US1] 实现分页线计算工具：基于 A4 尺寸容器高度 + ResizeObserver 监听内容溢出，在 frontend/src/utils/pagination.ts 中实现
- [ ] T052 [US1] 在简历预览区集成分页线指示器，在 frontend/src/pages/ResumeEditor/PreviewPanel.tsx 中实现

### 模板切换

- [ ] T053 [US1] 实现模板选择面板：缩略图列表、点击预览、应用切换，在 frontend/src/pages/ResumeEditor/TemplatePanel.tsx 中实现
- [ ] T054 [US1] 实现模板切换逻辑：切换后内容自动适配、不支持字段隐藏但数据保留、编辑区始终显示所有字段，在 frontend/src/pages/ResumeEditor/ 中集成

### 集成与状态

- [ ] T055 [US1] 为所有交互元素添加 ARIA 标签与键盘导航支持
- [ ] T056 [US1] 实现 Loading、Error、Empty 状态（注册/登录/简历列表/编辑器各场景）

**检查点**：此时用户故事 1 应可完整独立运行与测试——用户可注册、创建简历、编辑、切换模板、导出 PDF

---

## Phase 4：用户故事 2 - 回访用户编辑与管理多份简历（优先级：P1）

**目标**：用户可查看简历列表、编辑已有简历、创建新简历、删除简历

**独立测试**：登录 → 查看简历列表 → 编辑已有简历 → 创建新简历 → 删除简历，交付简历增删改查全流程

### 简历列表页

- [ ] T057 [US2] 实现我的简历页面：简历列表展示（标题、最后编辑时间、缩略图）、分页、创建新简历入口，在 frontend/src/pages/ResumeList/ 中实现
- [ ] T058 [US2] 实现简历卡片组件：缩略图、标题、编辑时间、编辑/删除操作按钮，在 frontend/src/pages/ResumeList/ResumeCard.tsx 中实现
- [ ] T059 [US2] 实现删除简历确认弹窗：二次确认后调用删除 API，在 frontend/src/pages/ResumeList/ 中集成

### 简历编辑恢复

- [ ] T060 [US2] 实现编辑器数据加载：从服务端获取简历详情并填充到本地状态，在 frontend/src/hooks/useResume.ts 中扩展
- [ ] T061 [US2] 实现简历保存状态指示器：显示上次保存时间、同步中/已同步/同步失败状态，在 frontend/src/pages/ResumeEditor/SaveIndicator.tsx 中实现

### 集成与状态

- [ ] T062 [US2] 为简历列表页添加 Loading、Error、Empty 状态
- [ ] T063 [US2] 为简历列表页交互元素添加 ARIA 标签与键盘导航

**检查点**：用户故事 2 完成——用户可管理多份简历的完整生命周期

---

## Phase 5：用户故事 3 - 用户在模板列表中选择与预览模板（优先级：P2）

**目标**：用户可浏览所有可用模板、预览效果、应用到当前简历

**独立测试**：进入模板列表页 → 浏览模板缩略图 → 预览模板效果 → 应用到简历

### 模板列表页

- [ ] T064 [US3] 实现模板列表页：展示所有可用模板的缩略图和名称、行业标签筛选，在 frontend/src/pages/TemplateList/ 中实现
- [ ] T065 [US3] 实现模板卡片组件：缩略图、名称、描述、适用行业标签、预览/应用按钮，在 frontend/src/pages/TemplateList/TemplateCard.tsx 中实现
- [ ] T066 [US3] 实现模板预览弹窗：以当前简历内容渲染目标模板效果，确认后应用，在 frontend/src/pages/TemplateList/TemplatePreviewModal.tsx 中实现

### 集成与状态

- [ ] T067 [US3] 为模板列表页添加 Loading、Error、Empty 状态
- [ ] T068 [US3] 为模板列表页交互元素添加 ARIA 标签与键盘导航

**检查点**：用户故事 3 完成——用户可独立浏览和预览模板

---

## Phase 6：用户故事 4 - 用户管理个人账户信息（优先级：P2）

**目标**：用户可修改昵称、密码、头像

**独立测试**：登录 → 进入个人设置 → 修改昵称 → 保存 → 验证修改生效

### 个人设置页

- [ ] T069 [US4] 实现个人设置页面：显示当前账户信息（昵称、邮箱、注册时间）、修改昵称表单、修改密码表单、头像上传，在 frontend/src/pages/Settings/ 中实现
- [ ] T070 [US4] 实现修改密码组件：当前密码+新密码+确认密码表单、密码强度校验，在 frontend/src/pages/Settings/PasswordForm.tsx 中实现
- [ ] T071 [US4] 实现头像上传组件：Ant Design Upload、图片预览、裁剪提示（5MB 限制、JPG/PNG 格式），在 frontend/src/pages/Settings/AvatarUpload.tsx 中实现

### 集成与状态

- [ ] T072 [US4] 为个人设置页添加 Loading、Error 状态
- [ ] T073 [US4] 为个人设置页交互元素添加 ARIA 标签与键盘导航

**检查点**：用户故事 4 完成——用户可独立管理账户信息

---

## Phase 7：用户故事 5 - 用户上传与提交模板（优先级：P3）

**目标**：用户可上传模板文件并提交，查看提交状态

**独立测试**：登录 → 进入模板提交页 → 填写模板信息 → 上传模板 → 提交 → 在我的提交中查看状态

### 后端模板提交

- [ ] T074 [US5] 实现模板提交服务：提交模板、获取用户提交列表，在 backend/src/services/templateService.ts 中扩展
- [ ] T075 [US5] 实现模板提交路由：POST /submit、GET /submissions，在 backend/src/routes/templates.ts 中扩展

### 前端模板提交

- [ ] T076 [US5] 实现模板提交页面：模板名称、描述、行业标签、文件上传、缩略图上传表单，在 frontend/src/pages/TemplateSubmit/ 中实现
- [ ] T077 [US5] 实现我的提交页面：展示用户提交的模板列表及审核状态（pending/approved/rejected），在 frontend/src/pages/MySubmissions/ 中实现

### 集成与状态

- [ ] T078 [US5] 为模板提交和我的提交页面添加 Loading、Error、Empty 状态
- [ ] T079 [US5] 为模板提交和我的提交页面交互元素添加 ARIA 标签与键盘导航

**检查点**：用户故事 5 完成——用户可提交模板并查看审核状态

---

## Phase 8：用户故事 6 - AI 辅助优化简历内容（优先级：P4）

**目标**：用户可选中文字调用 AI 优化，获取优化建议并替换

**独立测试**：编辑简历 → 选中一段文字 → 点击 AI 优化 → 查看建议 → 选择替换

### 后端 AI 服务

- [ ] T080 [US6] 实现 AI 优化服务：调用第三方 AI API、解析响应、返回优化建议，在 backend/src/services/aiService.ts 中实现
- [ ] T081 [US6] 实现 AI 路由：POST /ai/optimize，在 backend/src/routes/ai.ts 中实现

### 前端 AI 功能

- [ ] T082 [US6] 实现 AI 优化 API 调用层，在 frontend/src/services/aiService.ts 中实现
- [ ] T083 [US6] 实现 AI 优化按钮与建议面板：选中文字后显示优化按钮、展示 2-3 个优化建议、选择替换，在 frontend/src/pages/ResumeEditor/AiOptimizePanel.tsx 中实现
- [ ] T084 [US6] 实现 AI 服务不可用时的降级策略：编辑器正常工作、AI 按钮显示不可用状态、提示用户稍后重试

**检查点**：用户故事 6 完成——用户可使用 AI 辅助优化简历内容

---

## Phase 9：用户故事 7 - 简历一键迁移到新模板（优先级：P4）

**目标**：用户可将已有简历一键迁移到新模板，内容自动适配

**独立测试**：选择已有简历 → 选择新模板 → 点击迁移 → 验证内容完整适配

### 迁移功能

- [ ] T085 [US7] 实现简历迁移服务：字段映射、不支持字段标记保留、自动适配新布局，在 backend/src/services/resumeService.ts 中扩展
- [ ] T086 [US7] 实现迁移 API：POST /resumes/:id/migrate，在 backend/src/routes/resumes.ts 中扩展
- [ ] T087 [US7] 实现前端迁移 API 调用层，在 frontend/src/services/resumeService.ts 中扩展
- [ ] T088 [US7] 实现迁移确认弹窗：预览迁移效果、确认后执行迁移、迁移完成提示，在 frontend/src/pages/ResumeList/MigrateModal.tsx 中实现

**检查点**：用户故事 7 完成——用户可一键迁移简历到新模板

---

## Phase 10：首页与静态页面（第一阶段需求）

**目的**：实现第一阶段的静态页面与交互（首页、导航跳转、动画效果）

- [ ] T089 实现首页：平台介绍、核心功能亮点、引导注册/登录入口，在 frontend/src/pages/Home/ 中实现
- [ ] T090 [P] 实现页面切换过渡动画：React Transition Group 或 CSS Transition，在 frontend/src/App.tsx 中集成
- [ ] T091 实现导航栏跳转逻辑：首页/我的简历/模板列表/个人设置页面间跳转，在 frontend/src/components/Layout/Header.tsx 中集成

---

## Phase 11：响应式布局（第三阶段需求）

**目的**：PC / 移动端适配

- [ ] T092 实现响应式布局：Tailwind CSS 断点适配、移动端导航菜单、编辑器移动端布局（上下分栏），在 frontend/src/ 中各页面组件中实现

---

## Phase 12：打磨与横切关注点

**目的**：影响多个用户故事的改进项

- [ ] T093 宪法合规审查：设计禁令（无蓝紫渐变、无字体图标）、类型安全（禁止 any）、单文件 ≤ 300 行
- [ ] T094 文档语言检查：所有文档使用中文
- [ ] T095 [P] 无障碍审计：ARIA 标签完整性、键盘导航覆盖、焦点管理
- [ ] T096 [P] 安全审查：前端无硬编码凭证、Token 存储安全、XSS/CSRF 防护
- [ ] T097 [P] 性能检查：UI 反馈 ≤ 100ms、模板切换 ≤ 2s、自动保存 30s 间隔
- [ ] T098 运行 quickstart.md 验证：从零搭建环境、启动前后端、完成核心流程

---

## 依赖与执行顺序

### 阶段依赖

```text
Phase 1（搭建）
  └→ Phase 2（基础）
       ├→ Phase 3（US1 - P1）🎯 MVP
       │    └→ Phase 4（US2 - P1）
       │    └→ Phase 5（US3 - P2）
       │    └→ Phase 6（US4 - P2）
       │         └→ Phase 7（US5 - P3）
       │         └→ Phase 8（US6 - P4）
       │         └→ Phase 9（US7 - P4）
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
- T045~T047（三个模板组件）
- T048（PDF导出）‖ T049（图片导出）

---

## 实施策略

### MVP 范围

**MVP = Phase 1 + Phase 2 + Phase 3（US1）**

MVP 交付后，用户即可完成核心旅程：注册 → 创建简历 → 编辑 → 切换模板 → 导出 PDF。

### 增量交付顺序

1. **MVP**：Phase 1 + 2 + 3 → 用户可创建和导出简历
2. **V1.1**：Phase 4 → 多简历管理
3. **V1.2**：Phase 5 + 6 → 模板浏览 + 账户管理
4. **V1.3**：Phase 10 + 11 → 首页 + 响应式
5. **V2.0**：Phase 7 → 模板提交
6. **V3.0**：Phase 8 + 9 → AI 能力
7. **最终**：Phase 12 → 打磨

---

## 备注

- [P] 任务 = 不同文件、无依赖，可并行执行
- [Story] 标签将任务映射到具体用户故事，便于追溯
- 每个用户故事应可独立完成与测试
- 单文件不得超过 300 行（宪法限制）
- 实施前查阅相关 skills（ui-ux-pro-max、api-design、database-design、tailwindcss、react-typescript）
