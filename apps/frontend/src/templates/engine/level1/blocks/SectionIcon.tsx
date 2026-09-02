/**
 * SectionIcon - 内联 SVG 图标 glyph
 * 用于 SectionHeading 的圆形图标装饰（不使用图标字体库，符合宪法）
 */
import type { ReactNode } from 'react'
import type { IconKey } from '../../interfaces'

interface SectionIconProps {
  name: IconKey
  size?: number
  color?: string
  strokeWidth?: number
}

/** 复用原型中已定的 stroke 风格图标 */
const glyphs: Record<IconKey, ReactNode> = {
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-3.8 3.2-6 8-6s8 2.2 8 6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
      <path d="M3 12h18" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.6" />
      <path d="M19 15c2 .8 3 2.3 3 5" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 3h8v4a4 4 0 0 1-8 0z" />
      <path d="M8 5H5a2 2 0 0 0 2 3.5" />
      <path d="M16 5h3a2 2 0 0 1-2 3.5" />
      <path d="M12 11v3" />
      <path d="M9 18h6" />
      <path d="M10 21h4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  lightbulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a5.5 5.5 0 0 0-3.4 9.8c.9.6 1.4 1.3 1.4 2.2h4c0-.9.5-1.6 1.4-2.2A5.5 5.5 0 0 0 12 3z" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </>
  ),
}

export default function SectionIcon({ name, size = 14, color, strokeWidth = 1.8 }: SectionIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[name]}
    </svg>
  )
}