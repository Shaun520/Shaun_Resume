import { useState, useCallback } from 'react'
import { Button, Tooltip } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import AiOptimizePanel from './AiOptimizePanel'

interface AiOptimizeButtonProps {
  /** 当前文本值 */
  value: string
  /** 字段上下文 */
  context: string
  /** 应用优化后的回调 */
  onApply: (newText: string) => void
  /** AI 服务是否可用 */
  available: boolean
}

export default function AiOptimizeButton({ value, context, onApply, available }: AiOptimizeButtonProps) {
  const [showPanel, setShowPanel] = useState(false)

  const handleApply = useCallback(
    (newText: string) => {
      onApply(newText)
      setShowPanel(false)
    },
    [onApply],
  )

  const handleClose = useCallback(() => {
    setShowPanel(false)
  }, [])

  if (!available) {
    return (
      <Tooltip title="AI 优化服务暂不可用">
        <Button
          type="text"
          size="small"
          icon={<ThunderboltOutlined />}
          disabled
          aria-label="AI 优化不可用"
          className="text-gray-300"
        />
      </Tooltip>
    )
  }

  if (!value || value.trim().length === 0) {
    return (
      <Tooltip title="请先输入内容再使用 AI 优化">
        <Button
          type="text"
          size="small"
          icon={<ThunderboltOutlined />}
          disabled
          aria-label="AI 优化（请先输入内容）"
          className="text-gray-300"
        />
      </Tooltip>
    )
  }

  return (
    <div className="relative inline-block">
      <Tooltip title="AI 优化此段文字">
        <Button
          type="text"
          size="small"
          icon={<ThunderboltOutlined />}
          onClick={() => setShowPanel(true)}
          aria-label="AI 优化此段文字"
          style={{ color: '#C45D3E' }}
        />
      </Tooltip>

      {showPanel && (
        <AiOptimizePanel
          text={value}
          context={context}
          onApply={handleApply}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
