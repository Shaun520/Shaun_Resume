/**
 * TemplateRenderer - 统一渲染入口
 * 根据 template.level 分发到对应渲染器，提供统一的 render(data) → ReactElement 接口
 */

import { useRef, useEffect, useState } from 'react'
import type { ITemplate, ResumeContent, RenderContext, Level1Template } from './interfaces'
import { templateRegistry } from './TemplateRegistry'
import SchemaRenderer from './level1/SchemaRenderer'

import { calculatePagination } from '../../utils/pagination'

interface TemplateRendererProps {
  templateId: string
  data: ResumeContent
  ctx?: RenderContext
  onPageChange?: (pageIndex: number) => void
}

export default function TemplateRenderer({ templateId, data, ctx = {}, onPageChange }: TemplateRendererProps) {
  const [template, setTemplate] = useState<ITemplate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pageBreaks, setPageBreaks] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const t = templateRegistry.get(templateId)
      if (!t) {
        setError(`模板 "${templateId}" 未找到`)
        return
      }
      setTemplate(t)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载模板失败')
    }
  }, [templateId])

  // 分页线检测：仅依赖 templateId 和 ctx.width，内容变化由 ResizeObserver 自动检测
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const observer = new ResizeObserver(() => {
      const info = calculatePagination(container.scrollHeight)
      setPageBreaks(info.pageBreaks)
      if (info.pageCount > 1 && onPageChange) {
        onPageChange(info.pageCount)
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [templateId, ctx.width, onPageChange])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 p-8" role="alert">
        <p>{error}</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center h-full animate-pulse" aria-label="加载中">
        <span className="text-gray-400">加载模板...</span>
      </div>
    )
  }

  // Level 1: Schema 驱动渲染
  if (template.level === 1) {
    const level1Template = template as Level1Template
    return (
      <div ref={containerRef} className="relative overflow-auto">
        <SchemaRenderer schema={level1Template.schema} data={data} ctx={ctx} />
        {/* 分页线指示器 */}
        {pageBreaks.length > 0 && (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {pageBreaks.map((pos, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t-2 border-dashed border-red-400 opacity-50"
                style={{ top: pos }}
              >
                <span className="text-xs text-red-400 bg-white/80 px-1 rounded">
                  第 {i + 2} 页
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Level 2 / Level 3: 直接调用 render 方法（预留）
  return (
    <div ref={containerRef} className="overflow-auto">
      {template.render(data, ctx)}
    </div>
  )
}

/* eslint-disable react-refresh/only-export-components */
/** 静态方法：直接渲染指定模板 */
export function renderTemplate(templateId: string, data: ResumeContent, ctx?: RenderContext): React.ReactNode {
  const template = templateRegistry.get(templateId)
  if (!template) return null

  if (template.level === 1) {
    const level1Template = template as Level1Template
    return <SchemaRenderer schema={level1Template.schema} data={data} ctx={ctx ?? {}} />
  }

  return template.render(data, ctx ?? {})
}
