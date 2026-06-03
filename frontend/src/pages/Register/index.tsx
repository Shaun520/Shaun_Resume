import { useState } from 'react'
import { Form, Input, Button, Checkbox, App } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { nickname: string; email: string; password: string }) => {
    setLoading(true)
    try {
      await register(values.email, values.password, values.nickname)
      message.success('注册成功，正在跳转...')
      navigate('/resumes')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      message.error(error.response?.data?.message ?? '注册失败，请稍后重试')
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
            <h2 className="font-serif text-4xl font-semibold text-white leading-tight">
              开启你的<br />
              <span style={{ color: '#D48060' }}>职业旅程</span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#B8A898' }}>
              加入超过 50,000 名用户，使用我们的专业工具创建令人印象深刻的简历。
            </p>

            <div className="space-y-4 pt-2">
              {[
                { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: '永久免费，无隐藏费用' },
                { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', text: '200+ 精美模板随心选' },
                { icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', text: '一键导出 PDF / 图片' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(198, 93, 59, 0.15)' }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: '#D48060' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                    </svg>
                  </div>
                  <span className="text-base" style={{ color: '#D4C8B8' }}>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 flex-shrink-0">
            <p className="text-base italic" style={{ color: '#B8A898' }}>
              &ldquo;从注册到完成简历只花了 15 分钟，模板质量非常高，强烈推荐！&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #C65D3B, #D48060)' }}
              >
                王
              </div>
              <div>
                <div className="text-sm font-medium text-white">王芳</div>
                <div className="text-xs" style={{ color: '#9C8C7C' }}>前端工程师 · 阿里巴巴</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center px-6 py-10 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto" role="form" aria-label="注册表单">
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
            <h1 className="font-serif text-3xl font-semibold" style={{ color: '#2C1810' }}>创建账户</h1>
            <p style={{ color: '#9C8C7C' }}>填写以下信息开始你的简历之旅</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[
                { required: true, message: '请输入昵称' },
                { min: 2, message: '昵称至少 2 个字符' },
                { max: 20, message: '昵称最多 20 个字符' },
              ]}
            >
              <Input size="large" placeholder="2-20 个字符" aria-label="昵称" />
            </Form.Item>

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
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码至少 8 位' },
                { max: 32, message: '密码最多 32 位' },
                { pattern: /[a-zA-Z]/, message: '密码需包含字母' },
                { pattern: /[0-9]/, message: '密码需包含数字' },
              ]}
            >
              <Input.Password size="large" placeholder="8-32 位，需包含字母和数字" aria-label="密码" />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="再次输入密码" aria-label="确认密码" />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款')),
                },
              ]}
            >
              <Checkbox>
                我已阅读并同意
                <Link to="/terms" className="mx-1 hover:underline" style={{ color: '#C65D3B' }}>服务条款</Link>
                和
                <Link to="/privacy" className="ml-1 hover:underline" style={{ color: '#C65D3B' }}>隐私政策</Link>
              </Checkbox>
            </Form.Item>

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
                创建账户
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center pb-4" style={{ color: '#9C8C7C' }}>
            已有账户？
            <Link to="/login" className="font-medium ml-1 hover:underline" style={{ color: '#C65D3B' }}>
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
