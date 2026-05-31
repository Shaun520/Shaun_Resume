# 实施计划：[FEATURE]

**分支**：`[###-feature-name]` | **日期**：[DATE] | **规格**：[link]

**输入**：来自 `/specs/[###-feature-name]/spec.md` 的功能规格说明

**说明**：本模板由 `/speckit-plan` 命令填充。执行流程见 `.specify/templates/plan-template.md`。

## 摘要

[从功能规格中提取：主要需求 + 调研后的技术方案]

## 技术上下文

**语言/版本**：[例如 TypeScript 5.x 或 待澄清]

**主要依赖**：[例如 React、Ant Design、Express、Prisma 或 待澄清]

**存储**：[如适用，例如 PostgreSQL 或 不适用]

**测试**：[例如 Vitest、Jest 或 待澄清]

**目标平台**：[例如 Web 浏览器、Node.js 服务器 或 待澄清]

**项目类型**：[例如 web-service 或 待澄清]

**性能目标**：[领域相关，例如 UI 反馈 <100ms 或 待澄清]

**约束**：[领域相关；须与 `.specify/memory/constitution.md` 对齐]

**规模/范围**：[领域相关，例如 1 万用户、20 个页面 或 待澄清]

## 宪法检查

*门禁：Phase 0 调研前必须通过。Phase 1 设计后须重新检查。*

参考：`.specify/memory/constitution.md`

| 门禁 | 要求 | 状态 |
|------|------|------|
| Skill 优先 | 实施前已查阅相关 skills | ☐ |
| 设计 | 无蓝紫渐变；无字体图标；风格一致 | ☐ |
| 技术栈 | 仅使用已批准栈（前端 React/TS/Ant Design/Tailwind 4/Vite 8；后端 Express/PostgreSQL/Prisma/JWT/TS） | ☐ |
| 样式 | 仅 Tailwind CSS（除非批准，否则禁止 CSS-in-JS 或 CSS Modules） | ☐ |
| 状态 | 优先 URL 参数；优先 React 内置能力而非第三方状态库 | ☐ |
| 极简 | 最简单方案；无不必要依赖 | ☐ |
| 类型安全 | 禁止 `any`；单文件 ≤ 300 行 | ☐ |
| 内容 | 禁止 Lorem Ipsum；实现真实 Loading/Error/Empty 状态 | ☐ |
| 安全 | 前端禁止硬编码 API Key | ☐ |
| 无障碍 | 交互元素含 ARIA 标签并支持键盘导航 | ☐ |
| 交互 | UI 反馈 ≤ 100ms；破坏性操作须用户确认 | ☐ |
| 文档 | 所有项目文档（spec、plan、tasks、README 等）使用中文 | ☐ |

若任一门禁无法满足，须在下方复杂度追踪表中记录理由。

## 项目结构

### 文档（本功能）

```text
specs/[###-feature]/
├── plan.md              # 本文件（/speckit-plan 命令输出）
├── research.md          # Phase 0 输出（/speckit-plan 命令）
├── data-model.md        # Phase 1 输出（/speckit-plan 命令）
├── quickstart.md        # Phase 1 输出（/speckit-plan 命令）
├── contracts/           # Phase 1 输出（/speckit-plan 命令）
└── tasks.md             # Phase 2 输出（/speckit-task 命令）
```

### 源代码（仓库根目录）

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
```

**结构决策**：[记录所选结构，并引用上方实际目录]

## 复杂度追踪

> **仅当宪法检查存在必须 justified 的违规项时填写**

| 违规项 | 为何需要 | 更简单方案被拒绝的原因 |
|--------|----------|------------------------|
| [例如：第三方状态库] | [当前需求] | [为何 URL 参数 / React 状态不足] |
