/**
 * HonorsBlock - 荣誉奖项列表
 * 奖项标题 + 等级/日期 + 描述
 */
import type { BlockRouterProps } from '../BlockRouter'
import { BlockType } from '../../interfaces'
import SectionHeading from './SectionHeading'

interface HonorsBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Honors
}

export default function HonorsBlock({ data, theme }: HonorsBlockProps) {
  const honors = data.honors

  if (!honors || honors.length === 0) return null

  return (
    <section className="mb-4" aria-label="荣誉奖项">
      <SectionHeading title="荣誉奖项" type={BlockType.Honors} theme={theme} />
      <ul className="space-y-2">
        {honors.map((honor) => (
          <li key={honor.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <span className="font-semibold" style={{ fontSize: theme.fontSize.subheading, color: theme.colors.text }}>
                {honor.title}
              </span>
              {(honor.date || honor.level) && (
                <span style={{ fontSize: theme.fontSize.small, color: theme.colors.textSecondary }}>
                  {[honor.date, honor.level].filter(Boolean).join(' · ')}
                </span>
              )}
            </div>
            {honor.description && (
              <p
                style={{ fontSize: theme.fontSize.body, color: theme.colors.text, lineHeight: 1.5, whiteSpace: 'pre-line' }}
              >
                {honor.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}