import apiClient from './apiClient'
import type {
  Template,
  TemplateListResponse,
  TemplateSubmission,
  TemplateSubmissionListResponse,
  SubmitTemplateResponse,
} from '../types/template'

/** 模板相关 API 调用 */
export const templateService = {
  /** 获取模板列表 */
  async getList(params?: { status?: string; level?: number; industry?: string }): Promise<TemplateListResponse> {
    const res = await apiClient.get<TemplateListResponse>('/templates', { params })
    return res.data
  },

  /** 获取模板详情 */
  async getDetail(id: string): Promise<Template> {
    const res = await apiClient.get<Template>(`/templates/${id}`)
    return res.data
  },

  /**
   * 提交模板
   * Phase 7 暂行策略：提交后服务端自动审核通过，立即返回 status=approved
   */
  async submit(payload: {
    name: string
    description: string
    level: 2 | 3
    industryTags?: string
    file: File
    thumbnail: File
  }): Promise<SubmitTemplateResponse> {
    const formData = new FormData()
    formData.append('name', payload.name)
    formData.append('description', payload.description)
    formData.append('level', String(payload.level))
    if (payload.industryTags) {
      formData.append('industryTags', payload.industryTags)
    }
    formData.append('file', payload.file)
    formData.append('thumbnail', payload.thumbnail)

    const res = await apiClient.post<SubmitTemplateResponse>('/templates/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /** 获取当前用户的模板提交列表 */
  async getSubmissions(params?: {
    status?: 'pending' | 'approved' | 'rejected'
  }): Promise<TemplateSubmissionListResponse> {
    const res = await apiClient.get<TemplateSubmissionListResponse>('/templates/submissions', {
      params,
    })
    return res.data
  },

  /** 获取单个模板提交详情 */
  async getSubmissionDetail(id: string): Promise<TemplateSubmission> {
    const res = await apiClient.get<TemplateSubmission>(`/templates/submissions/${id}`)
    return res.data
  },
}
