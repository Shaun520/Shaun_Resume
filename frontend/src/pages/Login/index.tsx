import { useState } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: Record<string, unknown>) => {
    setLoading(true)
    try {
      // TODO: 接入真实登录 API
      console.log('登录数据:', values)
      message.success('登录成功')
      navigate('/resumes')
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
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'linear-gradient(135deg, #C65D3B, #D48060)' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'linear-gradient(135deg, #D48060, #C65D3B)' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ background: '#C65D3B' }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full h-full overflow-y-auto">
          {/* Top Logo */}
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

          {/* Middle Content */}
          <div className="space-y-6 max-w-md my-8">
            <h2 className="font-serif text-4xl font-semibold text-white leading-tight">
              欢迎回来
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#B8A898' }}>
              用优雅的方式讲述你的故事。登录后继续创建令人印象深刻的简历。
            </p>

            {/* Stats */}
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

          {/* Bottom Quote */}
          <div className="space-y-4 flex-shrink-0">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  style={{ color: '#D48060' }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-base italic" style={{ color: '#B8A898' }}>
              "ShaunResume 帮我拿到了 3 个面试邀请，界面简洁优雅，操作非常流畅。"
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
        <div className="w-full max-w-md space-y-6 my-auto">
          {/* Back to Home */}
          <div className="flex items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:underline"
              style={{ color: '#9C8C7C' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回首页
            </Link>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
            <svg
              className="w-8 h-8 text-terracotta-500"
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
            <span className="font-serif text-xl font-semibold text-warm-900">ShaunResume</span>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl font-semibold text-warm-900">登录账户</h1>
            <p className="text-warm-600">输入你的邮箱和密码以继续</p>
          </div>

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
            requiredMark={false}
          >
            <Form.Item
              label="邮箱地址"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                size="large"
                placeholder="your@email.com"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                size="large"
                placeholder="输入你的密码"
                className="auth-input"
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="auth-checkbox">记住我</Checkbox>
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
                className="auth-submit-btn"
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

          {/* Register Link */}
          <div className="text-center text-warm-600 pb-4">
            还没有账户？
            <Link
              to="/register"
              className="font-medium ml-1 transition-colors duration-200 hover:underline"
              style={{ color: '#C65D3B' }}
            >
              立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
