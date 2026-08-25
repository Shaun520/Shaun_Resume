import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import UserDropdown from './UserDropdown'
import MobileMenu, { type NavItem } from './MobileMenu'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoggedIn = !!user

  const navItems: NavItem[] = isLoggedIn
    ? [
        { path: '/', label: '首页', disabled: false },
        { path: '/templates', label: '模板中心', disabled: false },
        { path: '/resumes', label: '我的模板' },
        { path: '/publish', label: '发布中心', disabled: false },
      ]
    : [
        { path: '/', label: '首页', disabled: false },
        { path: '/templates', label: '模板中心', disabled: false },
      ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-warm-200/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          aria-label="返回首页"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/')
            }
          }}
        >
          <svg
            className="w-8 h-8 text-terracotta-500 transition-transform duration-300 group-hover:scale-110"
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
          <span className="font-serif text-xl font-semibold text-warm-900 tracking-tight">
            ShaunResume
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => !item.disabled && navigate(item.path)}
              className={`nav-link text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'active text-warm-800'
                  : item.disabled
                  ? 'text-warm-500 cursor-not-allowed'
                  : 'text-warm-700 hover:text-warm-900'
              }`}
              disabled={item.disabled}
              style={
                item.disabled
                  ? { cursor: 'not-allowed' }
                  : { cursor: 'pointer' }
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Side: CTA Button + Avatar */}
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <>
              <button
                className="btn-primary-custom hidden sm:inline-flex"
                onClick={() => navigate('/templates')}
              >
                <span>开始制作</span>
              </button>

              <button
                className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-warm-700 hover:text-warm-900 transition-colors"
                onClick={() => navigate('/login')}
              >
                登录
              </button>

              <button
                className="hidden sm:inline-block px-4 py-2 rounded-lg text-sm font-medium bg-terracotta-500 text-white hover:bg-terracotta-600 transition-all"
                onClick={() => navigate('/register')}
              >
                注册
              </button>
            </>
          )}

          {isLoggedIn && (
            <>
              <button
                className="btn-primary-custom hidden sm:inline-flex"
                onClick={() => navigate('/templates')}
              >
                <span>开始制作</span>
              </button>

              <UserDropdown className="hidden md:flex" />
            </>
          )}

          {/* 移动端汉堡按钮（< md） */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-warm-800 hover:bg-warm-100 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            aria-label="打开菜单"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        items={navItems}
        currentPath={location.pathname}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  )
}
