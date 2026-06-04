/**
 * ProjectsBlock - 项目经历列表
 * 项目名 + 角色 + 描述
 */

import type { BlockRouterProps } from '../BlockRouter'

interface ProjectsBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Projects
}

export default function ProjectsBlock({ data, theme }: ProjectsBlockProps) {
  const projects = data.projectExperience

  if (!projects || projects.length === 0) return null

  return (
    <section className="mb-4" aria-label="项目经历">
      <h2
        className="font-semibold uppercase tracking-wide mb-3"
        style={{
          fontSize: theme.fontSize.heading,
          color: theme.colors.primary,
        }}
      >
        项目经历
      </h2>
      <div className="space-y-3">
        {projects.map((proj) => (
          <article key={proj.id} className="relative pl-4 border-l-2" style={{ borderColor: theme.colors.border }}>
            <h3
              className="font-semibold"
              style={{ fontSize: theme.fontSize.subheading, color: theme.colors.text }}
            >
              {proj.name}
            </h3>
            <p style={{ fontSize: theme.fontSize.small, color: theme.colors.textSecondary }}>
              {proj.role} · {proj.startDate} — {proj.endDate}
            </p>
            {proj.description && (
              <p
                className="mt-1"
                style={{ fontSize: theme.fontSize.body, color: theme.colors.text, lineHeight: 1.5, whiteSpace: 'pre-line' }}
              >
                {proj.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
