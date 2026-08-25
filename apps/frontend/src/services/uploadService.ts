/**
 * 前端文件上传服务封装
 * 将文件 multipart POST 到后端统一上传接口，由后端代理推送到 GitHub 资源仓库
 * 支持进度回调与结构化错误信息
 */
import apiClient from './apiClient'

export type UploadScene = 'avatar' | 'resume-image' | 'submission'

export interface UploadFileOptions {
  scene: UploadScene
  resumeId?: string
  onProgress?: (percent: number) => void
}

export interface UploadFileResult {
  url: string
  key: string
}

export interface UploadFileError {
  message: string
}

/**
 * 上传文件（后端代理 → GitHub 资源仓库）
 * @returns 返回 { url: raw URL, key: 仓库内路径 }
 */
export async function uploadFile(
  file: File,
  options: UploadFileOptions,
): Promise<UploadFileResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('scene', options.scene)
  if (options.resumeId) {
    formData.append('resumeId', options.resumeId)
  }

  try {
    const res = await apiClient.post<UploadFileResult>('/uploads', formData, {
      // 由浏览器自动生成 multipart boundary，避免缺失 boundary 导致 multer 解析失败
      headers: { 'Content-Type': undefined },
      onUploadProgress: (e) => {
        if (options.onProgress && e.total) {
          options.onProgress(Math.round((e.loaded / e.total) * 100))
        }
      },
    })
    return res.data
  } catch (err: unknown) {
    const message = extractUploadError(err)
    throw { message }
  }
}

function extractUploadError(err: unknown): string {
  const axiosErr = err as {
    response?: { data?: { message?: string; errors?: unknown[] } }
  } | null
  if (axiosErr?.response?.data?.message) {
    return axiosErr.response.data.message
  }
  if (axiosErr?.response?.data?.errors) {
    return '请求参数验证失败'
  }
  return '上传失败，请稍后重试'
}