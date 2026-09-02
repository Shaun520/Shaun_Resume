import { PrismaClient, Prisma } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.js'
import type { CreateResumeInput, UpdateResumeInput, SaveResumeContentInput, PaginationInput } from '../utils/validation.js'

const prisma = new PrismaClient()

/** 校验简历所有权，不存在返回 404，无权返回 403 */
async function ensureResumeOwnership(resumeId: string, userId: string, errorType: 'edit' | 'delete' = 'edit') {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    select: { id: true },
  })
  if (!resume) {
    // 先检查简历是否存在
    const exists = await prisma.resume.findUnique({ where: { id: resumeId }, select: { id: true } })
    if (!exists) throw new AppError(404, '简历不存在')
    throw new AppError(403, `无权${errorType === 'delete' ? '删除' : '编辑'}该简历`)
  }
  return resume
}

/** 创建新简历 */
export async function createResume(userId: string, data: CreateResumeInput) {
  // 验证模板是否存在
  const template = await prisma.template.findUnique({ where: { id: data.templateId } })
  if (!template) {
    throw new AppError(400, '模板 ID 无效')
  }

  const resume = await prisma.resume.create({
    data: {
      userId,
      title: data.title,
      templateId: data.templateId,
      content: {
        create: {},
      },
    },
    include: { content: true, template: { select: { name: true, schemaKey: true } } },
  })

  return formatResume(resume)
}

/** 获取简历列表 */
export async function getResumeList(userId: string, params: PaginationInput) {
  const where = { userId }
  const [items, total] = await Promise.all([
    prisma.resume.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      select: {
        id: true,
        title: true,
        templateId: true,
        createdAt: true,
        updatedAt: true,
        template: { select: { name: true, schemaKey: true } },
      },
    }),
    prisma.resume.count({ where }),
  ])

  return {
    items: items.map((r) => ({
      ...r,
      templateName: r.template.name,
    })),
    total,
    page: params.page,
    pageSize: params.pageSize,
  }
}

/** 获取简历详情（含内容） */
export async function getResumeDetail(resumeId: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    include: {
      content: true,
      template: { select: { name: true, schemaKey: true } },
    },
  })

  if (!resume) {
    throw new AppError(404, '简历不存在')
  }

  return formatResume(resume)
}

/** 保存简历内容 */
export async function saveResumeContent(resumeId: string, userId: string, data: SaveResumeContentInput) {
  await ensureResumeOwnership(resumeId, userId)

  const updated = await prisma.resumeContent.upsert({
    where: { resumeId },
    create: {
      resumeId,
      basicInfo: (data.basicInfo ?? {}) as Prisma.JsonObject,
      education: (data.education ?? []) as Prisma.JsonArray,
      workExperience: (data.workExperience ?? []) as Prisma.JsonArray,
      projectExperience: (data.projectExperience ?? []) as Prisma.JsonArray,
      skills: (data.skills ?? []) as Prisma.JsonArray,
      orgExperience: (data.orgExperience ?? []) as Prisma.JsonArray,
      honors: (data.honors ?? []) as Prisma.JsonArray,
    },
    update: {
      ...(data.basicInfo !== undefined && { basicInfo: data.basicInfo as Prisma.JsonObject }),
      ...(data.education !== undefined && { education: data.education as Prisma.JsonArray }),
      ...(data.workExperience !== undefined && { workExperience: data.workExperience as Prisma.JsonArray }),
      ...(data.projectExperience !== undefined && { projectExperience: data.projectExperience as Prisma.JsonArray }),
      ...(data.skills !== undefined && { skills: data.skills as Prisma.JsonArray }),
      ...(data.orgExperience !== undefined && { orgExperience: data.orgExperience as Prisma.JsonArray }),
      ...(data.honors !== undefined && { honors: data.honors as Prisma.JsonArray }),
    },
  })

  return { updatedAt: updated.updatedAt }
}

/** 更新简历元信息（标题、模板） */
export async function updateResumeMeta(resumeId: string, userId: string, data: UpdateResumeInput) {
  await ensureResumeOwnership(resumeId, userId)

  if (data.templateId) {
    const template = await prisma.template.findUnique({ where: { id: data.templateId } })
    if (!template) {
      throw new AppError(400, '模板 ID 无效')
    }
  }

  const resume = await prisma.resume.update({
    where: { id: resumeId },
    data,
    include: { template: { select: { name: true } } },
  })

  return {
    id: resume.id,
    title: resume.title,
    templateId: resume.templateId,
    updatedAt: resume.updatedAt,
  }
}

/** 删除简历 */
export async function deleteResume(resumeId: string, userId: string) {
  await ensureResumeOwnership(resumeId, userId, 'delete')

  await prisma.resume.delete({ where: { id: resumeId } })
  return { message: '简历已删除' }
}

/**
 * 简历内容字段 → 模板 section 的映射表
 * 用于识别目标模板不支持的字段（在迁移时标记为保留）
 */
