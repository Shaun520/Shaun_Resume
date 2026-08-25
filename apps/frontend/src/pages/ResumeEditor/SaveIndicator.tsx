import { CheckCircleOutlined, SyncOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons'

type SaveStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'dirty'

interface SaveIndicatorProps {
  status: SaveStatus
  lastSavedAt?: string | null
}

const STATUS_CONFIG: Record<SaveStatus, { label: string; color: string; icon: React.ReactNode }> = {
  idle: {
    label: '等待编辑',
    color: '#9C8C7C',
    icon: <ClockCircleOutlined />,
  },
  dirty: {
    label: '未保存的更改',
    color: '#D97706',
    icon: <ClockCircleOutlined spin={false} />,
  },
  syncing: {
    label: '同步中...',
    color: '#5B8FAF',
    icon: <SyncOutlined spin />,
  },
  synced: {
    label: '已同步',
    color: '#4A7C59',
    icon: <CheckCircleOutlined />,
  },
  error: {
    label: '同步失败',
    color: '#DC2626',
    icon: <WarningOutlined />,
  },
}

/** 简历保存状态指示器：显示上次保存时间、同步状态 */
export default function SaveIndicator({ status, lastSavedAt }: SaveIndicatorProps) {
  const config = STATUS_CONFIG[status]

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)

    if (diffMin < 1) return '刚刚'
    if (diffMin < 60) return `${diffMin} 分钟前`

    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour} 小时前`

    return date.toLocaleDateString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
      style={{
        backgroundColor: config.color + '15',
        color: config.color,
      }}
      role="status"
      aria-live="polite"
      aria-label={
        lastSavedAt && status === 'synced'
          ? `已同步，上次保存于 ${formatTime(lastSavedAt)}`
          : config.label
      }
    >
      <span className="flex-shrink-0" style={{ color: config.color }} aria-hidden="true">
        {config.icon}
      </span>
      <span>{config.label}</span>
      {lastSavedAt && (status === 'synced' || status === 'error') && (
        <span className="ml-1 opacity-75">
          ({formatTime(lastSavedAt)})
        </span>
      )}
    </div>
  )
}
