/**
 * Level 1 Schema 渲染器
 * 解析 TemplateSchema 配置，按 sections 顺序调用 BlockRenderer 组合渲染
 */

import { Suspense } from 'react'
import type { TemplateSchema, ResumeContent, RenderContext } from '../interfaces'
import type { ThemeProps } from './BlockRouter'
import SingleColumnLayout from './layouts/SingleColumn'
import DoubleColumnLayout from './layouts/DoubleColumn'
import BlockRouter from './BlockRouter'

interface SchemaRendererProps {
  schema: TemplateSchema
  data: ResumeContent
  ctx: RenderContext
}

function convertTheme(schema: TemplateSchema): ThemeProps {
  return {
    primaryColor: schema.theme.primaryColor,
    fontFamily: schema.theme.fontFamily,
    fontSize: schema.theme.fontSize,
    colors: schema.theme.colors,
  }
}

export default function SchemaRenderer({ schema, data, ctx }: SchemaRendererProps) {
  const theme = convertTheme(schema)
  const visibleSections = schema.sections.filter((s) => s.visible)

  if (schema.layout.mode === 'single') {
    const children = visibleSections.map((section) => (
      <Suspense key={section.type} fallback={<div className="animate-pulse bg-gray-200 h-20 rounded" />}>
        <BlockRouter type={section.type} data={data} theme={theme} />
      </Suspense>
    ))

    return (
      <div
        style={{
          fontFamily: theme.fontFamily,
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          transform: ctx.scale ? `scale(${ctx.scale})` : undefined,
          transformOrigin: 'top left',
          width: ctx.width ?? '210mm',
          minHeight: '297mm',
        }}
        role="document"
        aria-label={`简历模板：${schema.name}`}
      >
        <SingleColumnLayout spacing={schema.layout.spacing} padding={schema.layout.padding}>
          {children}
        </SingleColumnLayout>
      </div>
    )
  }

  // 双栏布局
  const leftSections = visibleSections.filter((s) => s.column === 'left')
  const rightSections = visibleSections.filter((s) => s.column !== 'left')

  const leftChildren = leftSections.map((section) => (
    <Suspense key={section.type} fallback={<div className="animate-pulse bg-gray-200 h-16 rounded" />}>
      <BlockRouter type={section.type} data={data} theme={theme} />
    </Suspense>
  ))

  const rightChildren = rightSections.map((section) => (
    <Suspense key={section.type} fallback={<div className="animate-pulse bg-gray-200 h-16 rounded" />}>
      <BlockRouter type={section.type} data={data} theme={theme} />
    </Suspense>
  ))

  return (
    <div
      style={{
        fontFamily: theme.fontFamily,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        transform: ctx.scale ? `scale(${ctx.scale})` : undefined,
        transformOrigin: 'top left',
        width: ctx.width ?? '210mm',
        minHeight: '297mm',
      }}
      role="document"
      aria-label={`简历模板：${schema.name}`}
    >
      <DoubleColumnLayout
        leftChildren={leftChildren}
        rightChildren={rightChildren}
        spacing={schema.layout.spacing}
        padding={schema.layout.padding}
        leftRatio={schema.layout.leftRatio}
      />
    </div>
  )
}
