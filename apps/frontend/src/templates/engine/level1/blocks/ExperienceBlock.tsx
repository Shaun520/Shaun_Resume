/**
 * ExperienceBlock - 工作经历列表
 * 公司 + 职位 + 时间段 + 描述
 */

import type { BlockRouterProps } from '../BlockRouter'

interface ExperienceBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Experience
}

export default function ExperienceBlock({ data, theme }: ExperienceBlockProps) {
  const experiences = data.workExperience

  if (!experiences || experiences.length === 0) return null

  return (
    <section className="mb-4" aria-label="工作经历">
      <h2
        className="font-semibold uppercase tracking-wide mb-3"
        style={{
          fontSize: theme.fontSize.heading,
          color: theme.colors.primary,
        }}
      >
        工作经历
      </h2>
      <div className="space-y-3">
        {experiences.map((exp) => (
          <article key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: theme.colors.border }}>
            <h3
              className="font-semibold"
              style={{ fontSize: theme.fontSize.subheading, color: theme.colors.text }}
            >
              {exp.position}
            </h3>
            <p style={{ fontSize: theme.fontSize.small, color: theme.colors.textSecondary }}>
              {exp.company} · {exp.startDate} — {exp.endDate}
            </p>
            {exp.description && (
              <p
                className="mt-1"
                style={{ fontSize: theme.fontSize.body, color: theme.colors.text, lineHeight: 1.5, whiteSpace: 'pre-line' }}
              >
                {exp.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
