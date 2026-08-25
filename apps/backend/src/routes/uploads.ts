/**
 * 上传路由
 * POST /api/uploads — 后端代理上传文件到 GitHub 仓库，返回 raw URL
 * POST /api/uploads/delete — 触发式清理（删除 GitHub 仓库中的文件）
 */
import { Router, type Request, type Response, type NextFunction } from 'express'
import { z } from 'zod'
import path from 'path'
import crypto from 'crypto'
import { authMiddleware } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'
import { uploadSingleFile } from '../middleware/upload.js'
import { getFileStorageProvider } from '../services/githubProvider.js'
import { githubConfig } from '../config/github.js'
import type { UploadScene } from '../middleware/upload.js'

const router = Router()

router.use(authMiddleware)

/** 各场景的路径前缀、大小与类型限制 */
const SCENE_CONFIGS: Record<
  UploadScene,
  { dirPrefix: string; maxSize: number; allowedTypes: string[]; needResumeId: boolean }
> = {
  avatar: {
    dirPrefix: 'avatars',
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    needResumeId: false,
  },
  'resume-image': {
    dirPrefix: 'resumes',
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    needResumeId: true,
  },
  submission: {
    dirPrefix: 'submissions',
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['application/zip', 'text/html'],
    needResumeId: false,
  },
}

function extFromMime(mime: string, fallbackExt: string | undefined): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/zip': '.zip',
    'text/html': '.html',
  }
  return map[mime] || path.extname(fallbackExt ?? '') || '.bin'
}

function buildKey(
  scene: UploadScene,
  userId: string,
  file: Express.Multer.File,
  resumeId?: string,
): string {
  const cfg = SCENE_CONFIGS[scene]
  const uuid = crypto.randomUUID()
  const ext = extFromMime(file.mimetype, file.originalname)

  if (scene === 'resume-image') {
    return `${cfg.dirPrefix}/${userId}/${resumeId}/avatar/${uuid}${ext}`
  }
  return `${cfg.dirPrefix}/${userId}/${uuid}${ext}`
}

const deleteSchema = z.object({
  keys: z.array(z.string()).min(1, '至少提供一个 key').max(20, '单次最多删除 20 个对象'),
})

/** POST /api/uploads — 上传单文件（multipart/form-data，字段 file + scene + resumeId?） */
router.post(
  '/',
  uploadSingleFile,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!githubConfig.enabled) {
        throw new AppError(503, 'GitHub 存储未启用，请配置 GITHUB_* 环境变量')
      }

      const file = req.file
      if (!file) {
        throw new AppError(400, '请上传文件')
      }

      const scene = req.body.scene as UploadScene | undefined
      if (!scene || !(scene in SCENE_CONFIGS)) {
        throw new AppError(400, 'scene 必须为 avatar、resume-image 或 submission')
      }

      const cfg = SCENE_CONFIGS[scene]
      if (cfg.needResumeId && !req.body.resumeId) {
        throw new AppError(400, '简历图片场景必须提供 resumeId')
      }
      const resumeId = String(req.body.resumeId ?? '')

      if (!cfg.allowedTypes.includes(file.mimetype)) {
        throw new AppError(400, `不支持的文件类型: ${file.mimetype}`)
      }
      if (file.size > cfg.maxSize) {
        throw new AppError(400, `文件大小超过限制 (${cfg.maxSize / 1024 / 1024}MB)`)
      }

      const key = buildKey(scene, req.user!.id, file, resumeId)
      const provider = getFileStorageProvider()
      const url = await provider.put(key, file.buffer, file.mimetype)

      res.status(201).json({ url, key })
    } catch (err) {
      next(err)
    }
  },
)

/** POST /api/uploads/delete — 删除当前用户目录下的对象 */
router.post('/delete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!githubConfig.enabled) {
      throw new AppError(503, 'GitHub 存储未启用')
    }

    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? '请求参数无效')
    }

    const { keys } = parsed.data

    // 校验所有 key 属于当前用户目录
    const userId = req.user!.id
    for (const key of keys) {
      const userPrefix = `avatars/${userId}/,resumes/${userId}/,submissions/${userId}/`
      const allowed = userPrefix.split(',').some((prefix) => key.startsWith(prefix))
      if (!allowed) {
        throw new AppError(403, `无权删除对象: ${key}`)
      }
    }

    const provider = getFileStorageProvider()
    const result = await provider.deleteObjects(keys)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router