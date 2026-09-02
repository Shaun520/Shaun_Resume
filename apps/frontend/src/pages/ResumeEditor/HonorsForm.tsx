import { Button, Form, Input } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { Honor } from '../../types/resume'

interface HonorsFormProps {
  data: Honor[]
  onChange: (data: Honor[]) => void
}

const emptyItem: Honor = {
  id: '',
  title: '',
  level: '',
  date: '',
  description: '',
}

export default function HonorsForm({ data, onChange }: HonorsFormProps) {
  const handleChange = (index: number, field: keyof Honor, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value } as Honor
    onChange(updated)
  }

  const addItem = () => {
    onChange([...data, { ...emptyItem }])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4" role="group" aria-label="荣誉奖项">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: '#2C1810' }}>荣誉奖项</h3>
        <Button type="link" icon={<PlusOutlined />} onClick={addItem} aria-label="添加荣誉奖项">
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
            aria-label={`删除第 ${index + 1} 条荣誉奖项`}
          />

          <Form.Item label="奖项名称">
            <Input
              value={item.title}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
              placeholder="奖项名称"
              aria-label={`第 ${index + 1} 条 - 奖项名称`}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3 pr-8">
            <Form.Item label="奖项等级">
              <Input
                value={item.level ?? ''}
                onChange={(e) => handleChange(index, 'level', e.target.value)}
                placeholder="如：国家级 / 校级"
                aria-label={`第 ${index + 1} 条 - 奖项等级`}
              />
            </Form.Item>
            <Form.Item label="获得时间">
              <Input
                value={item.date ?? ''}
                onChange={(e) => handleChange(index, 'date', e.target.value)}
                placeholder="如：2024-05"
                aria-label={`第 ${index + 1} 条 - 获得时间`}
              />
            </Form.Item>
          </div>

          <Form.Item label="备注">
            <Input.TextArea
              value={item.description ?? ''}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              placeholder="补充说明（可选）"
              rows={2}
              aria-label={`第 ${index + 1} 条 - 备注`}
            />
          </Form.Item>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-6 text-gray-400" role="status">
          暂无荣誉奖项，点击上方按钮添加
        </div>
      )}
    </div>
  )
}