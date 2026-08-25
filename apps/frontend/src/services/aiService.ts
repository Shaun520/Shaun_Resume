import apiClient from './apiClient'
import type { OptimizeRequest, OptimizeResponse, AiStatusResponse } from '../types/ai'

/** AI 优化相关 API 调用 */
export const aiService = {
  /** 调用 AI 优化文字 */
  async optimize(data: OptimizeRequest): Promise<OptimizeResponse> {
    const res = await apiClient.post<OptimizeResponse>('/ai/optimize', data)
    return res.data
  },

  /** 检查 AI 服务可用性 */
  async getStatus(): Promise<AiStatusResponse> {
    const res = await apiClient.get<AiStatusResponse>('/ai/status')
    return res.data
  },
}
