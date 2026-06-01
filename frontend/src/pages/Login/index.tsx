import { Form, Input, Button, Typography, Card } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

const { Title } = Typography

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <Card className="w-full max-w-md">
        <Title level={3} className="text-center mb-6">登录</Title>
        <Form layout="vertical" onFinish={() => navigate('/resumes')}>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input type="email" placeholder="your@email.com" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
        <div className="text-center text-gray-500 text-sm">
          还没有账户？<Link to="/register">立即注册</Link>
        </div>
      </Card>
    </div>
  )
}
