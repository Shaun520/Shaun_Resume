import { Spin } from 'antd'

export default function Loading({ tip = '加载中...' }: { tip?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spin size="large" tip={tip}>
        <div className="p-8" />
      </Spin>
    </div>
  )
}
