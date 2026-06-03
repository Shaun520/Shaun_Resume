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

export interface Resume {
  id: string
  title: string
  templateId: string
  templateName?: string
  schemaKey?: string
  createdAt: string
  updatedAt: string
  content?: ResumeContent
}

export interface ResumeListItem {
  id: string
  title: string
  templateId: string
  templateName: string
  createdAt: string
  updatedAt: string
}

export interface ResumeListResponse {
  items: ResumeListItem[]
  total: number
  page: number
  pageSize: number
}

export interface CreateResumeRequest {
  title: string
  templateId: string
}

export interface UpdateResumeRequest {
  title?: string
  templateId?: string
}
