import { useNavigate } from 'react-router-dom'
import type { ResumeListItem } from '../../types/resume'

const TEMPLATE_COLORS: Record<string, string> = {
  classic: '#C65D3B',
  modern: '#4A7C59',
  minimal: '#5B8FAF',
}

interface ResumeCardProps {
  resume: ResumeListItem
  onEdit: (id: string) => void
  onDelete: (id: string, title: string) => void
}

/** 简历卡片组件：缩略图、标题、编辑时间、操作按钮 */
export default function ResumeCard({ resume, onEdit, onDelete }: ResumeCardProps) {
  const navigate = useNavigate()
  const color = TEMPLATE_COLORS[resume.templateId] || '#C65D3B'

  const handleCardClick = () => {
    navigate(`/resumes/${resume.id}/edit`)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(resume.id)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(resume.id, resume.title)
  }

  return (
    <article
      className="group bg-white rounded-xl border border-warm-100 overflow-hidden hover:shadow-lg hover:border-terracotta-200 transition-all duration-300 focus-within:ring-2 focus-within:ring-terracotta-300"
      role="article"
      aria-label={`简历：${resume.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* Preview Area */}
      <div
        className="relative h-48 p-4 overflow-hidden cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${color}12, ${color}22)`,
        }}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`编辑简历：${resume.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick()
          }
        }}
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
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
          aria-hidden="true"
        >
          <button
            className="px-5 py-2 bg-white text-warm-900 rounded-lg text-sm font-semibold shadow-lg hover:bg-terracotta-500 hover:text-white transition-colors duration-200"
            tabIndex={-1}
          >
            继续编辑
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3
          className="font-bold text-base text-warm-900 mb-1 group-hover:text-terracotta-600 transition-colors truncate"
          aria-label={`简历标题：${resume.title}`}
        >
          {resume.title}
        </h3>
        <p className="text-xs text-warm-500 mb-3">
          基于{' '}
          <span className="font-medium text-warm-600">{resume.templateName}</span>{' '}
          模板
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-warm-100">
          <time
            className="flex items-center gap-1.5 text-xs text-warm-400"
            dateTime={resume.updatedAt}
            aria-label={`最后编辑时间：${new Date(resume.updatedAt).toLocaleDateString('zh-CN')}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{new Date(resume.updatedAt).toLocaleDateString('zh-CN')}</span>
          </time>

          {/* Action Buttons - 始终显示 */}
          <nav className="flex gap-1.5" aria-label="简历操作">
            <button
              onClick={handleEditClick}
              className="p-1.5 text-warm-400 hover:text-terracotta-600 rounded-md hover:bg-terracotta-50 transition-all duration-200"
              aria-label={`编辑简历 ${resume.title}`}
              title="编辑"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1.5 text-warm-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-all duration-200"
              aria-label={`删除简历 ${resume.title}`}
              title="删除"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </article>
  )
}
