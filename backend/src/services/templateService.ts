import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.js'

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
