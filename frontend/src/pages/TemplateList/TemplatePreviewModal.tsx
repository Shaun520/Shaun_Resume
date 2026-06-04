import { useState, useEffect } from 'react'
import { Modal, Button, Spin } from 'antd'
import TemplateRenderer from '../../templates/engine/TemplateRenderer'
import { registerBuiltInTemplates } from '../../templates/engine/level1'
import type { ResumeContent } from '../../types/resume'
import type { Template } from '../../types/template'

const SAMPLE_CONTENT: ResumeContent = {
  basicInfo: {
    name: '张三',
    phone: '138-0000-0000',
    email: 'zhangsan@example.com',
    address: '北京市朝阳区',
    summary: '5 年全栈开发经验，专注于 React/Node.js 技术栈。主导过多个大型项目架构设计与落地。',
    avatarUrl: '',
  },
  education: [
    {
      id: '1',
      school: '北京大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2014-09',
      endDate: '2018-06',
    },
  ],
  workExperience: [
    {
      id: '1',
      company: '某互联网科技有限公司',
      position: '高级前端工程师',
      startDate: '2020-03',
      endDate: '',
      description: '负责核心业务模块开发、前端架构优化、团队技术分享。',
    },
  ],
  projectExperience: [
    {
      id: '1',
      name: '在线简历平台',
      role: '前端负责人',
      startDate: '2023-01',
      endDate: '2023-12',
      description: '基于 React + TypeScript 构建的在线简历制作平台，支持模板切换与 PDF 导出。',
    },
  ],
  skills: [
    { id: '1', name: 'React', proficiency: '精通' },
    { id: '2', name: 'TypeScript', proficiency: '熟练' },
    { id: '3', name: 'Node.js', proficiency: '熟练' },
  ],
}

interface TemplatePreviewModalProps {
  open: boolean
  templates: Template[]
  initialTemplateId?: string
  onApply: (templateId: string, templateName: string) => void
  onClose: () => void
}

/** 模板预览弹窗：以示例内容通过 TemplateRenderer 渲染目标模板效果 */
export default function TemplatePreviewModal({
  open,
  templates,
  initialTemplateId,
  onApply,
  onClose,
}: TemplatePreviewModalProps) {
  const [selectedSchemaKey, setSelectedSchemaKey] = useState<string>(
    initialTemplateId || '',
  )
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if (open && !registered) {
      registerBuiltInTemplates()
      setRegistered(true)
    }
  }, [open, registered])

  useEffect(() => {
    if (initialTemplateId) {
      setSelectedSchemaKey(initialTemplateId)
    }
  }, [initialTemplateId])

  const currentTemplate = templates.find(
    (t) => t.schemaKey === selectedSchemaKey,
  )

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      footer={null}
      width="90vw"
      centered
      bodyStyle={{ padding: 0, height: '80vh', overflow: 'hidden' }}
      destroyOnHidden
    >
      <div className="flex h-full">
        {/* 左侧模板列表 */}
        <aside
          className="w-64 border-r border-warm-100 overflow-y-auto bg-warm-50/50 flex-shrink-0"
          role="listbox"
          aria-label="可选模板列表"
          aria-activedescendant={
            currentTemplate ? `tpl-${currentTemplate.id}` : undefined
          }
        >
          <div className="p-4 border-b border-warm-100">
            <h3 className="font-serif text-sm font-semibold text-warm-900">
              选择模板预览
            </h3>
            <p className="text-xs text-warm-400 mt-1">
              共 {templates.length} 个模板
            </p>
          </div>
          <nav className="p-2 space-y-1">
            {templates.map((t) => {
              const isActive = t.schemaKey === selectedSchemaKey
              return (
                <button
                  key={t.id}
                  id={`tpl-${t.id}`}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => setSelectedSchemaKey(t.schemaKey)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault()
                      const idx = templates.findIndex(
                        (item) => item.id === t.id,
                      )
                      const nextIdx =
                        e.key === 'ArrowDown'
                          ? Math.min(idx + 1, templates.length - 1)
                          : Math.max(idx - 1, 0)
                      const nextT = templates[nextIdx]
                      if (nextT) {
                        setSelectedSchemaKey(nextT.schemaKey)
                        document.getElementById(`tpl-${nextT.id}`)?.focus()
                      }
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-white shadow-sm ring-1 ring-terracotta-300 text-terracotta-700 font-medium'
                      : 'text-warm-700 hover:bg-white hover:text-warm-900'
                  }`}
                >
                  <span className="block truncate">{t.name}</span>
                  <span className="block text-xs mt-0.5 opacity-60 truncate">
                    {t.description || '暂无描述'}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* 右侧预览区 */}
        <section
          className="flex-1 overflow-auto p-6 bg-gray-50 flex flex-col items-center"
          aria-label="模板效果预览区域"
          role="region"
        >
          {/* Preview Header */}
          <header className="w-full max-w-[210mm] mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-warm-900">
                {currentTemplate?.name || '选择一个模板'}
              </h2>
              {currentTemplate?.description && (
                <p className="text-xs text-warm-500 mt-0.5">
                  {currentTemplate.description}
                </p>
              )}
            </div>
            <Button
              type="primary"
              disabled={!currentTemplate}
              onClick={() =>
                currentTemplate &&
                onApply(currentTemplate.id, currentTemplate.name)
              }
              style={{
                background:
                  'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
              }}
              aria-label={`应用模板 ${currentTemplate?.name || ''}`}
            >
              使用此模板
            </Button>
          </header>

          {/* Preview Content */}
          <div
            className="bg-white shadow-lg overflow-auto"
            style={{
              width: '210mm',
              minHeight: '297mm',
              maxHeight: 'calc(80vh - 120px)',
            }}
            role="img"
            aria-label={`模板 ${currentTemplate?.name || ''} 的渲染预览`}
          >
            {selectedSchemaKey ? (
              <TemplateRenderer
                templateId={selectedSchemaKey}
                data={SAMPLE_CONTENT}
              />
            ) : (
              <div className="flex items-center justify-center h-[297mm] text-warm-400">
                <Spin tip="加载中..." />
              </div>
            )}
          </div>
        </section>
      </div>
    </Modal>
  )
}
