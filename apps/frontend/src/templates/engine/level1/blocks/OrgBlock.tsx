/**
 * OrgBlock - 社团/组织经历列表
 * 组织 + 职务 + 时间段 + 描述
 */
import type { BlockRouterProps } from '../BlockRouter'
import { BlockType } from '../../interfaces'
import SectionHeading from './SectionHeading'

interface OrgBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.OrgExperience
}

export default function OrgBlock({ data, theme }: OrgBlockProps) {
  const orgs = data.orgExperience

  if (!orgs || orgs.length === 0) return null

  return (
    <section className="mb-4" aria-label="社团/组织经历">
      <SectionHeading title="社团/组织经历" type={BlockType.OrgExperience} theme={theme} />
      <div className="space-y-3">
        {orgs.map((org) => (
          <article key={org.id}>
            <h3 className="font-semibold" style={{ fontSize: theme.fontSize.subheading, color: theme.colors.text }}>
              {org.org}
            </h3>
            <p style={{ fontSize: theme.fontSize.small, color: theme.colors.textSecondary }}>
              {org.role} · {org.startDate} — {org.endDate}
            </p>
            {org.description && (
              <p
                className="mt-1"
                style={{ fontSize: theme.fontSize.body, color: theme.colors.text, lineHeight: 1.5, whiteSpace: 'pre-line' }}
              >
                {org.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}