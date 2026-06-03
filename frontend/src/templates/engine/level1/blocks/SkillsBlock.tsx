/**
 * SkillsBlock - 技能标签云
 * 名称 + 熟练度可选展示
 */

import type { BlockRouterProps } from '../BlockRouter'

interface SkillsBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Skills
}

export default function SkillsBlock({ data, theme }: SkillsBlockProps) {
  const skills = data.skills

  if (!skills || skills.length === 0) return null

  return (
    <section className="mb-4" aria-label="专业技能">
      <h2
        className="font-semibold uppercase tracking-wide mb-3"
        style={{
          fontSize: theme.fontSize.heading,
          color: theme.colors.primary,
        }}
      >
        专业技能
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.text,
              fontSize: theme.fontSize.small,
            }}
          >
            {skill.name}
            {skill.proficiency && (
              <span className="ml-1 opacity-70">({skill.proficiency})</span>
            )}
          </span>
        ))}
      </div>
    </section>
  )
}
