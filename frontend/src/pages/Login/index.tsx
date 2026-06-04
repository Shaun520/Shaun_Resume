import { useState } from 'react'
import { Form, Input, Button, Checkbox, App } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
      message.success('登录成功')
      navigate('/')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      message.error(error.response?.data?.message ?? '登录失败，请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Left Side - Brand */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2C1810 0%, #4A3E34 50%, #645448 100%)',
        }}
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'linear-gradient(135deg, #C65D3B, #D48060)' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'linear-gradient(135deg, #D48060, #C65D3B)' }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full h-full overflow-y-auto">
          <div className="flex items-center gap-3 flex-shrink-0">
            <svg
              className="w-10 h-10"
              style={{ color: '#D48060' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="font-serif text-2xl font-semibold text-white tracking-tight">
              ShaunResume
            </span>
          </div>

          <div className="space-y-6 max-w-md my-8">
            <h2 className="font-serif text-4xl font-semibold text-white leading-tight">欢迎回来</h2>
            <p className="text-lg leading-relaxed" style={{ color: '#B8A898' }}>
              用优雅的方式讲述你的故事。登录后继续创建令人印象深刻的简历。
            </p>

            <div className="flex gap-10 pt-2">
              <div>
                <div className="text-3xl font-serif font-semibold text-white">50K+</div>
                <div className="text-sm mt-1" style={{ color: '#9C8C7C' }}>活跃用户</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-semibold text-white">200+</div>
                <div className="text-sm mt-1" style={{ color: '#9C8C7C' }}>精美模板</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-semibold text-white">98%</div>
                <div className="text-sm mt-1" style={{ color: '#9C8C7C' }}>满意度</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex-shrink-0">
            <p className="text-base italic" style={{ color: '#B8A898' }}>
              &ldquo;ShaunResume 帮我拿到了 3 个面试邀请，界面简洁优雅，操作非常流畅。&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #C65D3B, #D48060)' }}
              >
                李
              </div>
              <div>
                <div className="text-sm font-medium text-white">李明</div>
                <div className="text-xs" style={{ color: '#9C8C7C' }}>产品经理 · 字节跳动</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center px-6 py-10 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto" role="form" aria-label="登录表单">
          <div className="flex items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:underline"
              style={{ color: '#9C8C7C' }}
              aria-label="返回首页"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回首页
            </Link>
          </div>

          <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
            <svg className="w-8 h-8" style={{ color: '#D48060' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-serif text-xl font-semibold" style={{ color: '#2C1810' }}>ShaunResume</span>
          </div>

          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl font-semibold" style={{ color: '#2C1810' }}>登录账户</h1>
            <p style={{ color: '#9C8C7C' }}>输入你的邮箱和密码以继续</p>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label="邮箱地址"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input size="large" placeholder="your@email.com" aria-label="邮箱地址" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password size="large" placeholder="输入你的密码" aria-label="密码" />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link
                to="/forgot-password"
                className="text-sm font-medium transition-colors duration-200 hover:underline"
                style={{ color: '#C65D3B' }}
              >
                忘记密码？
              </Link>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{
                  height: '48px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(198, 93, 59, 0.25)',
                }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center pb-4" style={{ color: '#9C8C7C' }}>
            还没有账户？
            <Link to="/register" className="font-medium ml-1 hover:underline" style={{ color: '#C65D3B' }}>
              立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
