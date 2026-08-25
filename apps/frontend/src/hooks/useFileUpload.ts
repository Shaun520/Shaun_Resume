/**
 * 文件上传通用 Hook
 * useFileUpload({ scene, resumeId?, onUploaded(url) })
 * 内部管理上传状态（idle/uploading/success/error）、进度百分比、预览 URL、错误信息
 */
import { useState, useCallback, useRef } from 'react'
import { uploadFile, type UploadScene, type UploadFileError } from '../services/uploadService'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export interface UseFileUploadOptions {
  scene: UploadScene
  resumeId?: string
  onUploaded?: (url: string) => void
}

export interface UseFileUploadReturn {
  status: UploadStatus
  progress: number
  previewUrl: string | null
  error: string | null
  upload: (file: File) => Promise<void>
  reset: () => void
}

export function useFileUpload(options: UseFileUploadOptions): UseFileUploadReturn {
  const { scene, resumeId, onUploaded } = options
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef(false)

  const upload = useCallback(async (file: File) => {
    abortRef.current = false
    setStatus('uploading')
    setProgress(0)
    setError(null)

    // 本地预览
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    try {
      const result = await uploadFile(file, {
        scene,
        resumeId,
        onProgress: (percent) => {
          if (!abortRef.current) {
            setProgress(percent)
          }
        },
      })

      if (abortRef.current) return

      setStatus('success')
      setProgress(100)
      onUploaded?.(result.url)
    } catch (err: unknown) {
      if (abortRef.current) return

      const uploadErr = err as UploadFileError | undefined
      setStatus('error')
      setError(uploadErr?.message ?? '上传失败')
    }
  }, [scene, resumeId, onUploaded])

  const reset = useCallback(() => {
    abortRef.current = true
    setStatus('idle')
    setProgress(0)
    setPreviewUrl(null)
    setError(null)
  }, [])

  return { status, progress, previewUrl, error, upload, reset }
}