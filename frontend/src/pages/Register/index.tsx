import { Form, Input, Button, Typography, Card } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

const { Title } = Typography

export default function Register() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <Card className="w-full max-w-md">
        <Title level={3} className="text-center mb-6">注册</Title>
        <Form layout="vertical" onFinish={() => navigate('/resumes')}>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input type="email" placeholder="your@email.com" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="8-32位，需包含字母和数字" />
          </Form.Item>
          <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="2-20个字符" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>注册</Button>
          </Form.Item>
        </Form>
        <div className="text-center text-gray-500 text-sm">
          已有账户？<Link to="/login">立即登录</Link>
        </div>
      </Card>
    </div>
  )
}
