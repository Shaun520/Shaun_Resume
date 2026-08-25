/** 模板级别 */
export type TemplateLevel = 1 | 2 | 3

/** 模板实体（来自后端 API） */
export interface Template {
  id: string
  name: string
  description: string
  thumbnailUrl: string
  schemaKey: string       // L1 Schema 配置标识（如 classic/modern/minimal）
  level: TemplateLevel    // 1=内置Schema, 2=插件包, 3=HTML模板
  industryTags?: string
  supportedFields?: string[]
  createdAt: string
  updatedAt?: string
}

export interface TemplateListResponse {
  items: Template[]
}

/** 模板提交记录 */
export interface TemplateSubmission {
  id: string
  name: string
  description: string
  fileUrl: string
  thumbnailUrl?: string
  industryTags?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
}

export interface TemplateSubmissionListResponse {
  items: TemplateSubmission[]
}

export interface SubmitTemplateRequest {
  name: string
  description: string
  level: TemplateLevel
  industryTags?: string
  file: File
  thumbnail: File
}

export interface SubmitTemplateResponse {
  id: string
  name: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt: string | null
  templateId: string
}
