import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { App, Spin } from 'antd'
import { templateService } from '../../services/templateService'
import { resumeService } from '../../services/resumeService'
import type { Template } from '../../types/template'

const SCHEMA_KEY_COLORS: Record<string, string> = {
  classic: '#C65D3B',
  modern: '#4A7C59',
  minimal: '#5B8FAF',
}

export default function TemplateList() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [creating, setCreating] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      try {
        const res = await templateService.getList()
        setTemplates(res.items)
      } catch {
        message.error('获取模板列表失败')
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [message])

  const categories = useMemo(() => ['全部', ...Array.from(new Set(templates.map(t => {
    const tags = t.industryTags?.split(',') ?? []
    return tags[0] || '通用'
  })))], [templates])

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (t.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    const tags = t.industryTags?.split(',') ?? []
    const primaryTag = tags[0] || '通用'
    const matchesCategory = selectedCategory === '全部' || primaryTag === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = useCallback(async (templateId: string, templateName: string) => {
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
  }, [message, navigate])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}>
        <Spin size="large" tip="加载中..." />
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Page Header */}
        <div className="mb-5">
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-warm-900 mb-1">
            模板中心
          </h1>
          <p className="text-sm text-warm-500">
            精选 {templates.length} 款专业简历模板，一键套用
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-4 mb-5">

          {/* Search Input */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索模板名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:border-terracotta-300 focus:ring-2 focus:ring-terracotta-100 transition-all duration-200"
            />
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-terracotta-500 text-white shadow-md'
                    : 'bg-warm-50 text-warm-600 hover:bg-warm-100 hover:text-warm-800 border border-warm-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mt-3 pt-3 border-t border-warm-100 flex items-center justify-between">
            <span className="text-xs text-warm-500">
              找到 <span className="font-semibold text-terracotta-600">{filteredTemplates.length}</span> 个模板
            </span>
            {(searchQuery || selectedCategory !== '全部') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('全部')
                }}
                className="text-xs text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {filteredTemplates.map((template) => {
              const color = SCHEMA_KEY_COLORS[template.schemaKey] || '#C65D3B'
              const isCreating = creating === template.id
              const tags = template.industryTags?.split(',') ?? []
              return (
                <div
                  key={template.id}
                  className="group bg-white rounded-xl border border-warm-100 overflow-hidden hover:shadow-lg hover:border-terracotta-200 transition-all duration-300"
                >
                  {/* Preview Area */}
                  <div
                    className="relative h-44 bg-gradient-to-br from-warm-50 to-warm-100 p-4 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${color}15, ${color}25)`
                    }}
                  >
                    {/* Mock Resume Content */}
                    <div className="space-y-2 opacity-70 group-hover:opacity-90 transition-opacity">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: color + '40' }}
                        ></div>
                        <div className="space-y-1 flex-1">
                          <div
                            className="h-2 rounded-full w-20"
                            style={{ backgroundColor: color + '60' }}
                          ></div>
                          <div
                            className="h-1.5 rounded-full w-16"
                            style={{ backgroundColor: color + '30' }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="h-1.5 bg-warm-200 rounded-full w-full"></div>
                        <div className="h-1.5 bg-warm-200 rounded-full w-4/5"></div>
                        <div className="h-1.5 bg-warm-200 rounded-full w-3/5"></div>
                      </div>

                      <div className="pt-2 space-y-1.5">
                        <div className="h-1.5 bg-warm-150 rounded-full w-2/3"></div>
                        <div className="h-1.5 bg-warm-150 rounded-full w-1/2"></div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <button
                        onClick={() => handleUseTemplate(template.id, template.name)}
                        disabled={isCreating}
                        className="px-5 py-2 bg-white text-warm-900 rounded-lg text-sm font-semibold shadow-lg hover:bg-terracotta-500 hover:text-white transition-colors duration-200 disabled:opacity-50"
                      >
                        {isCreating ? '创建中...' : '使用此模板'}
                      </button>
                    </div>

                    {/* Category Badge */}
                    <span
                      className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium text-white shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {tags[0] || '通用'}
                    </span>
                  </div>

                  {/* Info Section */}
                  <div className="p-4">
                    <h3 className="font-bold text-base text-warm-900 mb-1 group-hover:text-terracotta-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-warm-500 line-clamp-2 mb-3 leading-relaxed">
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-warm-100">
                      <div className="flex gap-1 flex-wrap">
                        {tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-warm-50 text-warm-500 rounded border border-warm-100">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleUseTemplate(template.id, template.name)}
                        disabled={isCreating}
                        className="text-terracotta-500 hover:text-terracotta-600 font-medium text-xs transition-colors disabled:opacity-50"
                      >
                        {isCreating ? '创建中...' : '使用 →'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-xl border border-warm-100">
            <svg
              className="w-16 h-16 mx-auto text-warm-300 mb-4"
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
            <h3 className="text-lg font-bold text-warm-800 mb-2">未找到匹配的模板</h3>
            <p className="text-sm text-warm-500 mb-4">
              尝试调整搜索关键词或选择其他分类
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('全部')
              }}
              className="px-5 py-2 text-sm font-medium text-white rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
              }}
            >
              重置筛选条件
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
