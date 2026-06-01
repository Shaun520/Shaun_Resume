# 快速入门：Shaun Resume 在线简历制作平台

**日期**：2026-06-01 | **计划**：[plan.md](./plan.md)

## 前置条件

- Node.js 20+
- PostgreSQL 16+
- pnpm 9+（推荐）或 npm

## 环境变量

### 后端（backend/.env）

```env
DATABASE_URL="postgresql://user:password@localhost:5432/shaun_resume"
JWT_ACCESS_SECRET="your-access-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
UPLOAD_DIR="./uploads"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

### 前端（frontend/.env）

```env
VITE_API_BASE_URL="http://localhost:3000/api"
```

## 启动步骤

### 1. 安装依赖

```bash
# 后端
cd backend
pnpm install

# 前端
cd frontend
pnpm install
```

### 2. 初始化数据库

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

种子数据将创建 3 个基础模板（经典、现代、极简）。

### 3. 启动开发服务器

```bash
# 后端（端口 3000）
cd backend
pnpm dev

# 前端（端口 5173）
cd frontend
pnpm dev
```

### 4. 访问应用

浏览器打开 `http://localhost:5173`

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
# 后端测试
cd backend && pnpm test

# 前端测试
cd frontend && pnpm test
```

## 项目结构速览

```text
frontend/src/
├── components/     # 通用组件
├── pages/          # 页面组件
├── templates/      # 简历模板组件
├── hooks/          # 自定义 Hooks
├── services/       # API 调用层
├── contexts/       # React Context
├── types/          # TypeScript 类型
└── utils/          # 工具函数

backend/src/
├── middleware/     # 中间件
├── routes/         # 路由
├── services/       # 业务逻辑
├── utils/          # 工具函数
└── types/          # TypeScript 类型
```
