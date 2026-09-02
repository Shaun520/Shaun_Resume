import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import BasicInfoForm from './BasicInfoForm'
import EducationForm from './EducationForm'
import WorkForm from './WorkForm'
import ProjectForm from './ProjectForm'
import SkillsForm from './SkillsForm'
import OrgForm from './OrgForm'
import HonorsForm from './HonorsForm'
import type { ResumeContent, BasicInfo } from '../../types/resume'

interface EditorTabsProps {
  content: ResumeContent
  onUpdateBasic: (data: Partial<BasicInfo>) => void
  onUpdateEducation: (data: ResumeContent['education']) => void
  onUpdateWork: (data: ResumeContent['workExperience']) => void
  onUpdateProjects: (data: ResumeContent['projectExperience']) => void
  onUpdateSkills: (data: ResumeContent['skills']) => void
  onUpdateOrg: (data: ResumeContent['orgExperience']) => void
  onUpdateHonors: (data: ResumeContent['honors']) => void
  /** 桌面端使用完整中文标签；移动端使用短标签 */
  variant: 'desktop' | 'mobile'
  /** AI 优化服务是否可用 */
  aiAvailable?: boolean
  /** 当前简历 ID（用于 OSS 上传路径） */
  resumeId?: string
}

/** 编辑器表单 Tabs 抽象：桌面与移动端共用，仅标签文案不同 */
export default function EditorTabs({
  content,
  onUpdateBasic,
  onUpdateEducation,
  onUpdateWork,
  onUpdateProjects,
  onUpdateSkills,
  onUpdateOrg,
  onUpdateHonors,
  variant,
  aiAvailable = false,
  resumeId,
}: EditorTabsProps) {
  const labels = variant === 'desktop'
    ? { basic: '基本信息', education: '教育经历', work: '工作经历', projects: '项目经历', skills: '技能列表', org: '社团/组织', honors: '荣誉奖项' }
    : { basic: '基本信息', education: '教育', work: '工作', projects: '项目', skills: '技能', org: '社团', honors: '荣誉' }

  const items: TabsProps['items'] = [
    {
      key: 'basic',
      label: labels.basic,
      children: <BasicInfoForm data={content.basicInfo} onChange={onUpdateBasic} resumeId={resumeId} aiAvailable={aiAvailable} />,
    },
    {
      key: 'education',
      label: labels.education,
      children: <EducationForm data={content.education} onChange={onUpdateEducation} />,
    },
    {
      key: 'work',
      label: labels.work,
      children: <WorkForm data={content.workExperience} onChange={onUpdateWork} aiAvailable={aiAvailable} />,
    },
    {
      key: 'projects',
      label: labels.projects,
      children: <ProjectForm data={content.projectExperience} onChange={onUpdateProjects} aiAvailable={aiAvailable} />,
    },
    {
      key: 'skills',
      label: labels.skills,
      children: <SkillsForm data={content.skills} onChange={onUpdateSkills} />,
    },
    {
      key: 'org',
      label: labels.org,
      children: <OrgForm data={content.orgExperience} onChange={onUpdateOrg} />,
    },
    {
      key: 'honors',
      label: labels.honors,
      children: <HonorsForm data={content.honors} onChange={onUpdateHonors} />,
    },
  ]

  return <Tabs defaultActiveKey="basic" items={items} />
}
