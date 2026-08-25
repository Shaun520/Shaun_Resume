/**
 * 共享 AI 类型：前端与后端共用的 AI 优化相关接口
 */
export interface OptimizationSuggestion {
  index: number
  text: string
  label: string
}

export interface OptimizeRequest {
  text: string
  context: string
}

export interface OptimizeResponse {
  suggestions: OptimizationSuggestion[]
  original: string
}

export interface AiStatusResponse {
  available: boolean
}