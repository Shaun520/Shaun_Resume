/**
 * EducationBlock - 教育背景列表
 * 学校 + 专业 + 学历 + 时间
 */

import type { BlockRouterProps } from '../BlockRouter'

interface EducationBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Education
}

export default function EducationBlock({ data , theme }: EducationBlockProps) {
  const educations = data.education

  if (!educations || educations.length === 0) return null

  return (
    <section className="mb-4" aria-label="教育背景">
      <h2
        className="font-semibold uppercase tracking-wide mb-3"
        style={{
          fontSize: theme.fontSize.heading,
          color: theme.colors.primary,
        }}
      >
        教育背景
      </h2>
      <div className="space-y-3">
        {educations.map((edu) => (
          <article key={edu.id}>
            <h3
              className="font-semibold"
              style={{ fontSize: theme.fontSize.subheading, color: theme.colors.text }}
            >
              {edu.school}
            </h3>
            <p style={{ fontSize: theme.fontSize.small, color: theme.colors.textSecondary }}>
              {edu.major} · {edu.degree} · {edu.startDate} — {edu.endDate}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
