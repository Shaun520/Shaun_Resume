import { Button, Form, Input, DatePicker } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Education } from '../../types/resume'

interface EducationFormProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

const emptyItem: Education = {
  id: '',
  school: '',
  major: '',
  degree: '',
  startDate: '',
  endDate: '',
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const handleChange = (index: number, field: keyof Education, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value } as Education
    onChange(updated)
  }

  const addItem = () => {
    onChange([...data, { ...emptyItem }])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4" role="group" aria-label="教育经历">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: '#2C1810' }}>教育经历</h3>
        <Button type="link" icon={<PlusOutlined />} onClick={addItem} aria-label="添加教育经历">
          添加
        </Button>
      </div>

      {data.map((item, index) => (
        <div key={index} className="p-4 rounded-lg border border-gray-200 space-y-3 relative">
          <Button
            type="text"
            danger
            icon={<MinusCircleOutlined />}
            className="absolute top-2 right-2"
            onClick={() => removeItem(index)}
            aria-label={`删除第 ${index + 1} 条教育经历`}
          />

          <div className="grid grid-cols-2 gap-3 pr-8">
            <Form.Item label="学校">
              <Input
                value={item.school}
                onChange={(e) => handleChange(index, 'school', e.target.value)}
                placeholder="学校名称"
                aria-label={`第 ${index + 1} 条 - 学校`}
              />
            </Form.Item>
            <Form.Item label="专业">
              <Input
                value={item.major}
                onChange={(e) => handleChange(index, 'major', e.target.value)}
                placeholder="专业名称"
                aria-label={`第 ${index + 1} 条 - 专业`}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Form.Item label="学历">
              <Input
                value={item.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                placeholder="本科/硕士/博士"
                aria-label={`第 ${index + 1} 条 - 学历`}
              />
            </Form.Item>
            <Form.Item label="开始时间">
              <DatePicker
                picker="month"
                value={item.startDate ? dayjs(item.startDate) : null}
                onChange={(date) => handleChange(index, 'startDate', date?.format('YYYY-MM') ?? '')}
                placeholder="开始"
                className="w-full"
                aria-label={`第 ${index + 1} 条 - 开始时间`}
              />
            </Form.Item>
            <Form.Item label="结束时间">
              <DatePicker
                picker="month"
                value={item.endDate ? dayjs(item.endDate) : null}
                onChange={(date) => handleChange(index, 'endDate', date?.format('YYYY-MM') ?? '')}
                placeholder="结束"
                className="w-full"
                aria-label={`第 ${index + 1} 条 - 结束时间`}
              />
            </Form.Item>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-6 text-gray-400" role="status">
          暂无教育经历，点击上方按钮添加
        </div>
      )}
    </div>
  )
}
