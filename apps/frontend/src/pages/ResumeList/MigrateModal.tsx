/**
 * 简历一键迁移弹窗
 * 选择目标模板 → 预览迁移效果 → 确认执行迁移
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal, Button, Spin, App, Tag } from 'antd'
import TemplateRenderer from '../../templates/engine/TemplateRenderer'
import { registerBuiltInTemplates } from '../../templates/engine/level1'
import { resumeService } from '../../services/resumeService'
import { templateService } from '../../services/templateService'
import type { Resume, ResumeListItem } from '../../types/resume'
import type { Template } from '../../types/template'
import type { ResumeContent } from '../../types/resume'

/** 内容字段 → 中文标签（用于保留字段提示） */
const FIELD_LABELS: Record<string, string> = {
  basicInfo: '基本信息',
  summary: '个人简介',
  workExperience: '工作经历',
  education: '教育经历',
  projectExperience: '项目经历',
  skills: '技能列表',
}

const DEFAULT_CONTENT: ResumeContent = {
  basicInfo: { name: '', phone: '', email: '', address: '', summary: '', avatarUrl: '' },
  education: [],
  workExperience: [],
  projectExperience: [],
  skills: [],
}

interface MigrateModalProps {
  open: boolean
  /** 简历列表项（用于在卡片上直接触发迁移时使用） */
  resumeListItem: ResumeListItem | null
  onClose: () => void
  onMigrated: () => void
}

