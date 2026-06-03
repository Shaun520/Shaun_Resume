import { Button, Form, Input, Select, Tag } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { Skill } from '../../types/resume'

interface SkillsFormProps {
  data: Skill[]
  onChange: (data: Skill[]) => void
}

const proficiencyOptions = [
  { label: '了解', value: '了解' },
  { label: '熟悉', value: '熟悉' },
  { label: '熟练', value: '熟练' },
  { label: '精通', value: '精通' },
]

const emptyItem: Skill = { name: '', proficiency: '熟悉' }

export default function SkillsForm({ data, onChange }: SkillsFormProps) {
  const handleChange = (index: number, field: keyof Skill, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value } as Skill
    onChange(updated)
  }

  const addItem = () => {
    onChange([...data, { ...emptyItem }])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4" role="group" aria-label="技能列表">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: '#2C1810' }}>技能列表</h3>
        <Button type="link" icon={<PlusOutlined />} onClick={addItem} aria-label="添加技能">
          添加
        </Button>
      </div>

      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
          <div className="flex-1">
            <Form.Item className="mb-0" label="技能名称">
              <Input
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                placeholder="如：React、TypeScript"
                aria-label={`第 ${index + 1} 项 - 技能名称`}
              />
            </Form.Item>
          </div>
          <div className="w-32">
            <Form.Item className="mb-0" label="熟练度">
              <Select
                value={item.proficiency}
                onChange={(value) => handleChange(index, 'proficiency', value)}
                options={proficiencyOptions}
                aria-label={`第 ${index + 1} 项 - 熟练度`}
              />
            </Form.Item>
          </div>
          <Button
            type="text"
            danger
            icon={<MinusCircleOutlined />}
            onClick={() => removeItem(index)}
            aria-label={`删除技能：${item.name || `第 ${index + 1} 项`}`}
          />
        </div>
      ))}

      {data.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2" aria-label="已添加的技能标签">
          {data.map((item, index) =>
            item.name ? (
              <Tag key={index} closable onClose={() => removeItem(index)} aria-label={`移除 ${item.name}`}>
                {item.name} ({item.proficiency})
              </Tag>
            ) : null,
          )}
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-6 text-gray-400" role="status">
          暂无技能，点击上方按钮添加
        </div>
      )}
    </div>
  )
}

function removeTask() {
  /* 由外层处理 */
}
