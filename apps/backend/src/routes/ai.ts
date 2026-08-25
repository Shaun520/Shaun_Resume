import { Router, type Request, type Response, type NextFunction } from 'express'
import { z } from 'zod'
import { optimizeText, isAiAvailable } from '../services/aiService.js'
import { authMiddleware } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()

/** POST /api/ai/optimize — AI 优化简历文字 */
const optimizeSchema = z.object({
  text: z.string().min(1, '请提供需要优化的文本').max(2000, '文本不超过 2000 字'),
  context: z.string().min(1).max(50).default('other'),
})

router.post('/optimize', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isAiAvailable()) {
      throw new AppError(503, 'AI 优化服务暂不可用，请稍后重试')
    }

    const parsed = optimizeSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '请求参数无效')
    }

    const result = await optimizeText(parsed.data)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

/** GET /api/ai/status — 检查 AI 服务可用性 */
router.get('/status', (_req: Request, res: Response) => {
  res.json({ available: isAiAvailable() })
})

export default router
