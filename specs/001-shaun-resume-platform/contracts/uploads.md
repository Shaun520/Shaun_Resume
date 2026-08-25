# 文件上传接口契约（OSS 直传）

**基础路径**：`/api/uploads`

所有接口需携带 `Authorization: Bearer <accessToken>` 请求头。

> 本节为新增内容，统一描述头像 / 简历图片 / 模板缩略图 / 提交文件等资源走「STS 临时凭证 + 浏览器直传 OSS」的契约。
> 当 `OSS_ENABLED=false` 时回退为本地落盘，接口行为兼容（仅 URL 前缀从 OSS 域名变为 `/uploads/...`）。

---

## 通用流程

```text
1. 前端选文件 → 客户端校验（类型/大小）
2. POST /api/uploads/sts-token { scene: 'avatar' | 'resume-image' | 'submission' }
   ← 200 { accessKeyId, accessKeySecret, stsToken, region, bucket, dir, host, expireSeconds, scene, maxSize, allowedTypes }
3. 前端以 STS 凭证直传 OSS（PUT / multipart upload）
4. 上传成功 → 前端拿到 OSS Key / 公开 URL
5. 前端调用对应业务接口提交 URL：
   - 头像：PATCH /api/users/me { avatarUrl }
   - 简历图片：PUT  /api/resumes/:id/content { basicInfo: { ..., avatarUrl } }
   - 提交文件：POST /api/templates/submit { ..., fileUrl, thumbnailUrl }
```

---

## POST /api/uploads/sts-token

申请 OSS 直传所需的 STS 临时凭证。

**请求体**：

```json
{
  "scene": "avatar"
}
```

| 字段 | 类型 | 必填 | 取值 | 说明 |
|------|------|------|------|------|
| scene | string | 是 | `avatar` \| `resume-image` \| `submission` | 业务场景，决定 dir 前缀与权限策略 |
| resumeId | string | 简历图片场景必填 | UUID | 仅 `resume-image` 场景需要，限定写到该简历子目录 |

**成功响应** 200：

```json
{
  "accessKeyId": "STS.NTHZxxxxxxxxxxxxx",
  "accessKeySecret": "******（临时，1 小时内有效）",
  "stsToken": "******（临时，1 小时内有效）",
  "region": "oss-cn-hangzhou",
  "bucket": "shaun-resume-prod",
  "dir": "avatars/3f0a.../",
  "host": "https://shaun-resume-prod.oss-cn-hangzhou.aliyuncs.com",
  "expireSeconds": 3600,
  "scene": "avatar",
  "maxSize": 5242880,
  "allowedTypes": ["image/jpeg", "image/png", "image/webp"],
  "cdnHost": "https://cdn.example.com"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| accessKeyId | string | STS 临时 AK |
| accessKeySecret | string | STS 临时 SK |
| stsToken | string | STS 安全令牌 |
| region | string | OSS Region |
| bucket | string | OSS Bucket 名称 |
| dir | string | 允许写入的前缀（含 `/`），前端应在该前缀下生成文件名 |
| host | string | OSS 访问域名（用于 PUT / POST） |
| expireSeconds | number | 凭证剩余有效期（秒） |
| scene | string | 场景标识 |
| maxSize | number | 单文件最大字节数 |
| allowedTypes | string[] | 允许的 MIME 列表 |
| cdnHost | string | 可选：CDN 域名。返回的 URL 形如 `{cdnHost}/{key}` |

**错误响应**：
- 400：`scene` 非法 / `resumeId` 缺失或非本人所有
- 401：未登录
- 500：STS 服务调用失败（OSS 凭据未配置 / RAM 权限不足）

**安全约束**：
- 后端根据 `req.user.id` 拼装 dir 前缀，前端不可指定
- RAM 子账号的策略已限制到 `oss:PutObject` + 指定 prefix
- 同一用户 1 分钟内最多申请 10 次（防滥用）

---

## POST /api/uploads/sign-read

> 仅用于私有对象（如未审核通过的提交文件）的临时签名下载链接。

**请求体**：

```json
{
  "key": "submissions/3f0a.../abc.zip",
  "expiresIn": 600
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | string | 是 | OSS 对象 Key |
| expiresIn | number | 否 | 链接有效期（秒），默认 600，最大 3600 |

**成功响应** 200：

```json
{
  "url": "https://shaun-resume-prod.oss-cn-hangzhou.aliyuncs.com/submissions/3f0a.../abc.zip?Expires=...&Signature=...",
  "expiresAt": "2026-06-08T12:10:00Z"
}
```

**错误响应**：
- 401：未登录
- 403：非对象所有者 / 无权访问
- 404：对象不存在

---

## POST /api/uploads/delete

> 触发式清理（配合用户删除简历 / 头像动作），立即从 OSS 删除对象。仅删除当前用户有权限的 key。

**请求体**：

```json
{
  "keys": [
    "avatars/3f0a.../old-avatar.png",
    "resumes/3f0a.../abc/orphan.jpg"
  ]
}
```

**成功响应** 200：

```json
{
  "deleted": ["avatars/3f0a.../old-avatar.png"],
  "failed": [
    { "key": "resumes/3f0a.../abc/orphan.jpg", "reason": "NOT_FOUND" }
  ]
}
```

**错误响应**：
- 400：超过单次最大删除数量（默认 20）
- 401：未登录
- 403：试图删除他人目录下的对象

---

## 上传约束（按 scene）

| scene | dir 前缀 | maxSize | allowedTypes | 命名建议 |
|-------|----------|---------|--------------|----------|
| `avatar` | `avatars/{userId}/` | 5 MB | `image/jpeg`, `image/png`, `image/webp` | `{uuid}.{ext}` |
| `resume-image` | `resumes/{userId}/{resumeId}/avatar/` 或 `/images/` | 5 MB | `image/jpeg`, `image/png`, `image/webp` | `{uuid}.{ext}` |
| `submission` | `submissions/{userId}/` | 10 MB | `application/zip`, `text/html` | `{uuid}.{ext}` |

---

## 与现有 multipart 上传接口的兼容

| 旧接口 | 新接口（OSS 启用时） | 备注 |
|--------|----------------------|------|
| `POST /api/users/me/avatar` (multipart) | `POST /api/uploads/sts-token` + 直传 + `PATCH /api/users/me` | 旧接口保留；OSS 启用时返回 410 Gone，引导前端走新流程 |
| `POST /api/templates/submit` (multipart) | `POST /api/uploads/sts-token` + 直传 + `POST /api/templates/submit` (application/json) | 旧接口保留 |
| 静态文件 `GET /uploads/...` | `GET https://cdn.example.com/...` | 旧接口保留，仅服务历史数据 |
