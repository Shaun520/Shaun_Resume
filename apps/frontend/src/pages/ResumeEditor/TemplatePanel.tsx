/**
 * 模板选择面板
 * 从后端 API 获取模板列表、缩略图展示、点击预览、应用切换
 */

import { useState, useEffect } from 'react'
import { templateService } from '../../services/templateService'
import TemplateRenderer from '../../templates/engine/TemplateRenderer'
import { registerBuiltInTemplates } from '../../templates/engine/level1'
import type { ResumeContent } from '../../types/resume'
import type { Template } from '../../types/template'

interface TemplatePanelProps {
  currentSchemaKey: string
  data: ResumeContent
  onSelect: (templateId: string, schemaKey: string) => void | Promise<void>
  onClose: () => void
}

export default function TemplatePanel({ currentSchemaKey, data, onSelect, onClose }: TemplatePanelProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [previewSchemaKey, setPreviewSchemaKey] = useState<string>(currentSchemaKey)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    registerBuiltInTemplates()
    templateService.getList().then(res => {
      setTemplates(res.items)
    }).catch(() => {
      setTemplates([])
    })
  }, [])

  const currentPreviewTemplate = templates.find(t => t.schemaKey === previewSchemaKey)

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="选择模板"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">选择模板</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="关闭"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* 左侧模板列表 - 移动端横向滚动 */}
          <div className="md:w-72 md:border-r overflow-x-auto md:overflow-y-auto p-3 md:p-4 md:space-y-3 flex md:block gap-3 md:gap-0 flex-shrink-0 md:flex-shrink">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setPreviewSchemaKey(t.schemaKey)}
                className={`text-left p-3 rounded-lg border transition-all flex-shrink-0 w-56 md:w-auto ${
                  previewSchemaKey === t.schemaKey
                    ? 'border-terracotta-500 bg-terracotta-50 ring-2 ring-terracotta-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                role="option"
                aria-selected={previewSchemaKey === t.schemaKey}
              >
                <div className="font-medium text-sm text-gray-900">{t.name}</div>
                <div className="text-xs text-gray-500 mt-1">{t.description}</div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {t.industryTags?.split(',').map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* 右侧预览区 */}
          <div className="flex-1 overflow-auto p-3 md:p-6 bg-gray-100">
            <div
              className="bg-white shadow-lg mx-auto"
              style={{ width: '210mm', maxWidth: '100%', minHeight: '297mm' }}
            >
              <TemplateRenderer templateId={previewSchemaKey} data={data} />
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-500">
            当前预览：<span className="font-medium">{currentPreviewTemplate?.name}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button
              onClick={async () => {
                if (!currentPreviewTemplate || applying) return
                setApplying(true)
                try {
                  await onSelect(currentPreviewTemplate.id, currentPreviewTemplate.schemaKey)
                  onClose()
                } catch {
                  setApplying(false)
                }
              }}
              disabled={previewSchemaKey === currentSchemaKey || applying}
              className="px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {applying ? '应用中…' : previewSchemaKey === currentSchemaKey ? '当前使用' : '应用模板'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
