# 用户管理接口契约

**基础路径**：`/api/users`

所有接口需携带 `Authorization: Bearer <accessToken>` 请求头。

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
  "avatarUrl": "/uploads/avatars/xxx.jpg",
  "createdAt": "2026-06-01T00:00:00Z",
  "lastLoginAt": "2026-06-01T12:00:00Z"
}
```

**错误响应**：
- 401：未登录或 Token 已过期

---

## PATCH /api/users/me

更新当前用户信息

**请求体**：

```json
{
  "nickname": "李四",
  "avatarUrl": "/uploads/avatars/new.jpg"
}
```

**成功响应** 200：

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nickname": "李四",
  "role": "user",
  "avatarUrl": "/uploads/avatars/new.jpg",
  "createdAt": "2026-06-01T00:00:00Z",
  "lastLoginAt": "2026-06-01T12:00:00Z"
}
```

**错误响应**：
- 400：昵称长度不符
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

上传头像

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
