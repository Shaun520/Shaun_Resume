# 模板管理接口契约

**基础路径**：`/api/templates`

---

## GET /api/templates

获取可用模板列表

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 筛选状态，默认 active |
| level | number | 否 | 按模板级别筛选（1=内置Schema, 2=插件包, 3=HTML模板） |
| industry | string | 否 | 按行业标签筛选 |

**认证**：公开接口，无需登录

**成功响应** 200：

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "经典模板",
      "description": "适合传统行业，布局清晰稳重",
      "thumbnailUrl": "/uploads/templates/classic-thumb.jpg",
      "schemaKey": "classic",
      "level": 1,
      "industryTags": "传统行业,金融,教育",
      "createdAt": "2026-06-01T00:00:00Z"
    }
  ]
}
```

---

## GET /api/templates/:id

获取模板详情

**认证**：公开接口，无需登录

**成功响应** 200：

```json
{
  "id": "uuid",
  "name": "经典模板",
  "description": "适合传统行业，布局清晰稳重",
  "thumbnailUrl": "/uploads/templates/classic-thumb.jpg",
  "schemaKey": "classic",
  "level": 1,
  "industryTags": "传统行业,金融,教育",
  "supportedFields": ["basicInfo", "education", "workExperience", "projectExperience", "skills"],
  "createdAt": "2026-06-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z"
}
```

**错误响应**：
- 404：模板不存在

---

## POST /api/templates/submit

提交模板（第三阶段功能）

**认证**：需登录

**请求**：`multipart/form-data`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 模板名称，2-30 字符 |
| description | string | 是 | 模板描述 |
| level | number | 是 | 模板级别：2=插件包(zip), 3=HTML模板 |
| file | File | 是 | 模板文件（.zip 或 .html） |
| thumbnail | File | 是 | 缩略图（JPG/PNG，≤ 2MB） |
| industryTags | string | 否 | 行业标签，逗号分隔 |

**成功响应** 201：

```json
{
  "id": "uuid",
  "name": "我的模板",
  "status": "approved",
  "submittedAt": "2026-06-01T12:00:00Z",
  "reviewedAt": "2026-06-01T12:00:00Z"
}
```

> **Phase 7 暂行策略**：提交后服务端不进行人工审核，直接返回 `status: "approved"`，并立即在 `Template` 资源中创建 `status: "active"` 记录，使模板对所有用户可见。`reviewedAt` 与 `submittedAt` 相同。
> 待后续阶段接入人工审核后台后，本接口将改为返回 `status: "pending"`，并增加审核回调接口。

**错误响应**：
- 400：参数无效 / 文件格式不支持
- 401：未登录

---

## GET /api/templates/submissions

获取当前用户的模板提交列表（第三阶段功能）

**认证**：需登录

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 筛选状态：pending/approved/rejected（Phase 7 主要返回 approved） |

**成功响应** 200：

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "我的模板",
      "status": "approved",
      "submittedAt": "2026-06-01T12:00:00Z",
      "reviewedAt": "2026-06-01T12:00:00Z"
    }
  ]
}
```
