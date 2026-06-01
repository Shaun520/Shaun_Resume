import { Typography } from 'antd'
import EmptyState from '../../components/Common/EmptyState'

const { Title } = Typography

export default function ResumeList() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Title level={2}>我的简历</Title>
      <EmptyState
        description="还没有简历，开始创建吧"
        actionLabel="创建简历"
        onAction={() => {}}
      />
    </div>
  )
}
