import { Form, Input, InputNumber, Upload } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import type { BasicInfo } from '../../types/resume'

interface BasicInfoFormProps {
  data: BasicInfo
  onChange: (data: Partial<BasicInfo>) => void
}

export default function BasicInfoForm({ data, onChange }: BasicInfoFormProps) {
  const handleFieldChange = (field: keyof BasicInfo, value: string) => {
    onChange({ [field]: value })
  }

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
        <Input.TextArea
          value={data.summary ?? ''}
          onChange={(e) => handleFieldChange('summary', e.target.value)}
          placeholder="用一两句话介绍自己..."
          rows={3}
          maxLength={200}
          showCount
          aria-label="个人简介"
        />
      </Form.Item>

      <Form.Item label="头像">
        <Upload
          listType="picture-circle"
          maxCount={1}
          accept=".jpg,.jpeg,.png"
          beforeUpload={() => false}
          onChange={({ fileList }) => {
            const file = fileList[0] as UploadFile | undefined
            if (file?.originFileObj) {
              // 生成预览 URL（实际上传由后端处理）
              const url = URL.createObjectURL(file.originFileObj)
              handleFieldChange('avatarUrl', url)
            }
          }}
          aria-label="头像上传"
        >
          {data.avatarUrl ? null : (
            <div className="text-center">
              <span style={{ color: '#9C8C7C' }}>上传头像</span>
            </div>
          )}
        </Upload>
      </Form.Item>
    </div>
  )
}
