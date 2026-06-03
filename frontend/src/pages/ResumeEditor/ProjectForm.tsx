import { Button, Form, Input, DatePicker } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ProjectExperience } from '../../types/resume'

interface ProjectFormProps {
  data: ProjectExperience[]
  onChange: (data: ProjectExperience[]) => void
}

const emptyItem: ProjectExperience = {
  name: '',
  role: '',
  startDate: '',
  endDate: '',
  description: '',
}

export default function ProjectForm({ data, onChange }: ProjectFormProps) {
  const handleChange = (index: number, field: keyof ProjectExperience, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value } as ProjectExperience
    onChange(updated)
  }

  const addItem = () => {
    onChange([...data, { ...emptyItem }])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4" role="group" aria-label="项目经历">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: '#2C1810' }}>项目经历</h3>
        <Button type="link" icon={<PlusOutlined />} onClick={addItem} aria-label="添加项目经历">
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
            aria-label={`删除第 ${index + 1} 条项目经历`}
          />

          <div className="grid grid-cols-2 gap-3 pr-8">
            <Form.Item label="项目名称">
              <Input
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                placeholder="项目名称"
                aria-label={`第 ${index + 1} 条 - 项目名称`}
              />
            </Form.Item>
            <Form.Item label="担任角色">
              <Input
                value={item.role}
                onChange={(e) => handleChange(index, 'role', e.target.value)}
                placeholder="你在项目中的角色"
                aria-label={`第 ${index + 1} 条 - 担任角色`}
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

          <Form.Item label="项目描述">
            <Input.TextArea
              value={item.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              placeholder="描述项目背景、你的贡献和成果..."
              rows={3}
              aria-label={`第 ${index + 1} 条 - 项目描述`}
            />
          </Form.Item>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-6 text-gray-400" role="status">
          暂无项目经历，点击上方按钮添加
        </div>
      )}
    </div>
  )
}
