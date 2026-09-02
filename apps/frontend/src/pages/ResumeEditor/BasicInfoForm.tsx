import { Form, Input, Upload } from 'antd'
import type { BasicInfo } from '../../types/resume'
import AiOptimizeButton from './AiOptimizeButton'
import { useFileUpload } from '../../hooks/useFileUpload'

interface BasicInfoFormProps {
  data: BasicInfo
  onChange: (data: Partial<BasicInfo>) => void
  resumeId?: string
  aiAvailable?: boolean
}

function getInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'U'
}

export default function BasicInfoForm({ data, onChange, resumeId, aiAvailable = false }: BasicInfoFormProps) {
  const { status, progress, previewUrl, error, upload, reset } = useFileUpload({
    scene: 'resume-image',
    resumeId,
    onUploaded: (ossUrl) => {
      onChange({ avatarUrl: ossUrl })
    },
  })

  const handleFieldChange = (field: keyof BasicInfo, value: string) => {
    onChange({ [field]: value })
  }

  const displayAvatarUrl = previewUrl ?? data.avatarUrl ?? ''

  return (
    <div className="space-y-4" role="group" aria-label="基本信息">
      <h3 className="text-lg font-semibold" style={{ color: '#2C1810' }}>基本信息</h3>

      <Form.Item label="姓名">
        <Input
          value={data.name ?? ''}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder="请输入姓名"
          aria-label="姓名"
        />
      </Form.Item>

      <Form.Item label="英文名">
        <Input
          value={data.englishName ?? ''}
          onChange={(e) => handleFieldChange('englishName', e.target.value)}
          placeholder="请输入英文名（可选）"
          aria-label="英文名"
        />
      </Form.Item>

      <Form.Item label="求职意向">
        <Input
          value={data.objective ?? ''}
          onChange={(e) => handleFieldChange('objective', e.target.value)}
          placeholder="如：研发工程师 / 品牌传播实习生"
          aria-label="求职意向"
        />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="电话">
          <Input
            value={data.phone ?? ''}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="手机号码"
            aria-label="电话"
          />
        </Form.Item>
        <Form.Item label="邮箱">
          <Input
            value={data.email ?? ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="电子邮箱"
            aria-label="邮箱"
          />
        </Form.Item>
      </div>

      <Form.Item label="地址">
        <Input
          value={data.address ?? ''}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          placeholder="所在城市"
          aria-label="地址"
        />
      </Form.Item>

      <Form.Item label="个人简介">
        <div className="flex items-start gap-1">
          <Input.TextArea
            value={data.summary ?? ''}
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            placeholder="用一两句话介绍自己..."
            rows={3}
            maxLength={200}
            showCount
            aria-label="个人简介"
            className="flex-1"
          />
          <AiOptimizeButton
            value={data.summary ?? ''}
            context="summary"
            onApply={(newText) => handleFieldChange('summary', newText)}
            available={aiAvailable}
          />
        </div>
      </Form.Item>

      <Form.Item label="头像">
        <div className="flex items-start gap-4">
          {/* 头像预览区 */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-warm-100">
            {displayAvatarUrl ? (
              <img
                src={displayAvatarUrl}
                alt="头像预览"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-serif text-xl"
                style={{ backgroundColor: '#C65D3B' }}
              >
                {getInitial(data.name ?? '')}
              </div>
            )}
            {status === 'uploading' && (
              <div
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center"
                role="status"
                aria-label="头像上传中"
              >
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-white text-[10px] mt-0.5">{progress}%</span>
              </div>
            )}
          </div>

          {/* 上传/状态控制 */}
          <div className="flex flex-col gap-1">
            <Upload
              accept=".jpg,.jpeg,.png,.webp"
              showUploadList={false}
              beforeUpload={(file) => {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
                if (!allowedTypes.includes(file.type)) {
                  return false
                }
                if (file.size > 5 * 1024 * 1024) {
                  return false
                }
                void upload(file)
                return false
              }}
            >
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  status === 'uploading'
                    ? 'bg-warm-50 text-warm-400 border-warm-200 cursor-not-allowed'
                    : 'bg-warm-50 hover:bg-terracotta-50 text-warm-700 hover:text-terracotta-600 border-warm-200 hover:border-terracotta-200 cursor-pointer'
                }`}
                disabled={status === 'uploading'}
              >
                {status === 'uploading' ? `上传中 ${progress}%` : '上传头像'}
              </button>
            </Upload>

            {status === 'error' && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-500">{error ?? '上传失败'}</span>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-red-600 hover:text-red-700 underline"
                >
                  重试
                </button>
              </div>
            )}

            <span className="text-xs text-warm-500">JPG / PNG / WEBP，不超过 5MB</span>
          </div>
        </div>
      </Form.Item>
    </div>
  )
}
