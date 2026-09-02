/**
 * SectionHeading - 统一的区块标题
 * 根据 theme.decor.titleStyle 渲染三种变体：plain / icon-circle / left-bar
 * 支持精细装饰参数以精确还原各模板原型样式。
 */
import type { BlockType } from '../../interfaces'
import type { ThemeProps } from '../BlockRouter'
import SectionIcon from './SectionIcon'

interface SectionHeadingProps {
  title: string
  type: BlockType
  theme: ThemeProps
  /** 底部外边距 class（默认 mb-3） */
  mb?: string
}

export default function SectionHeading({ title, type, theme, mb = 'mb-3' }: SectionHeadingProps) {
  const decor = theme.decor
  const titleStyle = decor?.titleStyle ?? 'plain'
  const icon = decor?.sectionIcon?.[type]

  // 标题通用排版（字号/字重/字距）
  const titleStyleObj: React.CSSProperties = {
    fontSize: decor?.titleFontSize ?? theme.fontSize.heading,
    fontWeight: decor?.titleFontWeight ?? 600,
    letterSpacing: decor?.titleLetterSpacing,
  }

  if (titleStyle === 'icon-circle') {
    const iconSize = decor?.iconSize ?? 22
    return (
      <div className={mb}>
        <div className="flex items-center gap-2" style={{ color: theme.colors.text }}>
          <span
            className="inline-flex items-center justify-center flex-shrink-0"
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: '50%',
              backgroundColor: decor?.iconColor ?? theme.colors.primary,
            }}
          >
            <SectionIcon
              name={icon ?? 'list'}
              size={decor?.iconSvgSize ?? 13}
              strokeWidth={decor?.iconStrokeWidth ?? 1.8}
              color={decor?.iconTextColor ?? '#fff'}
            />
          </span>
          <span style={titleStyleObj}>{title}</span>
        </div>
        <div
          style={{
            borderTop: `${decor?.dividerHeight ?? 1}px solid ${decor?.dividerColor ?? theme.colors.border}`,
            marginTop: decor?.dividerMarginTop ?? 8,
            marginBottom: decor?.dividerMarginBottom ?? 0,
          }}
        />
      </div>
    )
  }

  if (titleStyle === 'left-bar') {
    return (
      <div className={mb}>
        <div className="flex items-center" style={{ color: theme.colors.text }}>
          <span
            className="flex-shrink-0"
            style={{
              width: 4,
              height: '1.1em',
              marginRight: 12,
              backgroundColor: decor?.leftBarColor ?? theme.colors.text,
            }}
          />
          <span style={titleStyleObj}>{title}</span>
        </div>
        <div
          style={{
            borderTop: `${decor?.dividerHeight ?? 1}px solid ${decor?.dividerColor ?? theme.colors.border}`,
            marginTop: decor?.dividerMarginTop ?? 8,
            marginBottom: decor?.dividerMarginBottom ?? 0,
          }}
        />
      </div>
    )
  }

  // plain：等价旧渲染，保证 classic/modern/minimal 逐字节不变
  return (
    <h2
      className={`font-semibold uppercase tracking-wide ${mb}`}
      style={{ fontSize: theme.fontSize.heading, color: theme.colors.primary }}
    >
      {title}
    </h2>
  )
}