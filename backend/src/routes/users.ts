import { Router, type Request, type Response, type NextFunction } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { updateUserSchema, changePasswordSchema } from '../utils/validation.js'
import { uploadAvatar } from '../middleware/upload.js'
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../services/userService.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()

// 所有用户路由需要认证
router.use(authMiddleware)

/** GET /api/users/me — 获取当前用户信息 */
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserProfile(req.user!.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

/** PATCH /api/users/me — 更新用户信息（昵称、头像 URL） */
router.patch('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateUserSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '请求参数无效')
    }

    // 至少提供一个字段
    if (parsed.data.nickname === undefined && parsed.data.avatarUrl === undefined) {
      throw new AppError(400, '至少提供昵称或头像地址之一')
    }

    const user = await updateUserProfile(req.user!.id, parsed.data)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

/** PATCH /api/users/me/password — 修改密码 */
router.patch('/me/password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '请求参数无效')
    }

    const result = await changePassword(req.user!.id, parsed.data)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

/** POST /api/users/me/avatar — 上传头像 */
router.post(
  '/me/avatar',
  uploadAvatar.single('avatar'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError(400, '请上传头像文件')
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`
      const user = await updateUserProfile(req.user!.id, { avatarUrl })
      res.json(user)
    } catch (err) {
      next(err)
    }
  },
)

export default router
