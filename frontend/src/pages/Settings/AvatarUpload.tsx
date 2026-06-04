import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { App } from 'antd'
import { userService } from '../../services/userService'

interface AvatarUploadProps {
  currentUrl?: string
  nickname: string
  onUploaded: (avatarUrl: string) => void
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg']
const ACCEPTED_EXT = '.jpg,.jpeg,.png'

/** 计算密码强度（非密码组件用，留空） */
function getInitial(nickname: string): string {
  const trimmed = nickname.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'U'
}

/**
 * 头像上传组件：
 * - 本地预览所选图片
 * - 校验类型（JPG/PNG）和大小（≤5MB）
 * - 上传到后端（POST /users/me/avatar）
 * - 通过 onUploaded 回调通知父组件更新 profile
 */
export default function AvatarUpload({ currentUrl, nickname, onUploaded }: AvatarUploadProps) {
  const { message } = App.useApp()
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // 允许选择同一个文件以触发 onChange
    if (inputRef.current) inputRef.current.value = ''
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      message.error('仅支持 JPG / PNG 格式')
      return
    }
    if (file.size > MAX_SIZE) {
      message.error('文件大小不能超过 5MB')
      return
    }

    // 本地预览
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        setPreviewUrl(result)
      }
    }
    reader.readAsDataURL(file)

    // 实际上传
    void uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const { avatarUrl } = await userService.uploadAvatar(file)
      setPreviewUrl(avatarUrl)
      onUploaded(avatarUrl)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      message.error(e.response?.data?.message ?? '上传失败，请稍后重试')
      // 失败时回退为原始头像
      setPreviewUrl(currentUrl ?? null)
    } finally {
      setUploading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* 头像预览 */}
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-warm-100"
        aria-hidden="true"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="头像预览"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-serif text-2xl"
            style={{ backgroundColor: '#C65D3B' }}
          >
            {getInitial(nickname)}
          </div>
        )}
        {uploading && (
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            role="status"
            aria-label="头像上传中"
          >
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* 上传控件 */}
      <div className="flex-1 space-y-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          className="inline-flex items-center gap-2 px-4 py-2 bg-warm-50 hover:bg-terracotta-50 text-warm-700 hover:text-terracotta-600 rounded-lg text-sm font-medium cursor-pointer border border-warm-200 hover:border-terracotta-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta-300"
          aria-label="选择新头像文件"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          选择新头像
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT}
          onChange={handleSelectFile}
          className="sr-only"
          aria-label="头像文件输入"
        />
        <p className="text-xs text-warm-500">支持 JPG / PNG 格式，文件大小不超过 5MB</p>
      </div>
    </div>
  )
}
