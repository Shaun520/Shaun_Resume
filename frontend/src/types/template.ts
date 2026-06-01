export interface Template {
  id: string
  name: string
  description: string
  thumbnailUrl: string
  componentName: string
  industryTags?: string
  supportedFields?: string[]
  createdAt: string
  updatedAt?: string
}

export interface TemplateListResponse {
  items: Template[]
}

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

export interface SubmitTemplateRequest {
  name: string
  description: string
  industryTags?: string
}
