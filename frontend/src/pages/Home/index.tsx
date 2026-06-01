import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <Title level={1}>Shaun Resume</Title>
      <Paragraph className="text-lg text-gray-500 mb-8">
        在线简历制作平台 — 快速创建专业简历
      </Paragraph>
      <div className="flex gap-4">
        <Button type="primary" size="large" onClick={() => navigate('/templates')}>
          开始制作
        </Button>
        <Button size="large" onClick={() => navigate('/login')}>
          登录
        </Button>
      </div>
    </div>
  )
}
