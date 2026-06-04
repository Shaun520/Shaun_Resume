/**
 * HeaderBlock - 姓名 + 职位 + 联系方式 + 头像
 * 支持 photoShape: circle / square / rounded
 */

import type { BlockRouterProps } from '../BlockRouter'

interface HeaderBlockProps extends BlockRouterProps {
  type: import('../../interfaces').BlockType.Header
}

export default function HeaderBlock({ data, theme }: HeaderBlockProps) {
  const { basicInfo } = data

  return (
    <header
      className="mb-4 pb-3"
      style={{ borderBottom: `2px solid ${theme.colors.primary}` }}
      role="banner"
      aria-label="个人信息"
    >
      <div className="flex items-center gap-4">
        {/* 头像 */}
        {basicInfo.avatarUrl && (
          <img
            src={basicInfo.avatarUrl}
            alt={`${basicInfo.name}的头像`}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          {/* 姓名 */}
          <h1
            className="font-bold truncate"
            style={{
              fontSize: theme.fontSize.name,
              color: theme.colors.primary,
            }}
          >
            {basicInfo.name || '您的姓名'}
          </h1>

          {/* 联系方式 */}
          <div
            className="flex flex-wrap gap-x-4 gap-y-1 mt-1"
            style={{ fontSize: theme.fontSize.body, color: theme.colors.textSecondary }}
          >
            {basicInfo.phone && (
              <span aria-label={`电话：${basicInfo.phone}`}>{basicInfo.phone}</span>
            )}
            {basicInfo.email && (
              <span aria-label={`邮箱：${basicInfo.email}`}>{basicInfo.email}</span>
            )}
            {basicInfo.address && (
              <span aria-label={`地址：${basicInfo.address}`}>{basicInfo.address}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
