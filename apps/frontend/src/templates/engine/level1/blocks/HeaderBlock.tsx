/**
 * HeaderBlock - 姓名 + 英文名 + 联系方式 + 头像
 * 支持 headerStyle: 'inline'（默认，含下边框） / 'banner'（横幅背景）
 * 支持英文名同行/下行、字距、头像尺寸/边框等精细装饰参数。
 * 无 decor 时输出与经典模板一致。
 */
import type { BlockRouterProps } from '../BlockRouter'

interface HeaderBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Header
}

export default function HeaderBlock({ data, theme }: HeaderBlockProps) {
  const { basicInfo } = data
  const decor = theme.decor
  const headerStyle = decor?.headerStyle ?? 'inline'
  const avatarShape = decor?.avatarShape ?? 'circle'
  const avatarRadius = avatarShape === 'circle' ? '50%' : '8px'
  const avatarSize = decor?.avatarSize ?? 64
  const avatarBorderWidth = decor?.avatarBorderWidth ?? 0
  const avatarBorderColor = decor?.avatarBorderColor ?? '#fff'
  const nameLetterSpacing = decor?.nameLetterSpacing

  const avatar = basicInfo.avatarUrl && (
    <img
      src={basicInfo.avatarUrl}
      alt={`${basicInfo.name}的头像`}
      className="object-cover flex-shrink-0"
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarRadius,
        border: avatarBorderWidth > 0 ? `${avatarBorderWidth}px solid ${avatarBorderColor}` : undefined,
      }}
    />
  )

  const contactLine = (
    <div
      className="flex flex-wrap gap-y-1 mt-1"
      style={{
        fontSize: theme.fontSize.body,
        color: decor?.contactColor ?? theme.colors.textSecondary,
        columnGap: decor?.contactGap != null ? decor.contactGap : 16,
      }}
    >
      {basicInfo.phone && <span aria-label={`电话：${basicInfo.phone}`}>{basicInfo.phone}</span>}
      {basicInfo.email && <span aria-label={`邮箱：${basicInfo.email}`}>{basicInfo.email}</span>}
      {basicInfo.address && (
        <span aria-label={`地址：${basicInfo.address}`}>{basicInfo.address}</span>
      )}
    </div>
  )

  const objectiveLine = basicInfo.objective && (
    <p
      className="mt-1"
      style={{
        fontSize: theme.fontSize.body,
        color: headerStyle === 'banner' ? decor?.headerTextColor ?? '#fff' : theme.colors.text,
        fontWeight: 600,
      }}
      aria-label="求职意向"
    >
      {basicInfo.objective}
    </p>
  )

  // 横幅头部：蓝底白字，头像右侧
  if (headerStyle === 'banner') {
    const bannerColor = decor?.headerBannerColor ?? theme.colors.primary
    const bannerText = decor?.headerTextColor ?? '#fff'
    return (
      <header
        className="mb-4"
        style={{ backgroundColor: bannerColor, color: bannerText }}
        role="banner"
        aria-label="个人信息"
      >
        <div className="flex items-center gap-4 py-4 px-5">
          <div className="flex-1 min-w-0">
            <h1
              className="font-bold truncate"
              style={{ fontSize: theme.fontSize.name, letterSpacing: nameLetterSpacing }}
              aria-label="姓名"
            >
              {basicInfo.name || '您的姓名'}
              {basicInfo.englishName && (
                <span style={{ fontSize: theme.fontSize.heading, fontWeight: 400, marginLeft: 12, opacity: 0.92 }}>
                  {' '}
                  {basicInfo.englishName}
                </span>
              )}
            </h1>
            {objectiveLine}
            {contactLine}
          </div>
          {avatar}
        </div>
      </header>
    )
  }

  // 内联头部（默认）
  const nameColor = decor?.nameColor ?? theme.colors.primary
  const englishInline = decor?.englishInline === true
  return (
    <header
      className="mb-4"
      style={{
        borderBottom: `${decor?.headerBorderWidth ?? 2}px solid ${decor?.headerBorderColor ?? theme.colors.primary}`,
        paddingBottom: decor?.headerPaddingBottom != null ? decor.headerPaddingBottom : 12,
      }}
      role="banner"
      aria-label="个人信息"
    >
      <div className="flex items-center gap-4">
        {avatar}
        <div className="flex-1 min-w-0">
          {englishInline ? (
            // 中文名 + 英文名同一行（如 56d / bdcb 原型）
            <h1
              className="font-bold truncate"
              style={{
                fontSize: theme.fontSize.name,
                color: nameColor,
                letterSpacing: nameLetterSpacing,
              }}
              aria-label="姓名"
            >
              {basicInfo.name || '您的姓名'}
              {basicInfo.englishName && (
                <span
                  style={{
                    fontSize: theme.fontSize.heading,
                    fontWeight: 400,
                    marginLeft: 12,
                    color: decor?.englishColor ?? theme.colors.textSecondary,
                    letterSpacing: 1,
                  }}
                >
                  {' '}
                  {basicInfo.englishName}
                </span>
              )}
            </h1>
          ) : (
            <h1
              className="font-bold truncate"
              style={{ fontSize: theme.fontSize.name, color: nameColor, letterSpacing: nameLetterSpacing }}
            >
              {basicInfo.name || '您的姓名'}
            </h1>
          )}
          {!englishInline && (basicInfo.englishName || basicInfo.objective) && (
            <div
              className="mt-0.5"
              style={{ fontSize: theme.fontSize.small, color: decor?.contactColor ?? theme.colors.textSecondary }}
            >
              {[basicInfo.englishName, basicInfo.objective].filter(Boolean).join(' · ')}
            </div>
          )}
          {englishInline && objectiveLine}
          {contactLine}
        </div>
      </div>
    </header>
  )
}