const CONTENT_FIELD_TO_SECTION: Record<string, string> = {
  basicInfo: 'header',
  summary: 'summary',
  workExperience: 'experience',
  education: 'education',
  projectExperience: 'projects',
  skills: 'skills',
  orgExperience: 'orgExperience',
  honors: 'honors',
}

/**
 * 简历迁移：将简历切换到新的目标模板
 *
 * 流程：
 * 1. 校验简历所有权
 * 2. 校验目标模板存在且处于 active 状态
 * 3. 比对源模板与目标模板的 schemaKey，判断哪些 section 缺失
 * 4. 缺失 section 对应的字段保留在 content 中（数据不丢失，切换回原模板仍可用）
 * 5. 更新简历的 templateId，返回迁移结果
 */
export async function migrateResume(
  resumeId: string,
  userId: string,
  targetTemplateId: string,
) {
  // 校验简历所有权
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    include: {
      template: { select: { id: true, name: true, schemaKey: true } },
    },
  })

  if (!resume) {
    const exists = await prisma.resume.findUnique({ where: { id: resumeId }, select: { id: true } })
    if (!exists) throw new AppError(404, '简历不存在')
    throw new AppError(403, '无权迁移该简历')
  }

  // 校验目标模板
  const target = await prisma.template.findUnique({
    where: { id: targetTemplateId },
    select: { id: true, name: true, schemaKey: true, level: true, status: true },
  })
  if (!target) {
    throw new AppError(400, '目标模板不存在')
  }
  if (target.status !== 'active') {
    throw new AppError(400, '目标模板已下架，无法迁移')
  }
  if (resume.templateId === targetTemplateId) {
    throw new AppError(400, '目标模板与当前模板相同，无需迁移')
  }

  // 已知 L1 内置 schema 的 section 列表（用于字段保留判断）
  // 用户上传的 L2/L3 模板 section 列表由前端在请求时传入（extensions 字段）
  const knownSchemaSections: Record<string, string[]> = {
    classic: ['header', 'summary', 'experience', 'education', 'projects', 'skills', 'orgExperience', 'honors'],
    modern: ['header', 'summary', 'experience', 'education', 'projects', 'skills', 'orgExperience', 'honors'],
    minimal: ['header', 'summary', 'experience', 'education', 'projects', 'skills', 'orgExperience', 'honors'],
    'vehicle-rnd': ['header', 'summary', 'experience', 'projects', 'orgExperience', 'honors', 'skills'],
    'brand-comm': ['header', 'summary', 'experience', 'education', 'orgExperience', 'honors', 'skills'],
    'med-device': ['header', 'summary', 'experience', 'education', 'orgExperience', 'honors', 'skills'],
  }
  const targetSections = knownSchemaSections[target.schemaKey] ?? []
  const sourceSections = knownSchemaSections[resume.template.schemaKey] ?? []

  // 识别目标模板不支持的 section 对应的字段（保留在 content 中，不丢失）
  const preservedFields: string[] = []
  if (targetSections.length > 0) {
    for (const [field, section] of Object.entries(CONTENT_FIELD_TO_SECTION)) {
      if (!targetSections.includes(section) && sourceSections.includes(section)) {
        preservedFields.push(field)
      }
    }
  }

  // 更新简历的 templateId
  const updated = await prisma.resume.update({
    where: { id: resumeId },
    data: { templateId: targetTemplateId },
    include: { content: true, template: { select: { name: true, schemaKey: true } } },
  })

  return {
    resume: formatResume(updated),
    migration: {
      from: { id: resume.template.id, name: resume.template.name, schemaKey: resume.template.schemaKey },
      to: { id: target.id, name: target.name, schemaKey: target.schemaKey, level: target.level },
      preservedFields, // 目标模板不支持的字段，保留在 content 中（未删除，切换回原模板可恢复）
      migratedAt: new Date().toISOString(),
    },
  }
}

/** 格式化简历数据为 API 响应格式 */
function formatResume(resume: {
  id: string
  title: string
  templateId: string
  createdAt: Date
  updatedAt: Date
  content?: { basicInfo: unknown; education: unknown; workExperience: unknown; projectExperience: unknown; skills: unknown; orgExperience: unknown; honors: unknown } | null
  template?: { name: string; schemaKey: string } | null
}) {
  return {
    id: resume.id,
    title: resume.title,
    templateId: resume.templateId,
    templateName: resume.template?.name,
    schemaKey: resume.template?.schemaKey,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
    content: resume.content
      ? {
          basicInfo: resume.content.basicInfo as Record<string, unknown>,
          education: resume.content.education as Record<string, unknown>[],
          workExperience: resume.content.workExperience as Record<string, unknown>[],
          projectExperience: resume.content.projectExperience as Record<string, unknown>[],
          skills: resume.content.skills as Record<string, unknown>[],
          orgExperience: resume.content.orgExperience as Record<string, unknown>[],
          honors: resume.content.honors as Record<string, unknown>[],
        }
      : undefined,
  }
}
