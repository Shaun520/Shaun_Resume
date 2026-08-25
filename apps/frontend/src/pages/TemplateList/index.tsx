import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { App, Spin } from 'antd'
import { templateService } from '../../services/templateService'
import { resumeService } from '../../services/resumeService'
import TemplateCard from './TemplateCard'
import TemplatePreviewModal from './TemplatePreviewModal'
import type { Template } from '../../types/template'

export default function TemplateList() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [creating, setCreating] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTemplateId, setPreviewTemplateId] = useState<string>('')

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await templateService.getList()
      setTemplates(res.items)
    } catch {
      setError('获取模板列表失败，请稍后重试')
      message.error('获取模板列表失败')
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    fetchTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const categories = useMemo(
    () => ['全部', ...Array.from(new Set(templates.map((t) => {
      const tags = t.industryTags?.split(',') ?? []
      return tags[0] || '通用'
    })))],
    [templates],
  )

  const filteredTemplates = useMemo(() =>
    templates.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      const tags = t.industryTags?.split(',') ?? []
      const primaryTag = tags[0] || '通用'
      const matchesCategory =
        selectedCategory === '全部' || primaryTag === selectedCategory
      return matchesSearch && matchesCategory
    }),
    [templates, searchQuery, selectedCategory],
  )

  const handleUseTemplate = useCallback(
    async (templateId: string, templateName: string) => {
      setCreating(templateId)
      try {
        const resume = await resumeService.create({
          title: `我的${templateName}简历`,
          templateId,
        })
        message.success('简历创建成功，正在跳转编辑器...')
        navigate(`/resumes/${resume.id}/edit`)
      } catch {
        message.error('创建简历失败，请稍后重试')
      } finally {
        setCreating(null)
      }
    },
    [message, navigate],
  )

  const handlePreview = useCallback((template: Template) => {
    setPreviewTemplateId(template.schemaKey)
    setPreviewOpen(true)
  }, [])

  const handleApplyFromPreview = useCallback(
    (templateId: string, templateName: string) => {
      setPreviewOpen(false)
      handleUseTemplate(templateId, templateName)
    },
    [handleUseTemplate],
  )

  // Error state
  if (error && !loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#FEE2E2' }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: '#DC2626' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="font-serif text-lg font-semibold mb-2" style={{ color: '#2C1810' }}>
            加载失败
          </h2>
          <p className="text-sm mb-4" style={{ color: '#9C8C7C' }}>
            {error}
          </p>
          <button
            onClick={fetchTemplates}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2"
            style={{
              background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
            }}
            aria-label="重新加载模板列表"
          >
            重新加载
          </button>
        </div>
      </main>
    )
  }

  // Loading state
  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}
        role="status"
        aria-label="加载中"
      >
        <Spin size="large" tip="加载中..." />
      </main>
    )
  }

  return (
    <main
      className="min-h-screen"
      style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}
      role="main"
      aria-label="模板中心页面"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <header className="mb-5">
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-warm-900 mb-1">
            模板中心
          </h1>
          <p className="text-sm text-warm-500">
            精选 {templates.length} 款专业简历模板，一键套用
          </p>
        </header>

        {/* Search & Filter Bar */}
        <section
          className="bg-white rounded-xl shadow-sm border border-warm-100 p-4 mb-5"
          aria-label="搜索与筛选栏"
        >
          {/* Search Input */}
          <div className="relative mb-3">
            <label htmlFor="template-search" className="sr-only">
              搜索模板
            </label>
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="template-search"
              type="text"
              placeholder="搜索模板名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:border-terracotta-300 focus:ring-2 focus:ring-terracotta-100 transition-all duration-200"
              aria-label="按名称或描述搜索模板"
            />
          </div>

          {/* Category Tags */}
          <nav
            className="flex flex-wrap gap-2 mb-3"
            aria-label="按行业分类筛选"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta-300 ${
                  selectedCategory === category
                    ? 'bg-terracotta-500 text-white shadow-md'
                    : 'bg-warm-50 text-warm-600 hover:bg-warm-100 hover:text-warm-800 border border-warm-200'
                }`}
                aria-pressed={selectedCategory === category}
                role="radio"
                aria-checked={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </nav>

          {/* Results Count & Reset */}
          <div className="mt-3 pt-3 border-t border-warm-100 flex items-center justify-between">
            <span
              className="text-xs text-warm-500"
              role="status"
              aria-live="polite"
            >
              找到{' '}
              <span className="font-semibold text-terracotta-600">
                {filteredTemplates.length}
              </span>{' '}
              个模板（共 {templates.length} 个）
            </span>
            {(searchQuery || selectedCategory !== '全部') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('全部')
                }}
                className="text-xs text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors focus:outline-none focus:underline"
                aria-label="清除所有筛选条件"
              >
                清除筛选
              </button>
            )}
          </div>
        </section>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
            role="list"
            aria-label="模板列表"
          >
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={handlePreview}
                onUse={handleUseTemplate}
                isCreating={creating === template.id}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            className="text-center py-16 bg-white rounded-xl border border-warm-100"
            role="status"
          >
            <div
              className="w-16 h-16 bg-warm-50 rounded-full flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <svg
                className="w-8 h-8 text-warm-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-warm-800 mb-2">
              未找到匹配的模板
            </h3>
            <p className="text-sm text-warm-500 mb-4">
              尝试调整搜索关键词或选择其他分类
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('全部')
              }}
              className="px-5 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2"
              style={{
                background:
                  'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
              }}
              aria-label="重置筛选条件"
            >
              重置筛选条件
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        open={previewOpen}
        templates={templates}
        initialTemplateId={previewTemplateId}
        onApply={handleApplyFromPreview}
        onClose={() => setPreviewOpen(false)}
      />
    </main>
  )
}
