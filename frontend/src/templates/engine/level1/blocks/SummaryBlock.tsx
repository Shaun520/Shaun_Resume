/**
 * SummaryBlock - 个人简介文本块
 */

import type { BlockRouterProps } from '../BlockRouter'

interface SummaryBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Summary
}

export default function SummaryBlock({ data, theme }: SummaryBlockProps) {
  const { summary } = data.basicInfo

  if (!summary) return null

  return (
    <section className="mb-4" aria-label="个人简介">
      <h2
        className="font-semibold uppercase tracking-wide mb-2"
        style={{
          fontSize: theme.fontSize.heading,
          color: theme.colors.primary,
        }}
      >
        个人简介
      </h2>
      <p
        style={{
          fontSize: theme.fontSize.body,
          color: theme.colors.text,
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
        }}
      >
        {summary}
      </p>
    </section>
  )
}
