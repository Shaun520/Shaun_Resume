/**
 * Block 路由器
 * 根据 BlockType 映射到对应的 Block 组件
 */

import React from 'react'
import type { ReactNode } from 'react'

import { BlockType } from '../interfaces'
import type { ResumeContent } from '../interfaces'

export interface BlockRouterProps {
  type: BlockType
  data: ResumeContent
  theme: ThemeProps
}

export interface ThemeProps {
  primaryColor: string
  fontFamily: string
  fontSize: {
    name: string
    heading: string
    subheading: string
    body: string
    small: string
  }
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    textSecondary: string
    border: string
    accent: string
  }
}

// 动态导入 Block 组件（避免循环依赖）
const blockComponents = {
  [BlockType.Header]: React.lazy(() => import('./blocks/HeaderBlock')),
  [BlockType.Summary]: React.lazy(() => import('./blocks/SummaryBlock')),
  [BlockType.Experience]: React.lazy(() => import('./blocks/ExperienceBlock')),
  [BlockType.Education]: React.lazy(() => import('./blocks/EducationBlock')),
  [BlockType.Skills]: React.lazy(() => import('./blocks/SkillsBlock')),
  [BlockType.Projects]: React.lazy(() => import('./blocks/ProjectsBlock')),
} as Record<BlockType, React.LazyExoticComponent<React.ComponentType<BlockRouterProps>>>

export default function BlockRouter({ type, data, theme }: BlockRouterProps): ReactNode {
  const Component = blockComponents[type]
  if (!Component) return null
  return <Component type={type} data={data} theme={theme} />
}
