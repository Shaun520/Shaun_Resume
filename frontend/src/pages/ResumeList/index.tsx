import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { App, Spin } from 'antd'
import { resumeService } from '../../services/resumeService'
import EmptyState from '../../components/Common/EmptyState'
import type { ResumeListItem } from '../../types/resume'

const TEMPLATE_COLORS: Record<string, string> = {
  classic: '#C65D3B',
  modern: '#4A7C59',
  minimal: '#5B8FAF',
}

export default function ResumeList() {
  const navigate = useNavigate()
  const { modal, message } = App.useApp()
  const [resumes, setResumes] = useState<ResumeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchResumes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await resumeService.getList()
      setResumes(res.items)
    } catch {
      message.error('获取简历列表失败')
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  const handleDelete = useCallback((id: string, title: string) => {
    modal.confirm({
      title: '确认删除',
      content: `确定要删除「${title}」吗？此操作不可撤销。`,
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await resumeService.delete(id)
          message.success('删除成功')
          fetchResumes()
        } catch {
          message.error('删除失败，请稍后重试')
        }
      },
    })
  }, [modal, message, fetchResumes])

  const filteredResumes = resumes.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}>
        <Spin size="large" tip="加载中..." />
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-warm-900 mb-1">
              我的简历
            </h1>
            <p className="text-sm text-warm-500">
              管理你创建的所有简历
            </p>
          </div>
          <button
            onClick={() => navigate('/templates')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建简历
          </button>
        </div>

        {resumes.length > 0 ? (
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
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
                    placeholder="搜索简历名称或模板..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:border-terracotta-300 focus:ring-2 focus:ring-terracotta-100 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-3 pt-3 border-t border-warm-100 flex items-center justify-between">
                <span className="text-xs text-warm-500">
                  共 <span className="font-semibold text-terracotta-600">{filteredResumes.length}</span> 份简历
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors"
                  >
                    清除搜索
                  </button>
                )}
              </div>
            </div>

            {/* Resumes Grid */}
            {filteredResumes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredResumes.map((resume) => {
                  const color = TEMPLATE_COLORS[resume.templateId] || '#C65D3B'
                  return (
                    <div
                      key={resume.id}
                      className="group bg-white rounded-xl border border-warm-100 overflow-hidden hover:shadow-lg hover:border-terracotta-200 transition-all duration-300"
                    >
                      {/* Preview Area */}
                      <div
                        className="relative h-48 p-4 overflow-hidden cursor-pointer"
                        style={{
                          background: `linear-gradient(135deg, ${color}12, ${color}22)`
                        }}
                        onClick={() => navigate(`/resumes/${resume.id}/edit`)}
                      >
                        {/* Mock Resume Content */}
                        <div className="space-y-2 opacity-60 group-hover:opacity-80 transition-opacity">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full"
                              style={{ backgroundColor: color + '40' }}
                            />
                            <div className="space-y-1 flex-1">
                              <div
                                className="h-2 rounded-full w-20"
                                style={{ backgroundColor: color + '60' }}
                              />
                              <div
                                className="h-1.5 rounded-full w-16"
                                style={{ backgroundColor: color + '30' }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <div className="h-1.5 bg-warm-200 rounded-full w-full" />
                            <div className="h-1.5 bg-warm-200 rounded-full w-4/5" />
                            <div className="h-1.5 bg-warm-200 rounded-full w-3/5" />
                          </div>

                          <div className="pt-2 space-y-1.5">
                            <div className="h-1.5 bg-warm-150 rounded-full w-2/3" />
                            <div className="h-1.5 bg-warm-150 rounded-full w-1/2" />
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                          <button className="px-5 py-2 bg-white text-warm-900 rounded-lg text-sm font-semibold shadow-lg hover:bg-terracotta-500 hover:text-white transition-colors duration-200">
                            继续编辑
                          </button>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="p-4">
                        <h3 className="font-bold text-base text-warm-900 mb-1 group-hover:text-terracotta-600 transition-colors truncate">
                          {resume.title}
                        </h3>
                        <p className="text-xs text-warm-500 mb-3">
                          基于 <span className="font-medium text-warm-600">{resume.templateName}</span> 模板
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-warm-100">
                          <div className="flex items-center gap-1.5 text-xs text-warm-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{new Date(resume.updatedAt).toLocaleDateString('zh-CN')}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => navigate(`/resumes/${resume.id}/edit`)}
                            className="flex-1 py-2 bg-warm-50 hover:bg-terracotta-50 text-warm-700 hover:text-terracotta-600 rounded-lg text-xs font-medium transition-all duration-200 border border-warm-200 hover:border-terracotta-200"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => navigate(`/resumes/${resume.id}/edit`)}
                            className="flex-1 py-2 bg-warm-50 hover:bg-warm-100 text-warm-700 rounded-lg text-xs font-medium transition-all duration-200 border border-warm-200"
                          >
                            预览
                          </button>
                          <button
                            onClick={() => handleDelete(resume.id, resume.title)}
                            className="px-3 py-2 bg-warm-50 hover:bg-red-50 text-warm-500 hover:text-red-500 rounded-lg text-xs font-medium transition-all duration-200 border border-warm-200 hover:border-red-200"
                            title="删除"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-warm-100 p-12 text-center">
                <div className="w-16 h-16 bg-warm-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-warm-800 mb-2">未找到匹配的简历</h3>
                <p className="text-sm text-warm-500 mb-4">尝试调整搜索关键词</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium transition-colors"
                >
                  清除搜索
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            description="还没有简历，开始创建吧"
            actionLabel="创建简历"
            onAction={() => navigate('/templates')}
          />
        )}
      </div>
    </main>
  )
}
