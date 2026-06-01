import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
    return
  }

  if (err.name === 'ZodError') {
    res.status(400).json({
      status: 'error',
      message: '请求参数验证失败',
      errors: (err as unknown as { errors: unknown[] }).errors,
    })
    return
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'error',
      message: 'Token 无效',
    })
    return
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'error',
      message: 'Token 已过期',
    })
    return
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string; meta?: { target?: string[] } }
    if (prismaErr.code === 'P2002') {
      const target = prismaErr.meta?.target?.join(', ') ?? '字段'
      res.status(409).json({
        status: 'error',
        message: `${target} 已存在`,
      })
      return
    }
    if (prismaErr.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        message: '资源不存在',
      })
      return
    }
  }

  console.error('Unhandled error:', err)
  res.status(500).json({
    status: 'error',
    message: '服务器内部错误',
  })
}
