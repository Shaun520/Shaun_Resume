# 技术调研：Shaun Resume 在线简历制作平台

**日期**：2026-06-01 | **规格**：[spec.md](./spec.md)

## 调研概览

本文档记录实施计划中所有技术决策的调研结果，包括决策、理由和备选方案。

---

## 1. PDF 导出方案

**决策**：使用 html2canvas + jsPDF 组合方案

**理由**：
- 宪法已锁定 html2canvas 作为导出方案
- html2canvas 将 DOM 渲染为 Canvas，jsPDF 将 Canvas 转为 PDF，支持多页导出
- 与预览区共享同一套 DOM 渲染，保证导出与预览一致（SC-004）
- 无需额外维护模板的 PDF 渲染逻辑，降低复杂度

**备选方案**：
- Puppeteer（服务端渲染 PDF）：需要额外服务端渲染服务，架构复杂度高，且宪法未批准
- React-PDF（纯 React 组件生成 PDF）：需要为每个模板维护两套渲染逻辑（预览 + PDF），违反极简原则
- pdfmake：需要将结构化数据转换为 pdfmake DSL，模板系统需要额外适配层

---

## 2. 图片导出方案

**决策**：使用 html2canvas 直接导出 Canvas 为 PNG/JPG

**理由**：
- 复用 PDF 导出中已有的 html2canvas 渲染结果
- Canvas.toBlob() 原生支持 PNG/JPG 格式转换
- 每页导出为独立图片，与 PDF 多页逻辑一致

**备选方案**：
- dom-to-image：已不再维护，存在兼容性问题
- 原生 Canvas API 手动绘制：工作量大，需为每个模板编写绘制逻辑

---

## 3. 结构化字段编辑方案

**决策**：使用 Ant Design Form + 自定义结构化字段组件

**理由**：
- 宪法锁定 Ant Design，其 Form 组件提供完整的表单验证、布局和状态管理
- 结构化字段（教育、工作、项目经历）本质上是动态表单列表，Ant Design Form.List 原生支持
- 无需引入额外富文本编辑器，简历字段以结构化输入为主（文本框、日期选择器等）
- 工作描述等长文本使用 Ant Design Input.TextArea 即可满足需求

**备选方案**：
- 富文本编辑器（TinyMCE / Quill / Slate）：简历内容以结构化字段为主，富文本引入不必要的复杂度，且与结构化存储冲突
- Formily：功能强大但学习曲线陡峭，违反极简原则

---

## 4. 模板渲染系统

**决策**：React 组件模板 + Props 驱动渲染

**理由**：
- 每个模板是一个 React 组件，接收简历结构化数据作为 Props
- 预览区和导出共享同一组件，保证视觉一致性
- 模板切换只需替换组件引用，数据自动适配（FR-019）
- 新模板只需创建新 React 组件，无需额外模板引擎

**备选方案**：
- Handlebars / EJS 等模板引擎：需要额外编译步骤，与 React 生态割裂
- JSON Schema 驱动模板：灵活但复杂度高，MVP 阶段不需要
- CSS-only 模板切换：布局变化受限，无法实现差异化较大的模板

---

## 5. 文件上传方案

**决策**：Multer（服务端）+ Ant Design Upload（前端）

**理由**：
- Multer 是 Express 生态标准的文件上传中间件，与宪法锁定的 Express 完美集成
- Ant Design Upload 组件提供拖拽上传、进度条、预览等开箱即用功能
- 头像图片存储在服务端文件系统，数据库记录路径；后续可迁移至对象存储

**备选方案**：
- 直接 Base64 存储到数据库：大文件导致数据库膨胀，查询性能下降
- 第三方对象存储（OSS/S3）：MVP 阶段增加外部依赖和成本，违反极简原则

---

## 6. 分页线指示方案

**决策**：基于 A4 尺寸的 CSS 容器 + 动态高度计算

**理由**：
- 预览区使用固定 A4 尺寸容器（210mm × 297mm），CSS 渲染分页线
- 通过 ResizeObserver 监听内容高度变化，当内容超出单页高度时自动显示分页线
- 纯前端实现，无需服务端参与

**备选方案**：
- 服务端分页计算：增加请求延迟，违反 UI 反馈 ≤ 100ms 要求
- 虚拟分页（每页独立容器）：内容跨页时需要拆分逻辑，复杂度高

---

## 7. 本地优先同步策略实现

**决策**：React Context + useReducer 管理本地状态 + 定时 debounce 同步

**理由**：
- 宪法要求优先使用 React 内置能力，无需引入外部状态库
- useReducer 管理简历编辑状态的完整快照，支持撤销/重做扩展
- 30 秒定时同步使用 setInterval + debounce，手动保存立即触发
- 网络状态监听通过 navigator.onLine + online/offline 事件实现自动补推

**备选方案**：
- Redux / Zustand：宪法要求优先 React 内置能力，当前场景 useReducer 足够
- IndexedDB 本地持久化：增加复杂度，MVP 阶段 localStorage 即可满足离线缓存需求
- CRDT 协作方案：MVP 无实时协作需求，过度设计

---

## 8. JWT Token 存储策略

**决策**：Access Token 存储在内存中，Refresh Token 存储在 HttpOnly Cookie

**理由**：
- Access Token 存内存避免 XSS 攻击窃取，页面刷新时通过 Refresh Token 重新获取
- Refresh Token 存 HttpOnly Cookie，JavaScript 无法读取，防止 XSS
- 自动续期通过 Axios 拦截器实现：401 响应时自动调用刷新接口

**备选方案**：
- 双 Token 均存 localStorage：XSS 攻击可窃取 Token，安全性低
- 双 Token 均存 Cookie：需要 CSRF 防护，增加复杂度
- Session-Cookie：宪法锁定 JWT，且 Session 不利于后续横向扩展

---

## 9. 前端路由方案

**决策**：React Router v6

**理由**：
- React 生态标准路由方案，与 React 19+ 完全兼容
- 支持路由守卫（鉴权）、嵌套路由、懒加载
- 宪法要求优先 URL 参数管理状态，React Router 原生支持

**备选方案**：
- TanStack Router：类型安全更好但生态较新，MVP 阶段不需要
- 自研路由：违反极简原则

---

## 10. 测试方案

**决策**：Vitest + React Testing Library

**理由**：
- Vitest 与 Vite 8 原生集成，零配置开箱即用
- React Testing Library 是 React 组件测试的标准方案，关注用户行为而非实现细节
- 后端 API 测试使用 Vitest + Supertest

**备选方案**：
- Jest：需要额外配置以兼容 Vite，Vitest 是更好的选择
- Cypress / Playwright：E2E 测试在后续阶段引入，MVP 以单元/集成测试为主