/** 简历迁移确认弹窗 */
export default function MigrateModal({
  open,
  resumeListItem,
  onClose,
  onMigrated,
}: MigrateModalProps) {
  const { message } = App.useApp()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [resume, setResume] = useState<Resume | null>(null)
  const [loadingResume, setLoadingResume] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [migrating, setMigrating] = useState(false)

  // 加载模板列表
  useEffect(() => {
    if (!open) return
    let cancelled = false
    const load = async () => {
      setLoadingTemplates(true)
      try {
        registerBuiltInTemplates()
        const res = await templateService.getList()
        if (!cancelled) {
          // 过滤掉当前简历已使用的模板
          const filtered = res.items.filter(
            (t) => t.id !== resumeListItem?.templateId,
          )
          setTemplates(filtered)
          // 默认选中第一个 L1 模板
          const firstL1 = filtered.find((t) => t.level === 1) ?? filtered[0]
          setSelectedTemplateId(firstL1?.id ?? null)
        }
      } catch {
        if (!cancelled) message.error('获取模板列表失败')
      } finally {
        if (!cancelled) setLoadingTemplates(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [open, resumeListItem?.templateId, message])

  // 加载简历详情（用于预览）
  useEffect(() => {
    if (!open || !resumeListItem) return
    let cancelled = false
    const load = async () => {
      setLoadingResume(true)
      try {
        const detail = await resumeService.getDetail(resumeListItem.id)
        if (!cancelled) setResume(detail)
      } catch {
        if (!cancelled) message.error('获取简历详情失败')
      } finally {
        if (!cancelled) setLoadingResume(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [open, resumeListItem, message])

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!open) {
      setResume(null)
      setMigrating(false)
    }
  }, [open])

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) ?? null,
    [templates, selectedTemplateId],
  )

  // 用于预览的内容（空数据时使用占位）
  const previewContent: ResumeContent = resume?.content ?? DEFAULT_CONTENT

  const handleMigrate = useCallback(async () => {
    if (!resumeListItem || !selectedTemplateId) return
    setMigrating(true)
    try {
      const result = await resumeService.migrate(resumeListItem.id, selectedTemplateId)
      const { preservedFields } = result.migration
      if (preservedFields.length > 0) {
        const labels = preservedFields.map((f) => FIELD_LABELS[f] ?? f).join('、')
        message.success(
          `迁移成功！已切换到「${selectedTemplate?.name}」，${labels}等字段已保留`,
        )
      } else {
        message.success(`迁移成功！已切换到「${selectedTemplate?.name}」`)
      }
      onMigrated()
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : '迁移失败，请稍后重试'
      message.error(msg)
    } finally {
      setMigrating(false)
    }
  }, [resumeListItem, selectedTemplateId, selectedTemplate, message, onMigrated, onClose])

  return (
    <Modal
      open={open}
      onCancel={migrating ? undefined : onClose}
      title={null}
      footer={null}
      width="90vw"
      centered
      bodyStyle={{ padding: 0, height: '80vh', overflow: 'hidden' }}
      destroyOnHidden
    >
      <div className="flex h-full">
        {/* 左侧：模板选择 */}
        <aside
          className="w-72 border-r border-warm-100 overflow-y-auto bg-warm-50/50 flex-shrink-0"
          aria-label="目标模板选择"
        >
          <div className="p-4 border-b border-warm-100">
            <h3 className="font-serif text-base font-semibold text-warm-900">
              迁移到新模板
            </h3>
            <p className="text-xs text-warm-500 mt-1">
              简历「{resumeListItem?.title}」原使用「{resumeListItem?.templateName}」
            </p>
            <p className="text-xs text-warm-400 mt-1">
              选中模板后可在右侧预览迁移效果
            </p>
          </div>
          <nav className="p-2 space-y-1" role="listbox" aria-label="可选模板列表">
            {loadingTemplates ? (
              <div className="flex justify-center py-8" role="status">
                <Spin tip="加载中..." />
              </div>
            ) : templates.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-warm-400">
                暂无可用模板
              </div>
            ) : (
              templates.map((t) => {
                const isActive = t.id === selectedTemplateId
                return (
                  <button
                    key={t.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-white shadow-sm ring-1 ring-terracotta-300 text-terracotta-700 font-medium'
                        : 'text-warm-700 hover:bg-white hover:text-warm-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate flex-1">{t.name}</span>
                      <Tag
                        color={t.level === 1 ? 'orange' : t.level === 2 ? 'green' : 'blue'}
                        className="text-[10px] leading-none m-0"
                      >
                        L{t.level}
                      </Tag>
                    </div>
                    <span className="block text-xs mt-0.5 opacity-60 truncate">
                      {t.description || '暂无描述'}
                    </span>
                  </button>
                )
              })
            )}
          </nav>
        </aside>

        {/* 右侧：预览 + 操作 */}
        <section
          className="flex-1 flex flex-col bg-gray-50"
          aria-label="迁移效果预览"
        >
          {/* Header */}
          <header className="px-6 py-3 bg-white border-b border-warm-100 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-base font-bold text-warm-900">
                {selectedTemplate?.name ?? '请选择目标模板'}
              </h2>
              {selectedTemplate?.description && (
                <p className="text-xs text-warm-500 mt-0.5">
                  {selectedTemplate.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onClose} disabled={migrating}>
                取消
              </Button>
              <Button
                type="primary"
                disabled={!selectedTemplate || migrating || loadingResume}
                loading={migrating}
                onClick={handleMigrate}
                style={{
                  background:
                    'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
                  border: 'none',
                }}
                aria-label="确认迁移到选中的模板"
              >
                确认迁移
              </Button>
            </div>
          </header>

          {/* Preview Body */}
          <div className="flex-1 overflow-auto p-6 flex justify-center">
            {loadingResume ? (
              <div className="flex items-center" role="status">
                <Spin tip="加载简历内容..." />
              </div>
            ) : selectedTemplate ? (
              <div
                className="bg-white shadow-lg overflow-auto"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  maxHeight: 'calc(80vh - 130px)',
                }}
                role="img"
                aria-label={`迁移到模板 ${selectedTemplate.name} 的预览效果`}
              >
                <TemplateRenderer
                  templateId={selectedTemplate.schemaKey}
                  data={previewContent}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-warm-400">
                请在左侧选择目标模板
              </div>
            )}
          </div>

          {/* Footer 提示 */}
          <footer className="px-6 py-3 bg-white border-t border-warm-100 text-xs text-warm-500">
            <p>
              <span className="font-semibold text-warm-700">迁移说明：</span>
              简历内容将完整保留；目标模板不支持的字段将自动隐藏但仍存储在简历中，
              后续切换到支持该字段的模板时可恢复显示。
            </p>
          </footer>
        </section>
      </div>
    </Modal>
  )
}
