import { Router, type Request, type Response, type NextFunction } from 'express'

import {
  getTemplateList,
  getTemplateDetail,
  submitTemplate,
  getUserSubmissions,
  getSubmissionDetail,
} from '../services/templateService.js'
import { authMiddleware } from '../middleware/auth.js'
import { uploadSubmission } from '../middleware/upload.js'
import { AppError } from '../middleware/errorHandler.js'
import { submitTemplateSchema } from '../utils/validation.js'

const router = Router()

/** GET /api/templates — 获取模板列表（公开接口） */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params: { status?: string; level?: number; industry?: string } = {}
    if (req.query.status) params.status = String(req.query.status)
    if (req.query.level) params.level = Number(req.query.level)
    if (req.query.industry) params.industry = String(req.query.industry)

    const result = await getTemplateList(params)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/templates/submit — 用户提交模板
 *
 * 需登录，使用 multer fields() 处理 multipart/form-data：
 * - file: 模板文件（zip 或 html，10MB）
 * - thumbnail: 缩略图（jpg/png，2MB）
 * - 其他字段：name, description, level, industryTags
 *
 * Phase 7 暂行策略：提交后自动审核通过，立即返回 status=approved
 */
router.post(
  '/submit',
  authMiddleware,
  uploadSubmission,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 校验文本字段
      const parsed = submitTemplateSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0]?.message ?? '请求参数无效')
      }

      // multer fields() 将文件挂载在 req.files.<fieldname>[]
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
      const file = files?.file?.[0]
      const thumbnail = files?.thumbnail?.[0]

      if (!file) {
        throw new AppError(400, '请上传模板文件')
      }
      if (!thumbnail) {
        throw new AppError(400, '请上传缩略图')
      }

      const result = await submitTemplate({
        userId: req.user!.id,
        name: parsed.data.name,
        description: parsed.data.description,
        level: parsed.data.level as 2 | 3,
        industryTags: parsed.data.industryTags,
        file,
        thumbnail,
      })

      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  },
)

/** GET /api/templates/submissions — 获取当前用户的提交列表（需登录） */
router.get('/submissions', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statusParam = req.query.status as string | undefined
    const allowedStatuses = ['pending', 'approved', 'rejected'] as const
    type StatusType = (typeof allowedStatuses)[number]

    const status = allowedStatuses.find((s) => s === statusParam) as StatusType | undefined
    const result = await getUserSubmissions(req.user!.id, { status })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

/** GET /api/templates/submissions/:id — 获取单个提交详情（需登录） */
router.get('/submissions/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string
    const submission = await getSubmissionDetail(id, req.user!.id)
    res.json(submission)
  } catch (err) {
    next(err)
  }
})

/** GET /api/templates/:id — 获取模板详情（公开接口） */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string
    const template = await getTemplateDetail(id)
    res.json(template)
  } catch (err) {
    next(err)
  }
})

export default router
