# 认证接口契约

**基础路径**：`/api/auth`

---

## POST /api/auth/register

注册新用户

**请求体**：

```json
{
  "email": "user@example.com",
  "password": "Pass1234",
  "nickname": "张三"
}
```

**成功响应** 201：

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "nickname": "张三",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**错误响应**：
- 400：邮箱格式无效 / 密码强度不足 / 昵称长度不符
- 409：邮箱已被注册

---

## POST /api/auth/login

用户登录

**请求体**：

```json
{
  "email": "user@example.com",
  "password": "Pass1234"
}
```

**成功响应** 200：

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "nickname": "张三",
    "role": "user",
    "avatarUrl": "/uploads/avatars/xxx.jpg"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

Refresh Token 同时通过 `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=604800` 下发。

**错误响应**：
- 401：邮箱或密码错误
- 400：请求参数缺失

---

## POST /api/auth/refresh

刷新 Access Token

**请求**：Refresh Token 从 HttpOnly Cookie 中读取

**成功响应** 200：

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**错误响应**：
- 401：Refresh Token 无效或已过期，需重新登录

---

## POST /api/auth/logout

用户登出

**请求头**：`Authorization: Bearer <accessToken>`

**成功响应** 200：

```json
{
  "message": "登出成功"
}
```

服务端使当前 Refresh Token 失效，清除 Cookie。
