import { Typography } from 'antd'
import Loading from '../../components/Common/Loading'

const { Title } = Typography

export default function ResumeEditor() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <Title level={2}>简历编辑器</Title>
      <Loading tip="编辑器加载中..." />
    </div>
  )
}
