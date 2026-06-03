import { Router, type Request, type Response, type NextFunction } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  createResumeSchema,
  updateResumeSchema,
  saveResumeContentSchema,
  paginationSchema,
} from '../utils/validation.js'
import {
  createResume,
  getResumeList,
  getResumeDetail,
  saveResumeContent,
  updateResumeMeta,
  deleteResume,
} from '../services/resumeService.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()

router.use(authMiddleware)

/** GET /api/resumes — 获取简历列表 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = paginationSchema.safeParse(req.query)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '分页参数无效')
    }

    const result = await getResumeList(req.user!.id, parsed.data)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

/** POST /api/resumes — 创建新简历 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createResumeSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '请求参数无效')
    }

    const resume = await createResume(req.user!.id, parsed.data)
    res.status(201).json(resume)
  } catch (err) {
    next(err)
  }
})

/** GET /api/resumes/:id — 获取简历详情 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string
    const resume = await getResumeDetail(id, req.user!.id)
    res.json(resume)
  } catch (err) {
    next(err)
  }
})

/** PUT /api/resumes/:id/content — 保存简历内容 */
router.put('/:id/content', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = saveResumeContentSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '内容格式无效')
    }
    const id = req.params.id as string
    const result = await saveResumeContent(id, req.user!.id, parsed.data)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

/** PATCH /api/resumes/:id — 更新简历元信息 */
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateResumeSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '请求参数无效')
    }

    if (parsed.data.title === undefined && parsed.data.templateId === undefined) {
      throw new AppError(400, '至少提供标题或模板 ID')
    }

    const id = req.params.id as string
    const result = await updateResumeMeta(id, req.user!.id, parsed.data)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

/** DELETE /api/resumes/:id — 删除简历 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string
    const result = await deleteResume(id, req.user!.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router
