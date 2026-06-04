import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import BasicInfoForm from './BasicInfoForm'
import EducationForm from './EducationForm'
import WorkForm from './WorkForm'
import ProjectForm from './ProjectForm'
import SkillsForm from './SkillsForm'
import type { ResumeContent, BasicInfo } from '../../types/resume'

interface EditorTabsProps {
  content: ResumeContent
  onUpdateBasic: (data: Partial<BasicInfo>) => void
  onUpdateEducation: (data: ResumeContent['education']) => void
  onUpdateWork: (data: ResumeContent['workExperience']) => void
  onUpdateProjects: (data: ResumeContent['projectExperience']) => void
  onUpdateSkills: (data: ResumeContent['skills']) => void
  /** 桌面端使用完整中文标签；移动端使用短标签 */
  variant: 'desktop' | 'mobile'
}

/** 编辑器表单 Tabs 抽象：桌面与移动端共用，仅标签文案不同 */
export default function EditorTabs({
  content,
  onUpdateBasic,
  onUpdateEducation,
  onUpdateWork,
  onUpdateProjects,
  onUpdateSkills,
  variant,
}: EditorTabsProps) {
  const labels = variant === 'desktop'
    ? { basic: '基本信息', education: '教育经历', work: '工作经历', projects: '项目经历', skills: '技能列表' }
    : { basic: '基本信息', education: '教育', work: '工作', projects: '项目', skills: '技能' }

  const items: TabsProps['items'] = [
    {
      key: 'basic',
      label: labels.basic,
      children: <BasicInfoForm data={content.basicInfo} onChange={onUpdateBasic} />,
    },
    {
      key: 'education',
      label: labels.education,
      children: <EducationForm data={content.education} onChange={onUpdateEducation} />,
    },
    {
      key: 'work',
      label: labels.work,
      children: <WorkForm data={content.workExperience} onChange={onUpdateWork} />,
    },
    {
      key: 'projects',
      label: labels.projects,
      children: <ProjectForm data={content.projectExperience} onChange={onUpdateProjects} />,
    },
    {
      key: 'skills',
      label: labels.skills,
      children: <SkillsForm data={content.skills} onChange={onUpdateSkills} />,
    },
  ]

  return <Tabs defaultActiveKey="basic" items={items} />
}
