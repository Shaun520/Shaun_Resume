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
