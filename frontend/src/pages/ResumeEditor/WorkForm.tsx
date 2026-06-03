import { Button, Form, Input, DatePicker } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { WorkExperience } from '../../types/resume'

interface WorkFormProps {
  data: WorkExperience[]
  onChange: (data: WorkExperience[]) => void
}

const emptyItem: WorkExperience = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  description: '',
}

export default function WorkForm({ data, onChange }: WorkFormProps) {
  const handleChange = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const addItem = () => {
    onChange([...data, { ...emptyItem }])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4" role="group" aria-label="工作经历">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: '#2C1810' }}>工作经历</h3>
        <Button type="link" icon={<PlusOutlined />} onClick={addItem} aria-label="添加工作经历">
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
            aria-label={`删除第 ${index + 1} 条工作经历`}
          />

          <div className="grid grid-cols-2 gap-3 pr-8">
            <Form.Item label="公司名称">
              <Input
                value={item.company}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                placeholder="公司名称"
                aria-label={`第 ${index + 1} 条 - 公司名称`}
              />
            </Form.Item>
            <Form.Item label="职位">
              <Input
                value={item.position}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                placeholder="职位名称"
                aria-label={`第 ${index + 1} 条 - 职位`}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <Form.Item label="工作描述">
            <Input.TextArea
              value={item.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              placeholder="描述你的主要工作和成就..."
              rows={3}
              aria-label={`第 ${index + 1} 条 - 工作描述`}
            />
          </Form.Item>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-6 text-gray-400" role="status">
          暂无工作经历，点击上方按钮添加
        </div>
      )}
    </div>
  )
}
