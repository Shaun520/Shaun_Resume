<!--
同步影响报告
- 版本变更：1.1.0 → 1.1.1
- 修改原则：无（仅语言本地化）
- 新增章节：无
- 移除章节：无
- 模板更新状态：
  - ✅ .specify/templates/constitution-template.md
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .cursor/rules/project_rules.md
  - ✅ .trae/rules/project_rules.md
  - ⚠ .specify/templates/commands/*.md（尚未安装）
  - ⚠ README.md（尚未创建）
- 待办事项：无
-->

# Shaun Resume Platform 项目宪法

## 核心原则

### Skill 优先原则

在编写任何代码之前，Agent 必须先查找可用的 skills 列表，若存在匹配的 skill 则必须使用。
若存在给定的UI原型图，则严格按照UI原型图进行设计。

- UI/页面设计 → `ui-ux-pro-max`
- API 设计 → `api-design`
- 数据库设计 → `database-design`
- Tailwind CSS 配置 → `tailwindcss`
- React/TypeScript 模式 → `react-typescript`
- 代码审查与测试 → `code-review`、`unit-testing`、`code-quality-suite`

**理由**：Skills 编码了项目特定约定，可减少不同 Agent 和会话之间实现不一致的问题。

### 视觉与设计

所有 UI 工作必须遵循以下不可协商的设计规则：

- **禁止蓝紫渐变**：绝对禁止使用蓝到紫的渐变色（例如 `from-blue-500 to-purple-600`）。这是最高优先级的视觉禁令，适用于所有 UI 组件。
- **禁止字体图标**：禁止使用图标字体库（如 Font Awesome、Material Icons 字体）。字体图标具有明显 AI 生成感；应使用 SVG 图标或 Ant Design 内置图标。
- **风格一致**：布局、间距、字体排版和组件模式必须在页面内及页面间保持一致。

**理由**：一致且有意图的设计能建立信任，避免 generic 的 AI 生成美学。

### 技术栈锁定

除非功能规格在复杂度追踪表中明确记录了合理例外，否则项目必须使用已批准的技术栈。

**前端**：React、TypeScript、Ant Design、Tailwind CSS 4、Vite 8

**后端**：Express、TypeScript、PostgreSQL、Prisma、JWT、html2canvas

**构建**：Vite 8

功能需要时可添加其他技术，但必须在实施计划中记录。

**样式方案**：仅允许 Tailwind CSS。禁止 CSS-in-JS（如 Styled Components）和 CSS Modules，除非用户明确要求。

**状态管理**：优先使用 URL 查询参数而非全局状态。优先使用 React 内置能力（`useState`、`useReducer`、Context）而非第三方状态库。仅当更简单的方案不足且计划中有说明时，才引入外部状态库。

**理由**：锁定技术栈可降低集成风险、上手成本和意外的架构漂移。

### 代码质量与复杂度

- **极简原则**：必须选择最简单且正确的实现方案。严禁过度设计。若 10 行代码能解决问题，不得引入复杂库。
- **类型安全**：严禁使用 `any`。类型不确定时使用 `unknown`；确实无可能值时使用 `never`。
- **命名规范**：变量名和函数名必须自解释。禁止使用缩写（例如使用 `getUserData`，不用 `getData` 或 `gud`）。
- **文件体积**：单个源文件不得超过 300 行。达到上限时必须拆分为模块。

**理由**：小型、强类型、可读性高的代码更易于审查、测试和维护。

### 行为与伦理

- **拒绝占位符乱文**：严禁生成 Lorem Ipsum 或随机假文。必须使用符合业务语境的占位内容，或向用户询问真实内容。
- **禁止生产 Mock 数据**：不得在生产代码中硬编码 Mock 数据。必须实现真实的 Loading（加载中）、Error（错误）和 Empty（空状态）处理，除非用户明确要求 Mock/演示模式。
- **安全红线**：严禁在前端代码中硬编码 API Key 或敏感凭证。
- **无障碍访问**：所有交互元素必须包含正确的 ARIA 属性，并支持键盘导航（Tab 顺序、焦点指示）。

**理由**：真实内容、正确的错误处理和无障碍访问是基线产品要求，而非可选润色。

### 交互与响应

- **响应速度**：所有 UI 交互反馈（点击、悬停、切换）必须在 100ms 内完成，确保手感顺滑。
- **破坏性操作确认**：在执行破坏性操作（删除数据、覆盖文件、不可逆变更）前，Agent 必须先列出计划并等待用户确认，不得擅自行动。

**理由**：快速反馈和明确确认可避免用户挫败感和意外数据丢失。

### 文档语言

所有项目文档必须使用简体中文编写。

适用范围包括：规格说明（spec）、计划（plan）、任务（tasks）、README、快速入门指南、API 文档、文档类提交信息，以及为本项目生成的其他文档。

- 代码标识符（变量名、函数名、文件路径）按命名规范保持英文。
- 产品面向用户的 UI 文案按产品需求决定；面向 Agent 和开发者的项目文档必须使用中文。

**理由**：团队与干系人使用中文沟通；中文文档可减少误解，使规格与意图保持一致。

## Skill 参考映射

| 任务领域 | 使用的 Skill |
|----------|--------------|
| UI/UX 设计 | `ui-ux-pro-max` |
| REST API 设计 | `api-design` |
| 数据库 schema | `database-design` |
| Tailwind CSS v4 | `tailwindcss` |
| Web 视觉产物 | `web-design-engineer` |
| 代码审查 | `code-review` |
| 单元测试（Java） | `unit-testing` |
| Spec/Plan 工作流 | `speckit-*` 命令 |

## 治理

### 修订程序

1. 通过 `/speckit-constitution` 提出变更，并附明确的原则文本。
2. 评估对活跃 spec、plan 及进行中功能的影响。
3. 原则变更时更新依赖模板（plan、spec、tasks）。
4. 按下方语义化版本规则递增 `CONSTITUTION_VERSION`。
5. 将 `LAST_AMENDED_DATE` 设为修订日期。

### 版本策略

- **MAJOR（主版本）**：向后不兼容的原则删除或重新定义。
- **MINOR（次版本）**：新增原则或实质性扩展指引。
- **PATCH（补丁版本）**：澄清说明、措辞修正、非语义性改进。

### 合规审查

- 每个实施计划必须包含宪法检查门禁（见 `.specify/templates/plan-template.md`）。
- Phase 1 设计完成后及合并前须重新检查宪法合规性。
- 违规项必须在计划的复杂度追踪表中记录并说明理由；无合理理由的违规将阻止实施。

**版本**：1.1.1 | **批准日期**：2026-05-31 | **最后修订**：2026-05-31
