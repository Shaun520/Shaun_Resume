# 快速入门：Shaun Resume 在线简历制作平台

**日期**：2026-06-01 | **计划**：[plan.md](./plan.md)

## 前置条件

- Node.js 20+
- PostgreSQL 16+
- pnpm 10+（项目采用 pnpm monorepo 管理）

## 环境变量

### 后端（apps/backend/.env）

```env
DATABASE_URL="postgresql://user:password@localhost:5432/shaun_resume"
JWT_ACCESS_SECRET="your-access-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
UPLOAD_DIR="./uploads"
PORT=3000
CORS_ORIGIN="http://localhost:5173"

# GitHub 文件存储（替代 OSS）
# 需要一个拥有 repo/Contents 权限的 Private Access Token，仅存放于后端（绝不下发前端）
GITHUB_STORAGE_ENABLED="false"  # 开发期可设 false 走本地落盘；生产设为 true
GITHUB_OWNER=""                 # 新 GitHub 账号用户名
GITHUB_REPO=""                  # 独立公开资源仓库，如 shaun-resume-assets
GITHUB_BRANCH="main"
GITHUB_TOKEN=""                 # 需 repo / Contents 写权限
GITHUB_RAW_BASE="https://raw.githubusercontent.com"
GITHUB_MAX_FILE_SIZE="5242880"
```

### 前端（apps/frontend/.env）

```env
VITE_API_BASE_URL="http://localhost:3000/api"
```

## 启动步骤

### 1. 安装依赖（仓库根目录一次安装）

```bash
pnpm install
```

### 2. 初始化数据库

```bash
cd apps/backend
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

种子数据将创建 3 个基础模板（经典、现代、极简）。

### 3. 启动开发服务器

```bash
# 一键同时启动前后端（根目录）
pnpm dev

# 或分别单独启动
pnpm --filter @shaun-resume/backend dev   # 后端（端口 3000）
pnpm --filter @shaun-resume/frontend dev  # 前端（端口 5173）
```

### 4. 访问应用

浏览器打开 `http://localhost:5173`

### 5. 启用 GitHub 文件存储（可选）

> 上传文件统一走后端推送 GitHub 资源仓库。设置 `GITHUB_STORAGE_ENABLED=false` 时上传功能不可用（后端返回 503），仅保留 `/uploads/` 静态服务用于读取历史本地数据。生产必须启用并配置 `GITHUB_*`。

1. 准备一个 GitHub 账号，创建一个**独立公开仓库**（如 `shaun-resume-assets`）用于存放用户上传的图片/文件（与主代码仓库分离，避免污染 git 历史）
2. 生成一个 Private Access Token（PAT）：GitHub → Settings → Developer settings → Personal access tokens → 勾选 `repo` 写权限
3. 更新 `apps/backend/.env` 中 `GITHUB_*` 变量并设 `GITHUB_STORAGE_ENABLED="true"`（`GITHUB_OWNER` 为账号用户名、`GITHUB_REPO` 为资源仓库名、`GITHUB_TOKEN` 为刚生成的 PAT）
4. 重启后端

> 上传链路为「前端 multipart → 后端代理 → GitHub Contents API 写入资源仓库 → 返回 raw URL」。PAT 只存在于后端，绝不下发浏览器。

### 6. 验证 GitHub 文件存储流程

- 上传新头像后，`User.avatarUrl` 应返回 `https://raw.githubusercontent.com/{owner}/{repo}/main/avatars/{userId}/...` 形态
- 在资源仓库可看到新文件位于 `avatars/{userId}/`、`resumes/{userId}/{resumeId}/`、`submissions/{userId}/` 前缀
- 重新登录后，头像仍可正常显示（说明 DB 中已落库）

## 开发规范

### 代码风格

- TypeScript 严格模式，禁止 `any`
- 单文件不超过 300 行
- 变量/函数名自解释，禁止缩写
- 仅使用 Tailwind CSS 样式，禁止 CSS-in-JS

### 提交规范

- 使用中文提交信息
- 格式：`[阶段] 类型: 描述`，例如 `[第一阶段] feat: 添加首页布局`

### 测试

```bash
# 仓库根目录一键测试
pnpm test

# 或分别
pnpm --filter @shaun-resume/backend test   # 后端测试
pnpm --filter @shaun-resume/frontend test  # 前端测试
```

## 项目结构速览

```text
apps/frontend/src/
├── components/     # 通用组件
├── pages/          # 页面组件
├── templates/      # 简历模板组件
├── hooks/          # 自定义 Hooks
├── services/       # API 调用层
├── contexts/       # React Context
├── types/          # TypeScript 类型
└── utils/          # 工具函数

apps/backend/src/
├── middleware/     # 中间件
├── routes/         # 路由
├── services/       # 业务逻辑
├── utils/          # 工具函数
└── types/          # TypeScript 类型

packages/shared/src/   # 前后端共享类型
├── resume.ts      # 简历内容领域类型
└── ai.ts          # AI 优化类型
```
