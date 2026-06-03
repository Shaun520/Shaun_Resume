import { Router, type Request, type Response, type NextFunction } from 'express'

import { getTemplateList, getTemplateDetail } from '../services/templateService.js'

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

/** GET /api/templates/:id — 获取模板详情（公开接口） */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = await getTemplateDetail(req.params.id)
    res.json(template)
  } catch (err) {
    next(err)
  }
})

export default router
