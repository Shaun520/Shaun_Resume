import { useNavigate, useLocation } from 'react-router-dom'
import UserDropdown from './UserDropdown'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const isLoggedIn = !!localStorage.getItem('accessToken')

  const navItems = [
    { path: '/', label: '首页', disabled: false },
    { path: '/templates', label: '模板中心', disabled: false },
    // , disabled: !isLoggedIn 
    { path: '/resumes', label: '我的模板'},
    { path: '/publish', label: '发布中心', disabled: true },
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
            ResumeCraft
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>

              <button
                className="px-4 py-2 text-sm font-medium text-warm-700 hover:text-warm-900 transition-colors"
                onClick={() => navigate('/login')}
              >
                登录
              </button>

              <button
                className="px-4 py-2 rounded-lg text-sm font-medium bg-terracotta-500 text-white hover:bg-terracotta-600 transition-all"
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>

              <UserDropdown />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
