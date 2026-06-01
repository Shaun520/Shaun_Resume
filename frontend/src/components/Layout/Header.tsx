import { Layout, Menu, Button } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header: AntHeader } = Layout

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { key: '/', label: '首页' },
    { key: '/resumes', label: '我的简历' },
    { key: '/templates', label: '模板中心' },
  ]

  const isLoggedIn = !!localStorage.getItem('accessToken')

  return (
    <AntHeader className="flex items-center bg-white shadow-sm px-6">
      <div
        className="text-xl font-bold cursor-pointer mr-8 text-gray-800"
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        aria-label="返回首页"
      >
        Shaun Resume
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="flex-1 border-none"
      />
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <Button
            type="text"
            onClick={() => navigate('/settings')}
            aria-label="个人设置"
          >
            个人设置
          </Button>
        ) : (
          <>
            <Button type="text" onClick={() => navigate('/login')}>
              登录
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              注册
            </Button>
          </>
        )}
      </div>
    </AntHeader>
  )
}
