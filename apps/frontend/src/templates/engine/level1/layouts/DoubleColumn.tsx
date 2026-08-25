/**
 * 双栏布局组件
 * 左侧固定宽度，右侧自适应
 */

import type { ReactNode } from 'react'

interface DoubleColumnLayoutProps {
  leftChildren: ReactNode
  rightChildren: ReactNode
  spacing: number
  padding: { top: number; right: number; bottom: number; left: number }
  leftRatio?: number
}

export default function DoubleColumnLayout({
  leftChildren,
  rightChildren,
  spacing,
  padding,
  leftRatio = 0.35,
}: DoubleColumnLayoutProps) {
  return (
    <div
      className="flex gap-4"
      style={{
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
        gap: `${spacing}px`,
      }}
      role="presentation"
    >
      <div
        className="flex-shrink-0"
        style={{ width: `${leftRatio * 100}%` }}
        role="region"
        aria-label="左侧栏"
      >
        {leftChildren}
      </div>
      <div className="flex-1 min-w-0" role="region" aria-label="右侧栏">
        {rightChildren}
      </div>
    </div>
  )
}
