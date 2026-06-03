import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.js'
import type { UpdateUserInput, ChangePasswordInput } from '../utils/validation.js'

const prisma = new PrismaClient()

/** 获取当前用户信息 */
export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      lastLoginAt: true,
    },
  })

  if (!user) {
    throw new AppError(404, '用户不存在')
  }

  return user
}

/** 更新用户信息（昵称、头像地址） */
export async function updateUserProfile(userId: string, data: UpdateUserInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      lastLoginAt: true,
    },
  })

  return user
}

/** 修改密码 */
export async function changePassword(
  userId: string,
  data: ChangePasswordInput,
) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } })
  if (!user) {
    throw new AppError(404, '用户不存在')
  }

  const valid = await bcrypt.compare(data.currentPassword, user.passwordHash)
  if (!valid) {
    throw new AppError(401, '当前密码错误')
  }

  const newPasswordHash = await bcrypt.hash(data.newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  })

  return { message: '密码修改成功' }
}
