/**
 * 单栏布局组件
 * 所有区块按顺序垂直排列
 */

import type { ReactNode } from 'react'

interface SingleColumnLayoutProps {
  children: ReactNode
  spacing: number
  padding: { top: number; right: number; bottom: number; left: number }
}

export default function SingleColumnLayout({ children, spacing, padding }: SingleColumnLayoutProps) {
  return (
    <div
      className="flex flex-col"
      style={{
        gap: `${spacing}px`,
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
      }}
      role="presentation"
    >
      {children}
    </div>
  )
}
