import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('邮箱格式无效').max(255, '邮箱最长 255 字符'),
  password: z
    .string()
    .min(8, '密码至少 8 个字符')
    .max(32, '密码最多 32 个字符')
    .regex(/[a-zA-Z]/, '密码需包含字母')
    .regex(/[0-9]/, '密码需包含数字'),
  nickname: z.string().min(2, '昵称至少 2 个字符').max(20, '昵称最多 20 个字符'),
})

export const loginSchema = z.object({
  email: z.string().email('邮箱格式无效'),
  password: z.string().min(1, '密码不能为空'),
})

export const updateUserSchema = z.object({
  nickname: z.string().min(2, '昵称至少 2 个字符').max(20, '昵称最多 20 个字符').optional(),
  avatarUrl: z.string().url('头像地址格式无效').optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '当前密码不能为空'),
  newPassword: z
    .string()
    .min(8, '新密码至少 8 个字符')
    .max(32, '新密码最多 32 个字符')
    .regex(/[a-zA-Z]/, '新密码需包含字母')
    .regex(/[0-9]/, '新密码需包含数字'),
})

export const createResumeSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(50, '标题最多 50 字符'),
  templateId: z.string().uuid('模板 ID 格式无效'),
})

export const updateResumeSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(50, '标题最多 50 字符').optional(),
  templateId: z.string().uuid('模板 ID 格式无效').optional(),
})

export const saveResumeContentSchema = z.object({
  basicInfo: z.record(z.unknown()).optional(),
  education: z.array(z.record(z.unknown())).optional(),
  workExperience: z.array(z.record(z.unknown())).optional(),
  projectExperience: z.array(z.record(z.unknown())).optional(),
  skills: z.array(z.record(z.unknown())).optional(),
})

export const submitTemplateSchema = z.object({
  name: z.string().min(2, '模板名称至少 2 个字符').max(30, '模板名称最多 30 字符'),
  description: z.string().min(1, '模板描述不能为空'),
  level: z.coerce.number().int().refine((v) => v === 2 || v === 3, {
    message: '模板级别必须为 2（插件包）或 3（HTML模板）',
  }),
  industryTags: z.string().optional(),
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type CreateResumeInput = z.infer<typeof createResumeSchema>
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>
export type SaveResumeContentInput = z.infer<typeof saveResumeContentSchema>
export type SubmitTemplateInput = z.infer<typeof submitTemplateSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
