import { Router, type Request, type Response, type NextFunction } from 'express'
import { registerSchema, loginSchema } from '../utils/validation.js'
import {
  register as registerService,
  login as loginService,
  refreshToken as refreshService,
  logout as logoutService,
} from '../services/authService.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()

/** POST /api/auth/register — 注册新用户 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '请求参数无效')
    }

    const result = await registerService(parsed.data)

    // Refresh Token 通过 HttpOnly Cookie 下发
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    })

    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    })
  } catch (err) {
    next(err)
  }
})

/** POST /api/auth/login — 用户登录 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '请求参数无效')
    }

    const result = await loginService(parsed.data)

    // Refresh Token 通过 HttpOnly Cookie 下发
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      user: result.user,
      accessToken: result.accessToken,
    })
  } catch (err) {
    next(err)
  }
})

/** POST /api/auth/refresh — 刷新 Access Token */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) {
      throw new AppError(401, 'Refresh Token 缺失，请重新登录')
    }

    const tokens = await refreshService(token)

    // 更新 Refresh Token Cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      accessToken: tokens.accessToken,
    })
  } catch (err) {
    next(err)
  }
})

/** POST /api/auth/logout — 用户登出 */
router.post('/logout', (_req: Request, res: Response) => {
  const result = logoutService()
  res.clearCookie('refreshToken', { path: '/api/auth' })
  res.json(result)
})

export default router
