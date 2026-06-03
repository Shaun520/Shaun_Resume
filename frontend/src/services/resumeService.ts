import apiClient from './apiClient'
import type {
  Resume,
  ResumeListResponse,
  CreateResumeRequest,
  UpdateResumeRequest,
  ResumeContent,
} from '../types/resume'

/** 简历相关 API 调用 */
export const resumeService = {
  /** 创建简历 */
  async create(data: CreateResumeRequest): Promise<Resume> {
    const res = await apiClient.post<Resume>('/resumes', data)
    return res.data
  },

  /** 获取简历列表 */
  async getList(params?: { page?: number; pageSize?: number }): Promise<ResumeListResponse> {
    const res = await apiClient.get<ResumeListResponse>('/resumes', { params })
    return res.data
  },

  /** 获取简历详情 */
  async getDetail(id: string): Promise<Resume> {
    const res = await apiClient.get<Resume>(`/resumes/${id}`)
    return res.data
  },

  /** 保存简历内容 */
  async saveContent(id: string, content: Partial<ResumeContent>): Promise<{ updatedAt: string }> {
    const res = await apiClient.put<{ updatedAt: string }>(`/resumes/${id}/content`, content)
    return res.data
  },

  /** 更新简历元信息（标题、模板） */
  async updateMeta(id: string, data: UpdateResumeRequest): Promise<Resume> {
    const res = await apiClient.patch<Resume>(`/resumes/${id}`, data)
    return res.data
  },

  /** 删除简历 */
  async delete(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete<{ message: string }>(`/resumes/${id}`)
    return res.data
  },
}
