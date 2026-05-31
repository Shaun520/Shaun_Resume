---
description: "功能实施任务列表模板"
---

# 任务：[FEATURE NAME]

**输入**：来自 `/specs/[###-feature-name]/` 的设计文档

**前置条件**：plan.md（必填）、spec.md（用户故事必填）、research.md、data-model.md、contracts/

**测试**：下方示例含测试任务。测试为可选项——仅当功能规格明确要求时才包含。

**组织方式**：任务按用户故事分组，以便各故事可独立实施与测试。

**宪法**：所有实施必须符合 `.specify/memory/constitution.md`。

## 格式：`[ID] [P?] [Story] 描述`

- **[P]**：可并行执行（不同文件、无依赖）
- **[Story]**：所属用户故事（例如 US1、US2、US3）
- 描述中须包含具体文件路径

## 路径约定

- **Web 应用**：`backend/src/`、`frontend/src/`
- 下方路径假设 Web 应用结构——请按 plan.md 实际结构调整

## Phase 1：搭建（共享基础设施）

**目的**：项目初始化与基础结构

- [ ] T001 按实施计划创建项目结构
- [ ] T002 初始化前端（React + TS + Vite 8 + Tailwind CSS 4 + Ant Design）
- [ ] T003 初始化后端（Express + TS + Prisma + PostgreSQL）
- [ ] T004 [P] 配置 lint 与格式化工具

---

## Phase 2：基础（阻塞性前置）

**目的**：在任何用户故事开始前必须完成的核心基础设施

**⚠️ 关键**：本阶段完成前不得开始任何用户故事工作

- [ ] T005 搭建数据库 schema 与 Prisma 迁移
- [ ] T006 [P] 实现 JWT 认证框架
- [ ] T007 [P] 搭建 API 路由与中间件结构
- [ ] T008 创建所有故事依赖的基础 model/entity
- [ ] T009 配置错误处理与日志基础设施
- [ ] T010 搭建环境配置管理

**检查点**：基础就绪——可并行开始用户故事实施

---

## Phase 3：用户故事 1 - [标题]（优先级：P1）🎯 MVP

**目标**：[简要描述本故事交付内容]

**独立测试**：[如何验证本故事可独立工作]

### 用户故事 1 实施

- [ ] T011 [P] [US1] 在 backend/src/models/[entity1].ts 创建 [Entity1] model
- [ ] T012 [US1] 在 backend/src/services/[service].ts 实现 [Service]
- [ ] T013 [US1] 在 backend/src/api/[file].ts 实现 [endpoint/feature]
- [ ] T014 [US1] 在 frontend/src/[location]/[file].tsx 实现 [UI 组件/页面]
- [ ] T015 [US1] 添加 Loading、Error、Empty 状态（禁止生产 Mock 数据）
- [ ] T016 [US1] 为交互元素添加 ARIA 标签与键盘导航

**检查点**：此时用户故事 1 应可完整独立运行与测试

---

## Phase N：打磨与横切关注点

**目的**：影响多个用户故事的改进项

- [ ] TXXX 宪法合规审查（设计禁令、类型安全、单文件 ≤ 300 行）
- [ ] TXXX 文档语言检查（所有文档使用中文）
- [ ] TXXX [P] 无障碍审计（ARIA、键盘导航）
- [ ] TXXX 安全审查（前端无硬编码凭证）
- [ ] TXXX 性能检查（UI 反馈 ≤ 100ms）
- [ ] TXXX 运行 quickstart.md 验证

---

## 依赖与执行顺序

### 阶段依赖

- **搭建（Phase 1）**：无依赖——可立即开始
- **基础（Phase 2）**：依赖搭建完成——阻塞所有用户故事
- **用户故事（Phase 3+）**：均依赖基础阶段完成
- **打磨（最终阶段）**：依赖所有目标用户故事完成

### 每个用户故事内部

- Model 先于 Service
- Service 先于 Endpoint
- 核心实现先于集成
- 完成当前故事后再进入下一优先级

---

## 备注

- [P] 任务 = 不同文件、无依赖
- [Story] 标签将任务映射到具体用户故事，便于追溯
- 每个用户故事应可独立完成与测试
- 单文件不得超过 300 行（宪法限制）
- 实施前查阅相关 skills（ui-ux-pro-max、api-design、database-design）
