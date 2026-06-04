import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { AppError } from './errorHandler.js'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
const MAX_AVATAR_SIZE = 5 * 1024 * 1024
const MAX_TEMPLATE_SIZE = 10 * 1024 * 1024

function createStorage(dest: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, dest)
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      const uniqueName = `${crypto.randomUUID()}-${Date.now()}${ext}`
      cb(null, uniqueName)
    },
  })
}

function fileFilter(allowedTypes: string[]) {
  return (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new AppError(400, `不支持的文件格式: ${file.mimetype}`))
    }
  }
}

export const uploadAvatar = multer({
  storage: createStorage('./uploads/avatars'),
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
  limits: { fileSize: MAX_AVATAR_SIZE },
})

export const uploadTemplate = multer({
  storage: createStorage('./uploads/templates'),
  fileFilter: fileFilter([...ALLOWED_IMAGE_TYPES, 'application/zip']),
  limits: { fileSize: MAX_TEMPLATE_SIZE },
})

export const uploadThumbnail = multer({
  storage: createStorage('./uploads/thumbnails'),
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
  limits: { fileSize: MAX_AVATAR_SIZE },
})

/** 用户提交模板文件：zip 或 html，10MB */
export const uploadSubmissionFile = multer({
  storage: createStorage('./uploads/submissions'),
  fileFilter: fileFilter(['application/zip', 'text/html']),
  limits: { fileSize: MAX_TEMPLATE_SIZE },
})

/** 用户提交缩略图：jpg/png，2MB */
export const uploadSubmissionThumbnail = multer({
  storage: createStorage('./uploads/submissions/thumbnails'),
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
  limits: { fileSize: 2 * 1024 * 1024 },
})

/**
 * 用户提交模板：使用 fields() 同时接收 file 与 thumbnail 两个文件字段。
 * - file: zip 或 html，10MB
 * - thumbnail: jpg/png，2MB
 */
export const uploadSubmission = multer({
  storage: multer.diskStorage({
    destination: (_req, file, cb) => {
      if (file.fieldname === 'thumbnail') {
        cb(null, './uploads/submissions/thumbnails')
      } else {
        cb(null, './uploads/submissions')
      }
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      const uniqueName = `${crypto.randomUUID()}-${Date.now()}${ext}`
      cb(null, uniqueName)
    },
  }),
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
