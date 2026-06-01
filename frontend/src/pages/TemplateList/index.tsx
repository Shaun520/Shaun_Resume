import { Typography } from 'antd'
import EmptyState from '../../components/Common/EmptyState'

const { Title } = Typography

export default function TemplateList() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Title level={2}>模板中心</Title>
      <EmptyState description="模板加载中..." />
    </div>
  )
}
