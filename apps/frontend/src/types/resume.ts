import type { ResumeContent } from '@shaun-resume/shared'

export type {
  BasicInfo,
  Education,
  WorkExperience,
  ProjectExperience,
  Skill,
  ResumeContent,
} from '@shaun-resume/shared'

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

/** 简历迁移请求体 */
export interface MigrateResumeRequest {
  targetTemplateId: string
}

/** 简历迁移响应 */
export interface MigrateResumeResponse {
  resume: Resume
  migration: {
    from: { id: string; name: string; schemaKey: string }
    to: { id: string; name: string; schemaKey: string; level: number }
    /** 目标模板不支持、保留在 content 中的字段列表 */
    preservedFields: string[]
    migratedAt: string
  }
}