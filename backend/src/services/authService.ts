import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { signTokenPair, verifyRefreshToken } from '../utils/jwt.js'
import { AppError } from '../middleware/errorHandler.js'
import type { RegisterInput, LoginInput } from '../utils/validation.js'

const prisma = new PrismaClient()

const SALT_ROUNDS = 10

/** 注册新用户：验证邮箱唯一性 → 哈希密码 → 创建用户 → 签发 Token 对 */
export async function register(data: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    throw new AppError(409, '邮箱已被注册')
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      nickname: data.nickname,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      avatarUrl: true,
    },
  })

  const tokens = signTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return { user, ...tokens }
}

/** 登录：验证邮箱密码 → 签发 Token 对 → 更新最后登录时间 */
export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user) {
    throw new AppError(401, '邮箱或密码错误')
  }

  const valid = await bcrypt.compare(data.password, user.passwordHash)
  if (!valid) {
    throw new AppError(401, '邮箱或密码错误')
  }

  const tokens = signTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  // Token 签发成功后再更新最后登录时间，避免签发失败时产生脏数据
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
    ...tokens,
  }
}

/** 刷新 Access Token：从 Cookie 读取 Refresh Token → 验证 → 签发新 Token 对 */
export async function refreshToken(token: string) {
  let decoded: { userId: string; email: string; role: string }
  try {
    decoded = verifyRefreshToken(token)
  } catch {
    throw new AppError(401, 'Refresh Token 无效或已过期，请重新登录')
  }

  const tokens = signTokenPair({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  })

  return tokens
}

/** 登出：前端清除本地 Token，服务端使 Refresh Token 失效（通过清除 Cookie） */
export function logout(): { message: string } {
  return { message: '登出成功' }
}
