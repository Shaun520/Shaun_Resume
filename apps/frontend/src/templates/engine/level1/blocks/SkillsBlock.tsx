/**
 * SkillsBlock - 技能标签云
 * 名称 + 熟练度可选展示
 */

import type { BlockRouterProps } from '../BlockRouter'
import { BlockType } from '../../interfaces'
import SectionHeading from './SectionHeading'

interface SkillsBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Skills
}

export default function SkillsBlock({ data, theme }: SkillsBlockProps) {
  const skills = data.skills

  if (!skills || skills.length === 0) return null

  return (
    <section className="mb-4" aria-label="专业技能">
      <SectionHeading title="专业技能" type={BlockType.Skills} theme={theme} />
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
