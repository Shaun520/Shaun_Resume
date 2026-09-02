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
  OrgExperience = 'orgExperience',
  Honors = 'honors',
}

// ==================== 标题装饰图标 ====================

export type IconKey =
  | 'person'
  | 'briefcase'
  | 'folder'
  | 'users'
  | 'trophy'
  | 'plus'
  | 'lightbulb'
  | 'info'
  | 'list'

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

/**
 * 主题装饰：驱动公共 Block 以「配置驱动」方式还原各模板视觉。
 * 对 classic/modern/minimal 使用默认值（plain/inline 等）即可等价现有输出。
 */
export interface ThemeDecor {
  /** 各 section 标题处是否显示圆形图标及图种 */
  sectionIcon?: Partial<Record<BlockType, IconKey>>
  /** 标题装饰变体：无 / 圆形图标+分隔线 / 左侧竖条+分隔线 */
  titleStyle?: 'plain' | 'icon-circle' | 'left-bar'
  /** 分隔线变体 */
  divider?: 'line' | 'thin' | 'rule'
  /** 头部样式：内联 / 横幅 */
  headerStyle?: 'inline' | 'banner'
  /** 横幅背景色（headerStyle === 'banner' 时生效） */
  headerBannerColor?: string
  /** 横幅文字色（headerStyle === 'banner' 时生效） */
  headerTextColor?: string
  /** 头像形状 */
  avatarShape?: 'circle' | 'rounded'
  /** 圆形图标的背景色/填充色（titleStyle === 'icon-circle' 时生效） */
  iconColor?: string
  /** 圆形图标内的图形颜色 */
  iconTextColor?: string

  // ===== 区块标题（SectionHeading）精细参数 =====
  /** 标题字号（默认取 theme.fontSize.heading） */
  titleFontSize?: string
  /** 标题字重（默认 600/700 视风格而定） */
  titleFontWeight?: number
  /** 标题字距，如 '3px'（默认无） */
  titleLetterSpacing?: string
  /** 圆形图标直径 px（默认 22） */
  iconSize?: number
  /** 圆形图标内 SVG 尺寸 px（默认 13） */
  iconSvgSize?: number
  /** 圆形图标内 SVG 描边粗细（默认 1.8） */
  iconStrokeWidth?: number
  /** 分隔线颜色（默认 theme.colors.border） */
  dividerColor?: string
  /** 分隔线高度 px（默认 1） */
  dividerHeight?: number
  /** 分隔线上方间距 px（默认 8） */
  dividerMarginTop?: number
  /** 分隔线下方间距 px（默认 0） */
  dividerMarginBottom?: number
  /** left-bar 竖条颜色（默认 theme.colors.text） */
  leftBarColor?: string

  // ===== 头部（HeaderBlock）精细参数 =====
  /** 姓名字距，如 '4px'（默认无） */
  nameLetterSpacing?: string
  /** 姓名颜色（默认取 colors.primary） */
  nameColor?: string
  /** 英文名是否与中文名同一行显示（默认否，显示在姓名下方辅助行） */
  englishInline?: boolean
  /** 英文名颜色（默认取 colors.textSecondary） */
  englishColor?: string
  /** 内联头部下边框颜色（headerStyle='inline'，默认取 colors.primary） */
  headerBorderColor?: string
  /** 内联头部下边框粗细 px（默认 2） */
  headerBorderWidth?: number
  /** 联系方式颜色（默认取 colors.textSecondary） */
  contactColor?: string
  /** 联系方式间距 px（默认 16） */
  contactGap?: number
  /** 头部底部内边距 px（headerStyle='inline'，默认 12） */
  headerPaddingBottom?: number
  /** 头像尺寸 px（默认 72） */
  avatarSize?: number
  /** 头像边框粗细 px（默认 0） */
  avatarBorderWidth?: number
  /** 头像边框颜色（默认 #fff） */
  avatarBorderColor?: string
}

export interface ThemeConfig {
  primaryColor: string
  fontFamily: string
  fontSize: FontSizes
  colors: ColorPalette
  /** 可选主题装饰，缺省时 Block 按既有样式渲染 */
  decor?: ThemeDecor
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


