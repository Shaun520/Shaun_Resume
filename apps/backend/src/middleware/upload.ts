import multer from 'multer'
import { AppError } from './errorHandler.js'

export type UploadScene = 'avatar' | 'resume-image' | 'submission'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
const MAX_TEMPLATE_SIZE = 10 * 1024 * 1024

/** 通用单文件上传（内存存储），用于 POST /api/uploads 后端代理上传 */
export const uploadSingleFile = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb: multer.FileFilterCallback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/zip', 'text/html']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new AppError(400, `不支持的文件格式: ${file.mimetype}`))
    }
  },
  limits: { fileSize: MAX_TEMPLATE_SIZE },
}).single('file')

/**
 * 用户提交模板：使用 fields() 同时接收 file 与 thumbnail 两个文件字段。
 * - file: zip 或 html，10MB
 * - thumbnail: jpg/png，2MB
 * 内存存储，后续由 templateStorageService 推送到 GitHub。
 */
export const uploadSubmission = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb: multer.FileFilterCallback) => {
    if (file.fieldname === 'thumbnail') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        return cb(new AppError(400, `不支持的缩略图格式: ${file.mimetype}`))
      }
      return cb(null, true)
    }
    if (file.fieldname === 'file') {
      if (!['application/zip', 'text/html'].includes(file.mimetype)) {
        return cb(new AppError(400, `不支持的模板文件格式: ${file.mimetype}`))
      }
      return cb(null, true)
    }
    return cb(new AppError(400, `未知文件字段: ${file.fieldname}`))
  },
  limits: { fileSize: MAX_TEMPLATE_SIZE },
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
])