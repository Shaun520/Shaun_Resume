# 用户管理接口契约

**基础路径**：`/api/users`

所有接口需携带 `Authorization: Bearer <accessToken>` 请求头。

> 头像上传从本地落盘迁移到 OSS 直传，详见 [uploads.md](./uploads.md)。本节仅说明头像相关的业务接口行为；新增 STS Token 申请接口见 [uploads.md §POST /api/uploads/sts-token](./uploads.md#post-apiuploadssts-token)。

---

## GET /api/users/me

获取当前用户信息

**成功响应** 200：

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nickname": "张三",
  "role": "user",
  "avatarUrl": "https://cdn.example.com/avatars/3f0a.../uuid.jpg",
  "createdAt": "2026-06-01T00:00:00Z",
  "lastLoginAt": "2026-06-01T12:00:00Z"
}
```

> `avatarUrl` 可能为 OSS 公开 URL（新数据）或 `/uploads/avatars/...` 本地路径（历史数据）。前端按原值渲染即可。

**错误响应**：
- 401：未登录或 Token 已过期

---

## PATCH /api/users/me

更新当前用户信息

**请求体**：

```json
{
  "nickname": "李四",
  "avatarUrl": "https://cdn.example.com/avatars/3f0a.../new-uuid.jpg"
}
```

> 头像 URL 需为合法 HTTPS（OSS 公开 URL）或本站 `/uploads/avatars/...` 路径；不接受任意外部 URL（防 SSRF / 跨域追踪）。

**成功响应** 200：

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nickname": "李四",
  "role": "user",
  "avatarUrl": "https://cdn.example.com/avatars/3f0a.../new-uuid.jpg",
  "createdAt": "2026-06-01T00:00:00Z",
  "lastLoginAt": "2026-06-01T12:00:00Z"
}
```

**错误响应**：
- 400：昵称长度不符 / 头像 URL 非法
- 401：未登录

---

## PATCH /api/users/me/password

修改密码

**请求体**：

```json
{
  "currentPassword": "OldPass1234",
  "newPassword": "NewPass5678"
}
```

**成功响应** 200：

```json
{
  "message": "密码修改成功"
}
```

**错误响应**：
- 400：新密码强度不足
- 401：当前密码错误

---

## POST /api/users/me/avatar

> 兼容旧版（OSS 未启用时使用）。`OSS_ENABLED=true` 时此接口返回 `410 Gone`，前端应改走 [uploads.md §STS Token + 直传](./uploads.md#post-apiuploadssts-token) 流程。

**请求**：`multipart/form-data`，字段名 `avatar`

**约束**：
- 文件大小 ≤ 5MB
- 支持格式：JPG、PNG

**成功响应** 200：

```json
{
  "avatarUrl": "/uploads/avatars/uuid-timestamp.jpg"
}
```

**错误响应**：
- 400：文件格式不支持 / 文件过大
- 401：未登录
- 410：OSS 已启用，请走新流程
