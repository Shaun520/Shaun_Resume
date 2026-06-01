# 简历管理接口契约

**基础路径**：`/api/resumes`

所有接口需携带 `Authorization: Bearer <accessToken>` 请求头。

---

## GET /api/resumes

获取当前用户的简历列表

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 10 |

**成功响应** 200：

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "前端工程师简历",
      "templateId": "uuid",
      "templateName": "经典模板",
      "thumbnailUrl": "/uploads/thumbnails/xxx.jpg",
      "createdAt": "2026-06-01T00:00:00Z",
      "updatedAt": "2026-06-01T12:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 10
}
```

---

## POST /api/resumes

创建新简历

**请求体**：

```json
{
  "title": "前端工程师简历",
  "templateId": "uuid"
}
```

**成功响应** 201：

```json
{
  "id": "uuid",
  "title": "前端工程师简历",
  "templateId": "uuid",
  "createdAt": "2026-06-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z",
  "content": {
    "basicInfo": {},
    "education": [],
    "workExperience": [],
    "projectExperience": [],
    "skills": []
  }
}
```

**错误响应**：
- 400：标题长度不符 / 模板 ID 无效
- 401：未登录

---

## GET /api/resumes/:id

获取简历详情（含内容）

**成功响应** 200：

```json
{
  "id": "uuid",
  "title": "前端工程师简历",
  "templateId": "uuid",
  "templateName": "经典模板",
  "createdAt": "2026-06-01T00:00:00Z",
  "updatedAt": "2026-06-01T12:00:00Z",
  "content": {
    "basicInfo": {
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "address": "北京市",
      "summary": "5年前端开发经验",
      "avatarUrl": "/uploads/avatars/xxx.jpg"
    },
    "education": [
      {
        "school": "北京大学",
        "major": "计算机科学",
        "degree": "本科",
        "startDate": "2015-09",
        "endDate": "2019-06"
      }
    ],
    "workExperience": [
      {
        "company": "某科技公司",
        "position": "前端工程师",
        "startDate": "2019-07",
        "endDate": "2024-01",
        "description": "负责公司核心产品的前端开发"
      }
    ],
    "projectExperience": [],
    "skills": [
      { "name": "React", "proficiency": "精通" },
      { "name": "TypeScript", "proficiency": "精通" }
    ]
  }
}
```

**错误响应**：
- 401：未登录
- 403：无权访问该简历
- 404：简历不存在

---

## PUT /api/resumes/:id/content

保存简历内容（自动保存 / 手动保存均调用此接口）

**请求体**：

```json
{
  "basicInfo": { "...": "..." },
  "education": [ "..." ],
  "workExperience": [ "..." ],
  "projectExperience": [ "..." ],
  "skills": [ "..." ]
}
```

**成功响应** 200：

```json
{
  "updatedAt": "2026-06-01T12:00:00Z"
}
```

**错误响应**：
- 400：内容格式无效
- 401：未登录
- 403：无权编辑该简历
- 404：简历不存在

---

## PATCH /api/resumes/:id

更新简历元信息（标题、模板）

**请求体**：

```json
{
  "title": "新标题",
  "templateId": "uuid"
}
```

**成功响应** 200：

```json
{
  "id": "uuid",
  "title": "新标题",
  "templateId": "uuid",
  "updatedAt": "2026-06-01T12:00:00Z"
}
```

**错误响应**：
- 400：标题长度不符 / 模板 ID 无效
- 401：未登录
- 403：无权编辑该简历
- 404：简历不存在

---

## DELETE /api/resumes/:id

删除简历

**成功响应** 200：

```json
{
  "message": "简历已删除"
}
```

**错误响应**：
- 401：未登录
- 403：无权删除该简历
- 404：简历不存在
