/**
 * 模板引擎核心类型定义
 * 支持 Level 1 (Schema 驱动) / Level 2 (插件包) / Level 3 (HTML 模板)
 */

import type { ResumeContent } from '../../types/resume'
import type { ReactNode } from 'react'

// Re-export for convenience
export type { ResumeContent } from '../../types/resume'



// ==================== Block 类型枚举 ====================

export enum BlockType {
  Header = 'header',
  Summary = 'summary',
  Experience = 'experience',
  Education = 'education',
  Skills = 'skills',
  Projects = 'projects',
}

// ==================== 样式配置类型 ====================

export interface Padding {
  top: number
  right: number
  bottom: number
  left: number
}

export interface FontSizes {
  name: string      // 姓名/标题字号
  heading: string   // 区块标题字号
  subheading: string // 子标题字号
  body: string      // 正文字号
  small: string     // 小字（如日期、标签）
}

export interface ColorPalette {
  primary: string       // 主色
  secondary: string     // 辅助色
  background: string    // 背景色
  text: string          // 主文字色
  textSecondary: string // 次要文字色
  border: string        // 边框色
  accent: string        // 强调色（如技能标签背景）
}

export interface ThemeConfig {
  primaryColor: string
  fontFamily: string
  fontSize: FontSizes
  colors: ColorPalette
}

export interface LayoutConfig {
  mode: 'single' | 'double'
  spacing: number
  padding: Padding
  /** 双栏模式下左侧宽度比例 (0-1) */
  leftRatio?: number
}

export interface BlockStyleConfig {
  padding?: Padding
  marginBottom?: number
  backgroundColor?: string
  borderRadius?: number
}

// ==================== Level 1 Schema 结构 ====================

export interface SectionConfig {
  type: BlockType
  column?: 'left' | 'right'
  visible: boolean
  style?: BlockStyleConfig
}

export interface TemplateSchema {
  id: string
  name: string
  category: string
  layout: LayoutConfig
  theme: ThemeConfig
  sections: SectionConfig[]
}

// ==================== 统一接口 ====================

export interface TemplateMeta {
  id: string
  name: string
  author: string
  category: string
  tags: string[]
  thumbnail: string
  description?: string
  level: 1 | 2 | 3
}

export interface RenderContext {
  scale?: number
  width?: number
  editable?: boolean
  onPageChange?: (pageIndex: number) => void
}

export interface ITemplate {
  readonly level: 1 | 2 | 3
  readonly meta: TemplateMeta
  render(data: ResumeContent, ctx: RenderContext): ReactNode
}

// ==================== Level 1 模板实现 ====================

export interface Level1Template extends ITemplate {
  readonly level: 1
  readonly schema: TemplateSchema
}


