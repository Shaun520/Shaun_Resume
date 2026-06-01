import { Button, Empty } from 'antd'

interface Props {
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  description = '暂无数据',
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Empty
        description={description}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        {actionLabel && onAction && (
          <Button type="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Empty>
    </div>
  )
}
