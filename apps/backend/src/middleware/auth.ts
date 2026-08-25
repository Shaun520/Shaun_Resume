import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import { AppError } from './errorHandler.js'

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError(401, '未登录或 Token 缺失'))
    return
  }

  const token = authHeader.split(' ')[1] ?? ''

  try {
    const decoded = verifyAccessToken(token)
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
    next()
  } catch {
    next(new AppError(401, 'Token 无效或已过期'))
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next()
    return
  }

  const token = authHeader.split(' ')[1] ?? ''

  try {
    const decoded = verifyAccessToken(token)
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
  } catch {
    // Token 无效时继续，不附加用户信息
  }

  next()
}
