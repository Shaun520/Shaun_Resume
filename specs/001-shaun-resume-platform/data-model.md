# 数据模型：Shaun Resume 在线简历制作平台

**日期**：2026-06-01 | **规格**：[spec.md](./spec.md) | **计划**：[plan.md](./plan.md)

## 实体关系概览

```text
User 1───* Resume
User 1───* TemplateSubmission
Resume 1───1 ResumeContent
Resume *───1 Template
```

## 实体定义

### User（用户）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 用户唯一标识 |
| email | String | UNIQUE, NOT NULL | 登录邮箱 |
| passwordHash | String | NOT NULL | bcrypt 加密后的密码 |
| nickname | String | NOT NULL, DEFAULT '用户' | 昵称 |
| role | Enum(user, admin) | NOT NULL, DEFAULT 'user' | 角色：普通用户/管理员 |
| avatarUrl | String | NULLABLE | 头像路径 |
| createdAt | DateTime | NOT NULL, DEFAULT now() | 注册时间 |
| updatedAt | DateTime | NOT NULL, DEFAULT now() | 最后更新时间 |
| lastLoginAt | DateTime | NULLABLE | 最后登录时间 |

**验证规则**：
- email：标准邮箱格式，最大 255 字符
- password：原始密码 8-32 字符，需包含字母和数字
- nickname：2-20 字符

**状态转换**：无（用户无状态机）

---

### Resume（简历）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 简历唯一标识 |
| userId | UUID | FK → User.id, NOT NULL | 所属用户 |
| title | String | NOT NULL, DEFAULT '未命名简历' | 简历标题 |
| templateId | UUID | FK → Template.id, NOT NULL | 关联模板 |
| createdAt | DateTime | NOT NULL, DEFAULT now() | 创建时间 |
| updatedAt | DateTime | NOT NULL, DEFAULT now() | 最后编辑时间 |

**验证规则**：
- title：1-50 字符

**级联规则**：
- 删除 User 时级联删除所有 Resume
- 删除 Template 时阻止（SET NULL 不适用，模板为必选）

---

### ResumeContent（简历内容）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 内容唯一标识 |
| resumeId | UUID | FK → Resume.id, UNIQUE, NOT NULL | 关联简历（一对一） |
| basicInfo | JSON | NOT NULL, DEFAULT '{}' | 基本信息 |
| education | JSON | NOT NULL, DEFAULT '[]' | 教育经历列表 |
| workExperience | JSON | NOT NULL, DEFAULT '[]' | 工作经历列表 |
| projectExperience | JSON | NOT NULL, DEFAULT '[]' | 项目经历列表 |
| skills | JSON | NOT NULL, DEFAULT '[]' | 技能列表 |
| updatedAt | DateTime | NOT NULL, DEFAULT now() | 最后更新时间 |

**JSON 字段结构**：

```text
basicInfo: {
  name: string           // 姓名
  phone: string          // 电话
  email: string          // 邮箱
  address: string        // 地址
  summary: string        // 个人简介
  avatarUrl: string      // 头像路径
}

education: [{
  school: string         // 学校
  major: string          // 专业
  degree: string         // 学历（本科/硕士/博士/其他）
  startDate: string      // 起始时间 (YYYY-MM)
  endDate: string        // 结束时间 (YYYY-MM)
}]

workExperience: [{
  company: string        // 公司
  position: string       // 职位
  startDate: string      // 起始时间 (YYYY-MM)
  endDate: string        // 结束时间 (YYYY-MM)
  description: string    // 工作描述
}]

projectExperience: [{
  name: string           // 项目名
  role: string           // 角色
  startDate: string      // 起始时间 (YYYY-MM)
  endDate: string        // 结束时间 (YYYY-MM)
  description: string    // 项目描述
}]

skills: [{
  name: string           // 技能名称
  proficiency: string    // 熟练度（了解/熟悉/精通/专家）
}]
```

**级联规则**：
- 删除 Resume 时级联删除 ResumeContent

---

### Template（模板）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 模板唯一标识 |
| name | String | UNIQUE, NOT NULL | 模板名称 |
| description | String | NOT NULL | 模板描述 |
| thumbnailUrl | String | NOT NULL | 缩略图路径 |
| schemaKey | String | UNIQUE, NOT NULL | L1 Schema 配置标识（如 classic/modern/minimal），对应前端 schemas/ 下的文件名 |
| level | Int | NOT NULL, DEFAULT 1 | 模板级别：1=Schema驱动(内置), 2=插件包(社区), 3=HTML模板(自定义) |
| industryTags | String | NULLABLE | 适用行业标签，逗号分隔 |
| status | Enum(active, inactive) | NOT NULL, DEFAULT 'active' | 状态 |
| createdAt | DateTime | NOT NULL, DEFAULT now() | 创建时间 |
| updatedAt | DateTime | NOT NULL, DEFAULT now() | 最后更新时间 |

**验证规则**：
- name：2-30 字符
- schemaKey：合法的标识符（小写字母+数字+连字符），与前端 schemas/ 目录下的文件名对应
- level：1（内置Schema）、2（插件包）、3（HTML模板）
- industryTags：每个标签 2-10 字符

---

### TemplateSubmission（模板提交）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 提交唯一标识 |
| userId | UUID | FK → User.id, NOT NULL | 提交用户 |
| name | String | NOT NULL | 模板名称 |
| description | String | NOT NULL | 模板描述 |
| fileUrl | String | NOT NULL | 模板文件路径 |
| thumbnailUrl | String | NULLABLE | 缩略图路径 |
| industryTags | String | NULLABLE | 适用行业标签 |
| status | Enum(pending, approved, rejected) | NOT NULL, DEFAULT 'approved' | 审核状态 |
| submittedAt | DateTime | NOT NULL, DEFAULT now() | 提交时间 |
| reviewedAt | DateTime | NULLABLE | 审核时间（Phase 7 暂行策略下默认与 submittedAt 相同） |

**验证规则**：
- name：2-30 字符
- fileUrl：有效的文件路径

**状态转换**：

```text
approved   ←──(自动通过，Phase 7 暂行策略)── 新提交
approved ──(approved)──→ approved（无变化）
approved ──(rejected)──→ rejected（待后续审核功能接入）
pending  ←──(待审核，人工审核功能接入后启用)── 重新提交
pending  ──(approved)──→ approved
pending  ──(rejected)──→ rejected
```

> **Phase 7 暂行策略**：本阶段不做人工审核，新提交后 `status` 直接置为 `approved`，`reviewedAt` 默认为提交时间；同时在 `Template` 表中创建对应记录（`status='active'`），使其对所有用户可见。
> 人工审核功能（管理员端审核界面、驳回原因、重新提交等）将在后续独立阶段补充，届时 `status` 默认值改为 `pending` 并启用 `pending → approved/rejected` 流转。

审核操作由独立后台管理系统执行，本平台仅展示状态。

**级联规则**：
- 删除 User 时不级联删除 TemplateSubmission（保留提交记录）

---

## 索引设计

| 表 | 索引 | 类型 | 说明 |
|----|------|------|------|
| User | email | UNIQUE | 邮箱唯一查询 |
| Resume | userId | INDEX | 按用户查询简历列表 |
| Resume | templateId | INDEX | 按模板查询关联简历 |
| ResumeContent | resumeId | UNIQUE | 一对一关联查询 |
| Template | schemaKey | UNIQUE | Schema 配置标识查询 |
| Template | status | INDEX | 按状态筛选可用模板 |
| TemplateSubmission | userId | INDEX | 按用户查询提交列表 |
| TemplateSubmission | status | INDEX | 按状态筛选提交 |
