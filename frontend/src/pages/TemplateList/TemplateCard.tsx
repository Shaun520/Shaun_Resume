import type { Template } from '../../types/template'
import TemplateThumbnail from './TemplateThumbnail'

const SCHEMA_KEY_COLORS: Record<string, string> = {
  classic: '#C65D3B',
  modern: '#4A7C59',
  minimal: '#5B8FAF',
}

interface TemplateCardProps {
  template: Template
  onPreview: (template: Template) => void
  onUse: (templateId: string, templateName: string) => void
  isCreating?: boolean
}

/** 模板卡片组件：缩略图、名称、描述、适用行业标签、预览/应用按钮 */
export default function TemplateCard({
  template,
  onPreview,
  onUse,
  isCreating,
}: TemplateCardProps) {
  const color = SCHEMA_KEY_COLORS[template.schemaKey] || '#C65D3B'
  const tags = template.industryTags?.split(',').filter(Boolean) ?? []

  return (
    <article
      className="group bg-white rounded-xl border border-warm-100 overflow-hidden hover:shadow-lg hover:border-terracotta-200 transition-all duration-300 focus-within:ring-2 focus-within:ring-terracotta-300"
      role="article"
      aria-label={`模板：${template.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onPreview(template)
        }
      }}
    >
      {/* Preview Area */}
      <div
        className="relative h-44 overflow-hidden cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${color}15, ${color}25)`,
        }}
        onClick={() => onPreview(template)}
        role="button"
        tabIndex={0}
        aria-label={`预览模板 ${template.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onPreview(template)
          }
        }}
      >
        {/* 真实模板缩略图 */}
        <TemplateThumbnail template={template} />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
          aria-hidden="true"
        >
          <button
            className="px-5 py-2 bg-white text-warm-900 rounded-lg text-sm font-semibold shadow-lg hover:bg-terracotta-500 hover:text-white transition-colors duration-200"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              onPreview(template)
            }}
          >
            预览模板
          </button>
        </div>

      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3
          className="font-bold text-base text-warm-900 mb-1 group-hover:text-terracotta-600 transition-colors truncate"
          aria-label={`模板名称：${template.name}`}
        >
          {template.name}
        </h3>
        <p
          className="text-xs text-warm-500 line-clamp-2 mb-3 leading-relaxed"
          aria-label={template.description ? `描述：${template.description}` : undefined}
        >
          {template.description || '暂无描述'}
        </p>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-3" role="list" aria-label="模板标签">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-warm-50 text-warm-500 rounded border border-warm-100"
              role="listitem"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <nav className="flex items-center justify-between pt-3 border-t border-warm-100" aria-label="模板操作">
          <button
            onClick={() => onPreview(template)}
            className="text-terracotta-600 hover:text-terracotta-700 font-medium text-xs transition-colors focus:outline-none focus:underline"
            aria-label={`预览模板 ${template.name}`}
          >
            预览
          </button>
          <button
            onClick={() => onUse(template.id, template.name)}
            disabled={isCreating}
            className="px-3 py-1.5 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-warm-300 text-white rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            aria-label={`使用模板 ${template.name}${isCreating ? '，正在创建中' : ''}`}
          >
            {isCreating ? '创建中...' : '使用此模板'}
          </button>
        </nav>
      </div>
    </article>
  )
}
