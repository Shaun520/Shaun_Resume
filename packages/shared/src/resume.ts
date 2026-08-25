/**
 * 共享简历内容领域类型：前端与后端共用的简历内容结构
 */
export interface BasicInfo {
  name: string
  phone: string
  email: string
  address: string
  summary: string
  avatarUrl: string
}

export interface Education {
  id: string
  school: string
  major: string
  degree: string
  startDate: string
  endDate: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface ProjectExperience {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  description: string
}

export interface Skill {
  id: string
  name: string
  proficiency: string
}

export interface ResumeContent {
  basicInfo: BasicInfo
  education: Education[]
  workExperience: WorkExperience[]
  projectExperience: ProjectExperience[]
  skills: Skill[]
}