import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { AppError } from '../middleware/errorHandler.js'
import { templateStorageService } from './templateStorageService.js'

const prisma = new PrismaClient()

/** 获取模板列表（公开接口，无需登录） */
export async function getTemplateList(params?: { status?: string; level?: number; industry?: string }) {
  const where: Record<string, unknown> = {}
  if (params?.status) where.status = params.status
  else where.status = 'active' // 默认只返回激活模板
  if (params?.level) where.level = params.level
  if (params?.industry) {
    // 逗号分隔标签精确匹配：覆盖首部、中间、尾部三种位置
    where.OR = [
      { industryTags: { startsWith: `${params.industry},` } },
      { industryTags: { endsWith: `,${params.industry}` } },
      { industryTags: { contains: `,${params.industry},` } },
      { industryTags: { equals: params.industry } },
    ]
  }

  const templates = await prisma.template.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      description: true,
      thumbnailUrl: true,
      schemaKey: true,
      level: true,
      industryTags: true,
      createdAt: true,
    },
  })

  return { items: templates }
}

/** 获取模板详情（公开接口） */
export async function getTemplateDetail(templateId: string) {
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    select: {
      id: true,
      name: true,
      description: true,
      thumbnailUrl: true,
      schemaKey: true,
      level: true,
      industryTags: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!template) {
    throw new AppError(404, '模板不存在')
  }

  return template
}

/** 提交参数 */
export interface SubmitTemplateParams {
  userId: string
  name: string
  description: string
  level: 2 | 3
  industryTags?: string
  file: Express.Multer.File
  thumbnail: Express.Multer.File
}

/** 提交结果 */
export interface SubmitTemplateResult {
  id: string
  name: string
  status: 'approved' | 'pending' | 'rejected'
  submittedAt: Date
  reviewedAt: Date | null
  templateId: string
}

/**
 * 提交模板（Phase 7 暂行策略：自动审核通过 + 立即创建 Template 记录）
 *
 * 流程：
 * 1. 校验模板级别与文件 MIME 一致性
 * 2. 存储模板文件和缩略图
 * 3. 在事务中创建 TemplateSubmission（status=approved, reviewedAt=now）
 *    和 Template（status=active），使模板立即对所有用户可见
 * 4. 返回提交记录
 */
export async function submitTemplate(params: SubmitTemplateParams): Promise<SubmitTemplateResult> {
  const { userId, name, description, level, industryTags, file, thumbnail } = params

  // 校验文件 MIME 与级别匹配
  templateStorageService.validateFileTypeForLevel(file.mimetype, level)

  // 存储文件
  const fileUrl = await templateStorageService.saveSubmissionFile(file)
  const thumbnailUrl = await templateStorageService.saveSubmissionThumbnail(thumbnail)

  // 生成用户模板的 schemaKey（避免与内置 schemaKey 冲突）
  const userSchemaKey = `user-${crypto.randomUUID()}`
  const now = new Date()

  // 事务：同时创建 TemplateSubmission 与 Template
  const result = await prisma.$transaction(async (tx) => {
    const submission = await tx.templateSubmission.create({
      data: {
        userId,
        name,
        description,
        fileUrl,
        thumbnailUrl,
        industryTags: industryTags ?? null,
        // Phase 7 暂行策略：直接置为 approved，reviewedAt 默认为提交时间
        status: 'approved',
        submittedAt: now,
        reviewedAt: now,
      },
      select: {
        id: true,
        name: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
      },
    })

    const template = await tx.template.create({
      data: {
        name,
        description,
        thumbnailUrl,
        schemaKey: userSchemaKey,
        level,
        industryTags: industryTags ?? null,
        status: 'active',
      },
      select: { id: true },
    })

    return { submission, templateId: template.id }
  })

  return {
    id: result.submission.id,
    name: result.submission.name,
    status: result.submission.status as 'approved' | 'pending' | 'rejected',
    submittedAt: result.submission.submittedAt,
    reviewedAt: result.submission.reviewedAt,
    templateId: result.templateId,
  }
}

/** 获取当前用户的模板提交列表 */
export async function getUserSubmissions(
  userId: string,
  params: { status?: 'pending' | 'approved' | 'rejected' },
) {
  const where: Record<string, unknown> = { userId }
  if (params.status) where.status = params.status

  const items = await prisma.templateSubmission.findMany({
    where,
    orderBy: { submittedAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      fileUrl: true,
      thumbnailUrl: true,
      industryTags: true,
      status: true,
      submittedAt: true,
      reviewedAt: true,
    },
  })

  return { items }
}

/** 获取单个提交详情 */
export async function getSubmissionDetail(submissionId: string, userId: string) {
  const submission = await prisma.templateSubmission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      userId: true,
      name: true,
      description: true,
      fileUrl: true,
      thumbnailUrl: true,
      industryTags: true,
      status: true,
      submittedAt: true,
      reviewedAt: true,
    },
  })

  if (!submission) {
    throw new AppError(404, '提交记录不存在')
  }
  if (submission.userId !== userId) {
    throw new AppError(403, '无权查看该提交')
  }

  // 移除 userId 字段，仅返回用户所需数据
  const { userId: _omit, ...rest } = submission
  return rest
}
