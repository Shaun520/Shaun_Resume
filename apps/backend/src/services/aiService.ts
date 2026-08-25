import { AppError } from '../middleware/errorHandler.js'
import type { OptimizationSuggestion, OptimizeRequest, OptimizeResponse } from '@shaun-resume/shared'

const AI_API_KEY = process.env.AI_API_KEY ?? ''
const AI_API_URL = process.env.AI_API_URL ?? 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const AI_MODEL = process.env.AI_MODEL ?? 'deepseek-v4-flash'

/** 检查 AI 服务是否可用（API Key 已配置） */
export function isAiAvailable(): boolean {
  return AI_API_KEY.length > 0
}

/** 字段上下文到中文提示的映射 */
const contextLabels: Record<string, string> = {
  summary: '个人简介',
  workDescription: '工作经历描述',
  projectDescription: '项目经历描述',
  education: '教育经历描述',
  other: '文本内容',
}

function getContextLabel(context: string): string {
  return contextLabels[context] ?? contextLabels['other'] ?? ''
}

/** 构建 AI 优化的系统提示 */
function buildSystemPrompt(context: string): string {
  const label = getContextLabel(context)
  return `你是一位专业的简历优化顾问。用户会提供一段简历中的${label}，请提供 3 个优化版本。
要求：
1. 每个版本应比原文更专业、更有吸引力
2. 使用 STAR 法则（情境-任务-行动-结果）优化描述
3. 尽量量化成果，使用具体数据和指标
4. 语言简洁有力，避免空洞表述
5. 三个版本风格应有差异：一个保守优化、一个中等优化、一个大胆优化

请严格按以下 JSON 格式返回，不要包含任何其他文字：
[{"index":0,"text":"优化版本1","label":"保守优化"},{"index":1,"text":"优化版本2","label":"中等优化"},{"index":2,"text":"优化版本3","label":"大胆优化"}]`
}

/** 调用第三方 AI API 获取优化建议 */
export async function optimizeText(params: OptimizeRequest): Promise<OptimizeResponse> {
  if (!isAiAvailable()) {
    throw new AppError(503, 'AI 优化服务暂不可用，请稍后重试')
  }

  const { text, context } = params

  if (!text || text.trim().length === 0) {
    throw new AppError(400, '请提供需要优化的文本内容')
  }

  if (text.length > 2000) {
    throw new AppError(400, '文本内容过长，请选择 2000 字以内的内容进行优化')
  }

  const systemPrompt = buildSystemPrompt(context)

  const response = await fetch(AI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'unknown error')
    console.error(`AI API error: ${response.status} - ${errorBody}`)
    throw new AppError(502, 'AI 服务请求失败，请稍后重试')
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new AppError(502, 'AI 服务返回格式异常')
  }

  const suggestions = parseAiResponse(content)

  return {
    suggestions,
    original: text,
  }
}

/** 解析 AI 返回的 JSON 内容 */
function parseAiResponse(content: string): OptimizationSuggestion[] {
  try {
    // 尝试提取 JSON 数组（AI 可能在 JSON 前后添加额外文字）
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('未找到有效的 JSON 数组')
    }

    const parsed = JSON.parse(jsonMatch[0]) as OptimizationSuggestion[]

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('AI 返回的建议列表为空')
    }

    return parsed.slice(0, 3).map((item, index) => ({
      index,
      text: String(item.text ?? ''),
      label: String(item.label ?? `优化版本 ${index + 1}`),
    }))
  } catch (err) {
    console.error('Failed to parse AI response:', err)
    throw new AppError(502, 'AI 返回内容解析失败，请重试')
  }
}
