import { useState, useCallback } from 'react'
import { Button, Card, Spin, Tag, App } from 'antd'
import { ThunderboltOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { aiService } from '../../services/aiService'
import type { OptimizationSuggestion } from '../../types/ai'

interface AiOptimizePanelProps {
  /** 选中的原始文本 */
  text: string
  /** 字段上下文（如 workDescription、summary 等） */
  context: string
  /** 选择建议后的回调，返回替换后的文本 */
  onApply: (newText: string) => void
  /** 关闭面板 */
  onClose: () => void
}

export default function AiOptimizePanel({ text, context, onApply, onClose }: AiOptimizePanelProps) {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])

  const handleOptimize = useCallback(async () => {
    setLoading(true)
    try {
      const result = await aiService.optimize({ text, context })
      setSuggestions(result.suggestions)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'AI 优化失败，请稍后重试'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [text, context, message])

  const handleApply = useCallback(
    (suggestion: OptimizationSuggestion) => {
      onApply(suggestion.text)
      message.success('已应用优化建议')
      onClose()
    },
    [onApply, onClose, message],
  )

  return (
    <div
      className="absolute right-0 top-0 z-50 w-80 max-h-96 overflow-y-auto shadow-xl rounded-lg border"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E0D4' }}
      role="dialog"
      aria-label="AI 优化建议"
    >
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: '#E8E0D4' }}>
        <span className="font-semibold text-sm" style={{ color: '#2C1810' }}>
          <ThunderboltOutlined className="mr-1" /> AI 优化建议
        </span>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
          aria-label="关闭 AI 优化面板"
        />
      </div>

      <div className="p-3">
        {loading && (
          <div className="flex flex-col items-center py-6" role="status" aria-label="AI 正在优化">
            <Spin size="small" />
            <span className="mt-2 text-sm text-gray-500">AI 正在优化...</span>
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-2">
              原文：{text.length > 80 ? text.slice(0, 80) + '...' : text}
            </p>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={handleOptimize}
              block
              aria-label="开始 AI 优化"
              style={{ backgroundColor: '#C45D3E', borderColor: '#C45D3E' }}
            >
              开始优化
            </Button>
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <Card
                key={suggestion.index}
                size="small"
                className="cursor-pointer hover:shadow-md transition-shadow"
                style={{ borderColor: '#E8E0D4' }}
                onClick={() => handleApply(suggestion)}
                role="button"
                aria-label={`应用${suggestion.label}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleApply(suggestion)
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <Tag
                    color="volcano"
                    className="shrink-0"
                    style={{ backgroundColor: '#F5E6D3', color: '#C45D3E', borderColor: '#E8D4C0' }}
                  >
                    {suggestion.label}
                  </Tag>
                  <CheckOutlined className="text-gray-400 shrink-0 mt-0.5" />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: '#2C1810' }}>
                  {suggestion.text}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
