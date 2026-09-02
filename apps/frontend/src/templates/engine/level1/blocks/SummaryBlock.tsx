/**
 * SummaryBlock - 个人简介文本块
 */

import type { BlockRouterProps } from '../BlockRouter'
import { BlockType } from '../../interfaces'
import SectionHeading from './SectionHeading'

interface SummaryBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Summary
}

export default function SummaryBlock({ data, theme }: SummaryBlockProps) {
  const { summary } = data.basicInfo

  if (!summary) return null

  return (
    <section className="mb-4" aria-label="个人简介">
      <SectionHeading title="个人简介" type={BlockType.Summary} theme={theme} mb="mb-2" />
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
