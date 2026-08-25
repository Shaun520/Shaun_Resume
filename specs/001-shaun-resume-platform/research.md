# 技术调研：Shaun Resume 在线简历制作平台

**日期**：2026-06-01（OSS 上传方案于 2026-06-08 追加） | **规格**：[spec.md](./spec.md)

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

## 5. 文件上传方案（MVP → OSS 迁移）

### 5.1 阶段一（MVP 已落地）：本地磁盘存储

**决策**：Multer（服务端）+ Ant Design Upload（前端），文件落地到 `./uploads/` 目录，DB 存相对路径。

**理由**：
- Multer 是 Express 生态标准的文件上传中间件，与宪法锁定的 Express 完美集成
- Ant Design Upload 组件提供拖拽上传、进度条、预览等开箱即用功能
- 头像图片存储在服务端文件系统，数据库记录路径，部署简单

**问题与不足**：
- 部署在容器/无状态实例时磁盘不持久，文件易丢失
- 横向扩容需要额外做共享存储（NFS / OSSFS）才能保证多实例一致
- 服务端带宽被占用，影响 API 响应
- 无法复用 CDN 做边缘加速

**备选方案**：
- 直接 Base64 存储到数据库：大文件导致数据库膨胀，查询性能下降
- 第三方对象存储（OSS/S3）：阶段二引入（本计划新增项）

---

### 5.2 阶段二（本计划新增）：阿里云 OSS + STS 临时凭证直传

**决策**：阿里云 OSS（对象存储服务）+ STS 临时凭证 + 浏览器直传。

**架构图**：

```text
┌────────┐ ①申请STS凭证   ┌────────┐ ③签发STS    ┌─────────┐
│ Browser│ ───────────────▶│ Backend│ ──────────▶│ Aliyun  │
│        │ ◀─────────────── │ (Node) │ ◀────────── │ RAM/STS │
│        │  ②{Token, Key}  └────────┘             └─────────┘
│        │                                            │
│        │ ④ PUT（带临时STS签名）直传到OSS Bucket       │
│        │ ─────────────────────────────────────────▶│
│        │ ◀───────────  ⑤ 返回 200 + 对象URL         │
│        │                                            │
│        │ ⑥ POST /users/me/avatar { avatarUrl }      │
│        │ ───────────────▶│ Backend│ ──► DB UPDATE
└────────┘                  └────────┘
```

**理由**：
- **带宽卸载**：文件不再经过后端服务器，OSS 带宽按量计费且自带 CDN 加速
- **安全**：RAM 子账号 + STS 临时凭证（默认 1 小时过期），凭证最小权限（`oss:PutObject`），后端永不下发长期 AccessKey
- **生态成熟**：阿里云官方 Node.js SDK `ali-oss` 与 STS 配套完善；项目位于国内，OSS 是最自然的选择（备案、加速、回源）
- **可扩展**：未来可平滑切换为 CDN 域名、HTTPS 自定义域名、跨区域复制

**核心流程**：
1. 前端选中文件后，先校验类型 / 大小（不消耗流量）
2. 前端请求 `POST /api/uploads/sts-token`，后端调用 STS 服务签发临时凭证（限定 dir 前缀，如 `avatars/{userId}/`）
3. 前端拿到 `{ accessKeyId, accessKeySecret, stsToken, region, bucket, dir }` 后，使用 `ali-oss` 客户端（或原生 fetch + Signature V4）以 `multipart upload` 方式将文件直传 OSS
4. 上传成功后，前端调用 `PUT /api/users/me` 携带 `avatarUrl`（OSS 公开访问 URL）完成业务落库
5. 失败回滚：上传到 OSS 成功但落库失败时，标记对象为 `lifecycle` 自动清理（见 5.3）

**与现有 `upload.ts` 的兼容策略**：
- 保留 `uploadAvatar` / `uploadTemplate` / `uploadSubmission` multer 中间件（兼容性回退）
- 路由层判断 `process.env.OSS_ENABLED === 'true'`：
  - 启用 OSS → 跳过 multer，要求前端先拿 STS 再提交 URL
  - 未启用 → 走原 multer 落盘逻辑（开发友好）
- 二者对外契约一致：均返回 `{ avatarUrl: string }`

**目录与命名规范**：

| 用途 | OSS 目录前缀 | 文件命名 | 公开读 |
|------|--------------|----------|--------|
| 个人头像 | `avatars/{userId}/` | `{uuid}{.jpg|.png}` | ✓ |
| 简历图片 | `resumes/{userId}/{resumeId}/` | `{uuid}{.jpg|.png}` | ✓ |
| 模板缩略图 | `templates/thumbnails/` | `{uuid}{.jpg|.png}` | ✓ |
| 用户提交模板 | `submissions/{userId}/` | `{uuid}{.zip|.html}` | ✗（签名URL） |
| 提交缩略图 | `submissions/{userId}/thumbnails/` | `{uuid}{.jpg|.png}` | ✓ |

**备选方案**：
- **服务端代理上传（不直传）**：实现最简单但占用后端带宽，单机带宽瓶颈。规模增长后必然重构 → 否决
- **预签名 PUT URL（替代 STS）**：URL 包含签名，前端直接 PUT，无需 STS。但 URL 泄露后任何人在有效期内可上传 → 权限粒度不如 STS，且 STS 可刷新 → 否决
- **腾讯云 COS / 华为云 OBS / AWS S3**：接口与 SDK 类似，但项目在国内且团队熟悉阿里云，OSS 优先；架构留有抽象层 `ossProvider`，后续可替换
- **自建 MinIO**：增加运维成本，违反"极简"原则 → 否决

---

### 5.3 OSS 生命周期与清理策略

**决策**：OSS Bucket 启用生命周期规则自动清理孤立对象。

| 规则 | 匹配前缀 | 过期天数 | 动作 |
|------|----------|----------|------|
| 用户头像旧版本 | `avatars/{userId}/*` | 30 | 转为归档（IA） |
| 简历孤立图片 | `resumes/{userId}/*` | 7 | 删除（业务可能尚未落库） |
| 提交文件 | `submissions/{userId}/*` | 365 | 删除 |

**理由**：
- 用户多次上传头像会生成多个对象，DB 只保留最新 URL，旧对象 30 天后转 IA 节省存储成本
- 直传流程中"OSS 上传成功但 DB 写入失败"会留下孤儿对象，7 天后自动清理
- 提交文件保留 1 年便于审核追溯

**触发式清理（可选增强）**：
- 用户删除简历 / 头像时，后端异步调用 `ossClient.delete(url)` 立即清理
- 失败时降级：记入 `cleanup_failed` 队列，次日定时重试

---

### 5.4 前端直传体验

**决策**：保留 Ant Design Upload 组件，改造 `customRequest` 走「先 STS → 再直传 → 再回调后端」三步。

**理由**：
- 既有 `BasicInfoForm`、`AvatarUpload` 都基于 AntD Upload，UI 体验（拖拽、进度、预览）免费获得
- `customRequest` 完全可定制，替换默认 POST 行为，对调用方零侵入
- 进度条通过 `ossClient.put` 的 progress 事件驱动，复用 AntD 的 UI 组件

**用户体验约束**：
- 客户端校验：JPG/PNG/WEBP，≤ 5MB（图片可考虑压缩到 2MB 后再上传）
- 进度反馈：实时百分比（满足宪法 UI 反馈 ≤ 100ms 原则）
- 失败重试：网络错误可重试 3 次，业务错误立即终止

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
