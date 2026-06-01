# 项目宪法 (Project Constitution)

## Skill优先原则
在进行代码编写前，先查找skills列表，若存在对应的skills则使用该skills；例如，进行页面UI设计使用ui-ux-pro-max；设计api接口，使用api-design；设计数据库使用database-design等等

## 1. 视觉与设计 (Design & Aesthetics)
• 严禁渐变： 绝对禁止使用蓝紫渐变色（例如 `from-blue-500 to-purple-600`）。这是最高优先级禁令，适用于所有 UI 组件。
• 严禁使用字体图标：天然的字体图标有AI味，禁止使用
• 风格一致：进行设计必须保持风格一致，布局一致等


## 2. 技术栈锁定 (Tech Stack Lock-in)
• 技术栈：
- 前端：React、TS、AntDesign、TailwindCSS4、
- 后端：Express、PostgreSQL、Prisma、JWT、html2canvas、TS
- 构建工具：Vite8 
注意上述只展示主要的技术栈，若开发其他技术可添加

• 样式方案：Tailwind CSS<禁止使用 CSS-in-JS（如 Styled Components）或 CSS Modules，除非明确要求。

• 状态管理： 能用 URL 参数（Search Params）解决的不要用全局状态。能用 React 原生能力的不要引入第三方库。


## 3. 代码质量与复杂度 (Code Quality)
• 极简原则： 必须选择最简单的实现方案。严禁过度设计（Over-engineering）。如果 10 行代码能解决，绝不使用一个复杂的第三方库。

• 类型安全： 严禁使用 `any` 类型。若类型不明，使用 `unknown`；若确实没有，使用 `never`。

• 命名规范： 变量名和函数名必须具有自解释性。禁止使用缩写（例如：用 `getUserData`，不用 `getData` 或 `gud`）。

• 文件体积： 单个文件不得超过 300 行代码。超过则必须进行模块化拆分。


## 4. 行为与伦理 (Behavior & Ethics)
• 拒绝占位符： 严禁生成 "Lorem Ipsum" 乱数假文。必须使用符合业务语境的真实感占位数据，或者直接向用户询问具体内容。

• 无模拟数据： 不要在生产代码中硬编码 Mock 数据。必须实现真实的 Loading（加载中）、Error（错误）和 Empty（空状态）处理，除非明确要求。

• 安全红线： 严禁在前端代码中硬编码 API Key 或敏感凭证。

• 无障碍访问： 所有交互元素必须包含正确的 Aria 标签，并支持键盘导航（Tab 键切换）。


## 5. 交互与响应 (Interaction Rules)
• 响应速度： 所有 UI 交互反馈（如点击、悬停）必须在 100ms 内完成，确保手感顺滑。

• 确认机制： 在执行破坏性操作（如删除数据、覆盖文件）前，必须先列出计划并等待用户确认，不得擅自行动。