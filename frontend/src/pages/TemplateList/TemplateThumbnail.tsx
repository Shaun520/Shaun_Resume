import { useEffect, useRef, useState } from 'react'
import TemplateRenderer from '../../templates/engine/TemplateRenderer'
import { registerBuiltInTemplates } from '../../templates/engine/level1'
import { SAMPLE_RESUME_DATA } from '../ResumeEditor/sampleData'
import type { Template } from '../../types/template'

interface TemplateThumbnailProps {
  template: Template
}

// A4 在 96dpi 下的像素尺寸（210mm x 297mm）
const A4_WIDTH = 793
const A4_HEIGHT = 1122
// 内容放大系数：在 fill 宽度的基础上再放大，让模板文字看起来更清晰易读
const ZOOM = 1.8

/**
 * 模板缩略图：用真实示例数据驱动 TemplateRenderer 渲染整张 A4 简历，
 * 按宽度 fill 到卡片预览区，高度按 A4 比例等比缩放后裁剪显示顶部内容。
 * 用户不需要看到全部内容，只要内容充满预览区即可。
 */
export default function TemplateThumbnail({ template }: TemplateThumbnailProps) {
  const [ready, setReady] = useState(false)
  const [cardWidth, setCardWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerBuiltInTemplates()
    setReady(true)
  }, [])

  // 监听父容器宽度，缩略图按宽度 fill
  useEffect(() => {
    const el = containerRef.current?.parentElement
    if (!el) return

    const updateWidth = () => {
      setCardWidth(el.clientWidth)
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ready])

  // 缩放比例 = 卡片宽度 / A4 宽度，再乘以放大系数让内容更清晰
  const scale = cardWidth > 0 ? (cardWidth / A4_WIDTH) * ZOOM : 0
  // 缩放后的视觉高度（会被卡片预览区高度裁剪）
  const visualHeight = A4_HEIGHT * scale

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ overflow: 'hidden', pointerEvents: 'none' }}
    >
      {ready && cardWidth > 0 && (
        <div
          style={{
            width: '100%',
            height: visualHeight,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <TemplateRenderer
            templateId={template.schemaKey}
            data={SAMPLE_RESUME_DATA}
            ctx={{ scale }}
          />
        </div>
      )}
    </div>
  )
}
