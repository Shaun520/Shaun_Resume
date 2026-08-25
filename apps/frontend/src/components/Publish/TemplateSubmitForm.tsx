import { useState, useEffect, useCallback } from 'react'
import { App, Form, Input, Radio, Upload, Spin, type UploadFile } from 'antd'
import { templateService } from '../../services/templateService'

const { TextArea } = Input

const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024
const MAX_NAME = 30
const MAX_DESCRIPTION = 500

interface FormValues {
  name: string
  description: string
  level: 2 | 3
  industryTags?: string
}

interface TemplateSubmitFormProps {
  /** 提交成功后的回调（默认跳到 /my-submissions） */
  onSubmitted?: () => void
}

/** 模板提交表单（无外层 <main> 包装） */
export default function TemplateSubmitForm({ onSubmitted }: TemplateSubmitFormProps = {}) {
  const { message } = App.useApp()
  const [form] = Form.useForm<FormValues>()
  const [file, setFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const level = Form.useWatch('level', form)

  const validateFile = useCallback(
    (f: File): string | null => {
      const accept = level === 2 ? '.zip' : '.html'
      const mime = level === 2 ? 'application/zip' : 'text/html'
      if (f.type !== mime && !f.name.toLowerCase().endsWith(accept)) {
        return `L${level} 模板必须为 ${accept} 格式`
      }
      if (f.size > MAX_FILE_SIZE) {
        return '模板文件不能超过 10MB'
      }
      return null
    },
    [level],
  )

  const validateThumbnail = useCallback((f: File): string | null => {
    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      return '缩略图必须为 JPG 或 PNG 格式'
    }
    if (f.size > MAX_THUMBNAIL_SIZE) {
      return '缩略图不能超过 2MB'
    }
    return null
  }, [])

  const handleFileChange = useCallback((info: { fileList: UploadFile[] }) => {
    const latest = info.fileList[info.fileList.length - 1]
    setFileList(info.fileList)
    if (latest?.originFileObj) {
      setFile(latest.originFileObj)
    } else {
      setFile(null)
    }
  }, [])

  const handleThumbnailChange = useCallback((info: { fileList: UploadFile[] }) => {
    const latest = info.fileList[info.fileList.length - 1]
    setThumbnailList(info.fileList)
    if (latest?.originFileObj) {
      setThumbnail(latest.originFileObj)
    } else {
      setThumbnail(null)
    }
  }, [])

  const beforeUploadFile = useCallback(
    (f: File): boolean | Promise<boolean> => {
      const err = validateFile(f)
      if (err) {
        message.error(err)
        return false
      }
      return true
    },
    [validateFile, message],
  )

  const beforeUploadThumbnail = useCallback(
    (f: File): boolean | Promise<boolean> => {
      const err = validateThumbnail(f)
      if (err) {
        message.error(err)
        return false
      }
      return true
    },
    [validateThumbnail, message],
  )

  const handleSubmit = async (values: FormValues) => {
    if (!file) {
      message.error('请上传模板文件')
      return
    }
    if (!thumbnail) {
      message.error('请上传缩略图')
      return
    }
    const fileErr = validateFile(file)
    if (fileErr) {
      message.error(fileErr)
      return
    }
    const thumbErr = validateThumbnail(thumbnail)
    if (thumbErr) {
      message.error(thumbErr)
      return
    }

    setSubmitting(true)
    try {
      const res = await templateService.submit({
        name: values.name.trim(),
        description: values.description.trim(),
        level: values.level,
        industryTags: values.industryTags?.trim() || undefined,
        file,
        thumbnail,
      })
      message.success(`模板「${res.name}」已发布，已在模板列表中可见`)
      form.resetFields()
      setFile(null)
      setThumbnail(null)
      setFileList([])
      setThumbnailList([])
      onSubmitted?.()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      message.error(e.response?.data?.message ?? '提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  // 切换 level 时清空已选文件（格式不匹配）
  useEffect(() => {
    setFile(null)
    setFileList([])
  }, [level])

  return (
    <section
      className="bg-white rounded-xl border border-warm-100 p-6"
      aria-label="模板提交表单"
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ level: 2 }}
        disabled={submitting}
        aria-label="模板提交表单"
      >
        <Form.Item
          label="模板名称"
          name="name"
          rules={[
            { required: true, message: '请输入模板名称' },
            { min: 2, message: '模板名称至少 2 个字符' },
            { max: MAX_NAME, message: `模板名称最多 ${MAX_NAME} 个字符` },
          ]}
        >
          <Input
            placeholder="例如：极简风单页简历"
            maxLength={MAX_NAME}
            showCount
            aria-label="模板名称"
            aria-required="true"
          />
        </Form.Item>

        <Form.Item
          label="模板描述"
          name="description"
          rules={[
            { required: true, message: '请输入模板描述' },
            { max: MAX_DESCRIPTION, message: `描述最多 ${MAX_DESCRIPTION} 字符` },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="简要描述模板的适用场景与设计特点"
            maxLength={MAX_DESCRIPTION}
            showCount
            aria-label="模板描述"
            aria-required="true"
          />
        </Form.Item>

        <Form.Item
          label="模板级别"
          name="level"
          rules={[{ required: true, message: '请选择模板级别' }]}
        >
          <Radio.Group aria-label="选择模板级别">
            <Radio value={2}>L2 插件包（.zip）</Radio>
            <Radio value={3}>L3 HTML 模板（.html）</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="行业标签" name="industryTags" tooltip="可选，逗号分隔，例如：互联网,设计,教育">
          <Input placeholder="例如：互联网,设计,金融" aria-label="行业标签，逗号分隔" />
        </Form.Item>

        <Form.Item
          label={`模板文件${level === 2 ? '（.zip，10MB 以内）' : '（.html，10MB 以内）'}`}
          required
        >
          <Upload
            fileList={fileList}
            beforeUpload={beforeUploadFile}
            onChange={handleFileChange}
            maxCount={1}
            accept={level === 2 ? '.zip,application/zip' : '.html,text/html'}
            aria-label="上传模板文件"
          >
            <button
              type="button"
              className="px-4 py-2 border border-warm-200 rounded-lg text-sm font-medium text-warm-700 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            >
              选择文件
            </button>
          </Upload>
          {file && (
            <p className="mt-2 text-xs text-warm-500" aria-live="polite">
              已选择：{file.name}（{(file.size / 1024).toFixed(1)} KB）
            </p>
          )}
        </Form.Item>

        <Form.Item label="缩略图（JPG/PNG，2MB 以内）" required>
          <Upload
            fileList={thumbnailList}
            beforeUpload={beforeUploadThumbnail}
            onChange={handleThumbnailChange}
            maxCount={1}
            accept="image/jpeg,image/png"
            listType="picture"
            aria-label="上传缩略图"
          >
            <button
              type="button"
              className="px-4 py-2 border border-warm-200 rounded-lg text-sm font-medium text-warm-700 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            >
              选择缩略图
            </button>
          </Upload>
          {thumbnail && (
            <p className="mt-2 text-xs text-warm-500" aria-live="polite">
              已选择：{thumbnail.name}（{(thumbnail.size / 1024).toFixed(1)} KB）
            </p>
          )}
        </Form.Item>

        <div
          className="rounded-lg p-3 mb-4 text-xs"
          style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
          role="note"
          aria-label="Phase 7 暂行策略提示"
        >
          <strong>提示：</strong>
          当前为 Phase 7 暂行策略，提交后系统将自动审核通过，模板会立即在「模板中心」中显示，供所有用户使用。
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => form.resetFields()}
            className="px-5 py-2 rounded-lg text-sm font-medium text-warm-700 hover:bg-warm-100 transition-colors focus:outline-none focus:ring-2 focus:ring-warm-300"
            disabled={submitting}
          >
            重置
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg transition-all disabled:bg-warm-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2"
            style={{
              background: submitting
                ? undefined
                : 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
            }}
            aria-busy={submitting}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Spin size="small" />
                提交中...
              </span>
            ) : (
              '提交模板'
            )}
          </button>
        </div>
      </Form>
    </section>
  )
}
