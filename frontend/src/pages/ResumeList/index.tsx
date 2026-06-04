import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { App, Spin, Pagination } from 'antd'
import { resumeService } from '../../services/resumeService'
import EmptyState from '../../components/Common/EmptyState'
import ResumeCard from './ResumeCard'
import type { ResumeListItem } from '../../types/resume'

const PAGE_SIZE = 8

export default function ResumeList() {
  const navigate = useNavigate()
  const { modal, message } = App.useApp()
  const [resumes, setResumes] = useState<ResumeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchResumes = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await resumeService.getList({ page: pageNum, pageSize: PAGE_SIZE })
      setResumes(res.items)
      setTotal(res.total)
      setPage(res.page)
    } catch {
      setError('获取简历列表失败，请稍后重试')
      message.error('获取简历列表失败')
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    fetchResumes(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = useCallback((p: number) => {
    fetchResumes(p)
  }, [fetchResumes])

  const handleDelete = useCallback(
    (id: string, title: string) => {
      modal.confirm({
        title: '确认删除',
        content: `确定要删除「${title}」吗？此操作不可撤销。`,
        okText: '删除',
        cancelText: '取消',
        okButtonProps: { danger: true },
        autoFocusButton: 'cancel',
        onOk() {
          return resumeService.delete(id).then(() => {
            message.success('删除成功')
            fetchResumes(page)
          }).catch(() => {
            message.error('删除失败，请稍后重试')
          })
        },
      })
    },
    [modal, message, fetchResumes, page],
  )

  const handleEdit = useCallback((id: string) => {
    navigate(`/resumes/${id}/edit`)
  }, [navigate])

  const filteredResumes = resumes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.templateName.toLowerCase().includes(searchQuery.toLowerCase()),
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
            onClick={() => fetchResumes(page)}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
            }}
            aria-label="重新加载简历列表"
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
      aria-label="我的简历列表页"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-warm-900 mb-1">
              我的简历
            </h1>
            <p className="text-sm text-warm-500">管理你创建的所有简历</p>
          </div>
          <button
            onClick={() => navigate('/templates')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2"
            style={{
              background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
            }}
            aria-label="创建新简历"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建简历
          </button>
        </header>

        {resumes.length > 0 ? (
          <>
            {/* Search Bar */}
            <section className="bg-white rounded-xl shadow-sm border border-warm-100 p-4 mb-6" aria-label="搜索栏">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <label htmlFor="resume-search" className="sr-only">
                    搜索简历
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
                    id="resume-search"
                    type="text"
                    placeholder="搜索简历名称或模板..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:border-terracotta-300 focus:ring-2 focus:ring-terracotta-100 transition-all duration-200"
                    aria-label="按名称或模板搜索简历"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-3 pt-3 border-t border-warm-100 flex items-center justify-between">
                <span className="text-xs text-warm-500" role="status" aria-live="polite">
                  共{' '}
                  <span className="font-semibold text-terracotta-600">{filteredResumes.length}</span> 份简历（总计{' '}
                  <span className="font-semibold">{total}</span> 份）
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors focus:outline-none focus:underline"
                    aria-label="清除搜索关键词"
                  >
                    清除搜索
                  </button>
                )}
              </div>
            </section>

            {/* Resumes Grid */}
            {filteredResumes.length > 0 ? (
              <>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  role="list"
                  aria-label="简历列表"
                >
                  {filteredResumes.map((resume) => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {total > PAGE_SIZE && (
                  <nav className="flex justify-center mt-8" aria-label="分页导航">
                    <Pagination
                      current={page}
                      total={total}
                      pageSize={PAGE_SIZE}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(t) => `共 ${t} 份`}
                    />
                  </nav>
                )}
              </>
            ) : (
              <div
                className="bg-white rounded-xl border border-warm-100 p-12 text-center"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-warm-800 mb-2">
                  未找到匹配的简历
                </h3>
                <p className="text-sm text-warm-500 mb-4">尝试调整搜索关键词</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium transition-colors focus:outline-none focus:underline"
                  aria-label="清除搜索并查看全部简历"
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
