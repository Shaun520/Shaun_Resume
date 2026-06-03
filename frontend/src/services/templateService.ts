import apiClient from './apiClient'
import type { Template, TemplateListResponse } from '../types/template'

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
}
