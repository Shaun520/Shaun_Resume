import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { AppError } from '../middleware/errorHandler.js'

/** 用户提交文件存储根目录 */
const SUBMISSIONS_DIR = './uploads/submissions'

/** 允许的提交文件 MIME 类型 */
const ALLOWED_FILE_MIME_TYPES: Record<string, string> = {
  'application/zip': '.zip',
  'text/html': '.html',
}

/** 允许的缩略图 MIME 类型 */
const ALLOWED_THUMBNAIL_MIME_TYPES = ['image/jpeg', 'image/png']

/** 单文件最大 10MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024
/** 缩略图最大 2MB */
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024

/** 用户提交文件存储服务 */
export const templateStorageService = {
  /**
   * 保存用户提交的模板文件（zip 或 html）
   * @param file multer 上传的模板文件
   * @returns 公开访问的 URL 路径
   */
  async saveSubmissionFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new AppError(400, '请上传模板文件')
    }
    if (!ALLOWED_FILE_MIME_TYPES[file.mimetype]) {
      throw new AppError(400, `不支持的模板文件格式: ${file.mimetype}`)
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(400, '模板文件不能超过 10MB')
    }

    const ext = ALLOWED_FILE_MIME_TYPES[file.mimetype]
    const uniqueName = `${crypto.randomUUID()}${ext}`
    const targetDir = SUBMISSIONS_DIR
    const targetPath = path.join(targetDir, uniqueName)

    await fs.mkdir(targetDir, { recursive: true })
    await fs.rename(file.path, targetPath)

    return `/uploads/submissions/${uniqueName}`
  },

  /**
   * 保存用户提交的缩略图
   * @param file multer 上传的缩略图文件
   * @returns 公开访问的 URL 路径
   */
  async saveSubmissionThumbnail(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new AppError(400, '请上传缩略图')
    }
    if (!ALLOWED_THUMBNAIL_MIME_TYPES.includes(file.mimetype)) {
      throw new AppError(400, `不支持的缩略图格式: ${file.mimetype}`)
    }
    if (file.size > MAX_THUMBNAIL_SIZE) {
      throw new AppError(400, '缩略图不能超过 2MB')
    }

    const ext = path.extname(file.originalname) || '.png'
    const uniqueName = `thumb-${crypto.randomUUID()}${ext}`
    const targetDir = path.join(SUBMISSIONS_DIR, 'thumbnails')
    const targetPath = path.join(targetDir, uniqueName)

    await fs.mkdir(targetDir, { recursive: true })
    await fs.rename(file.path, targetPath)

    return `/uploads/submissions/thumbnails/${uniqueName}`
  },

  /**
   * 根据模板级别推断提交文件的预期格式
   */
  getExpectedFileType(level: number): 'zip' | 'html' | null {
    if (level === 2) return 'zip'
    if (level === 3) return 'html'
    return null
  },

  /**
   * 校验提交文件的 MIME 是否匹配指定的模板级别
   */
  validateFileTypeForLevel(mimetype: string, level: number): void {
    const expected = this.getExpectedFileType(level)
    if (!expected) {
      throw new AppError(400, `不支持的模板级别: ${level}`)
    }

    if (expected === 'zip' && mimetype !== 'application/zip') {
      throw new AppError(400, 'L2 插件包必须为 .zip 格式')
    }
    if (expected === 'html' && mimetype !== 'text/html') {
      throw new AppError(400, 'L3 HTML 模板必须为 .html 文件')
    }
  },
}
