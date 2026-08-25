import { useState, useEffect, useCallback } from 'react'
import { App, Tag, Modal, Spin } from 'antd'
import { templateService } from '../../services/templateService'
import EmptyState from '../../components/Common/EmptyState'
import type { TemplateSubmission } from '../../types/template'

const STATUS_LABELS: Record<TemplateSubmission['status'], string> = {
  pending: '审核中',
  approved: '已通过',
  rejected: '已驳回',
}

const STATUS_COLORS: Record<TemplateSubmission['status'], string> = {
  pending: '#D97706',
  approved: '#15803D',
  rejected: '#B91C1C',
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface SubmissionsPanelProps {
  /** 切换到提交 tab 的回调（用于"去提交"按钮） */
  onSwitchToSubmit?: () => void
}

/** 我的提交面板：列表 + 详情弹窗（无外层 <main> 包装） */
export default function SubmissionsPanel({ onSwitchToSubmit }: SubmissionsPanelProps) {
  const { message } = App.useApp()
  const [submissions, setSubmissions] = useState<TemplateSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<TemplateSubmission | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await templateService.getSubmissions()
      setSubmissions(res.items)
    } catch {
      setError('获取提交记录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const openDetail = async (id: string) => {
    setDetailLoading(true)
    try {
      const submission = await templateService.getSubmissionDetail(id)
      setDetail(submission)
    } catch {
      message.error('加载详情失败')
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDetail = () => {
    setDetail(null)
  }

  if (error && !loading) {
    return (
      <div
        className="py-12 flex items-center justify-center"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#FEE2E2' }}
            aria-hidden="true"
          >
            <svg
              className="w-8 h-8"
              style={{ color: '#DC2626' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
            onClick={fetchSubmissions}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2"
            style={{
              background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
            }}
            aria-label="重新加载提交记录"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div
        className="py-16 flex items-center justify-center"
        role="status"
        aria-label="正在加载提交记录"
      >
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  return (
    <>
      {submissions.length === 0 ? (
        <EmptyState
          description="还没有提交过模板"
          actionLabel="去提交"
          onAction={() => onSwitchToSubmit?.()}
        />
      ) : (
        <section
          className="bg-white rounded-xl border border-warm-100 overflow-hidden"
          aria-label="提交记录列表"
        >
          <ul role="list" className="divide-y divide-warm-100">
            {submissions.map((s) => {
              const tags = s.industryTags?.split(',').filter(Boolean) ?? []
              return (
                <li
                  key={s.id}
                  className="p-4 flex items-start gap-4 hover:bg-warm-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-warm-100 border border-warm-200"
                    aria-hidden="true"
                  >
                    {s.thumbnailUrl ? (
                      <img
                        src={s.thumbnailUrl}
                        alt={`${s.name} 缩略图`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-warm-400 text-xs">
                        暂无
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3
                        className="font-bold text-base text-warm-900 truncate"
                        aria-label={`模板名称：${s.name}`}
                      >
                        {s.name}
                      </h3>
                      <Tag
                        color={STATUS_COLORS[s.status]}
                        aria-label={`状态：${STATUS_LABELS[s.status]}`}
                      >
                        {STATUS_LABELS[s.status]}
                      </Tag>
                    </div>
                    <p
                      className="text-xs text-warm-500 line-clamp-2 mb-2"
                      aria-label={s.description ? `描述：${s.description}` : undefined}
                    >
                      {s.description || '暂无描述'}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap text-xs text-warm-500">
                      <span>
                        <span className="text-warm-400">提交于 </span>
                        <time dateTime={s.submittedAt}>{formatTime(s.submittedAt)}</time>
                      </span>
                      {tags.length > 0 && (
                        <span
                          className="flex items-center gap-1 flex-wrap"
                          aria-label="行业标签"
                        >
                          {tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-warm-50 text-warm-500 rounded border border-warm-100"
                            >
                              {t}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => openDetail(s.id)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-terracotta-600 hover:text-terracotta-700 hover:bg-terracotta-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta-300"
                    aria-label={`查看模板 ${s.name} 详情`}
                  >
                    详情
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Detail Modal */}
      <Modal
        open={detail !== null || detailLoading}
        onCancel={closeDetail}
        footer={null}
        title="提交详情"
        destroyOnClose
        aria-label="模板提交详情弹窗"
      >
        {detailLoading && (
          <div className="py-8 flex items-center justify-center" role="status">
            <Spin tip="加载中..." />
          </div>
        )}
        {detail && !detailLoading && (
          <div className="space-y-3 text-sm" role="document">
            <div className="flex items-center gap-2">
              <span className="text-warm-500 w-20">名称</span>
              <span className="font-medium text-warm-900">{detail.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-warm-500 w-20">状态</span>
              <Tag color={STATUS_COLORS[detail.status]}>
                {STATUS_LABELS[detail.status]}
              </Tag>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-warm-500 w-20 flex-shrink-0">描述</span>
              <span className="text-warm-700">{detail.description}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-warm-500 w-20 flex-shrink-0">行业标签</span>
              <span className="text-warm-700">{detail.industryTags || '无'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-warm-500 w-20">提交时间</span>
              <span className="text-warm-700">{formatTime(detail.submittedAt)}</span>
            </div>
            {detail.reviewedAt && (
              <div className="flex items-center gap-2">
                <span className="text-warm-500 w-20">审核时间</span>
                <span className="text-warm-700">{formatTime(detail.reviewedAt)}</span>
              </div>
            )}
            {detail.thumbnailUrl && (
              <div className="pt-2">
                <span className="text-warm-500 block mb-2">缩略图</span>
                <img
                  src={detail.thumbnailUrl}
                  alt={`${detail.name} 缩略图`}
                  className="max-w-full max-h-64 rounded-lg border border-warm-200"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
