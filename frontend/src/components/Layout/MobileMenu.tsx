import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export interface NavItem {
  path: string
  label: string
  disabled?: boolean
}

interface MobileMenuProps {
  open: boolean
  items: NavItem[]
  currentPath: string
  onClose: () => void
}

export default function MobileMenu({ open, items, currentPath, onClose }: MobileMenuProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const panelRef = useRef<HTMLDivElement>(null)

  // 外部点击与 ESC 键关闭
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  // 锁定 body 滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleNav = (item: NavItem) => {
    if (item.disabled) return
    onClose()
    navigate(item.path)
  }

  const handleLogout = () => {
    onClose()
    logout()
    navigate('/')
  }

  if (!open) return null

  return createPortal(
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-warm-900/40 z-[60] md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 抽屉面板 */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-white z-[70] md:hidden shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="移动端导航菜单"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-warm-200">
          <span className="font-serif text-lg font-semibold text-warm-900">菜单</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-warm-700 hover:bg-warm-100 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            aria-label="关闭菜单"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2" aria-label="主导航">
          {items.map((item) => {
            const isActive = currentPath === item.path
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item)}
                disabled={item.disabled}
                className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-terracotta-50 text-terracotta-700'
                    : item.disabled
                    ? 'text-warm-400 cursor-not-allowed'
                    : 'text-warm-800 hover:bg-warm-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-warm-200 p-4 space-y-3">
          {user ? (
            <>
              <button
                onClick={() => {
                  onClose()
                  navigate('/settings')
                }}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-warm-300 text-warm-800 hover:bg-warm-50"
              >
                个人设置
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-terracotta-500 text-white hover:bg-terracotta-600"
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onClose()
                  navigate('/login')
                }}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-warm-300 text-warm-800 hover:bg-warm-50"
              >
                登录
              </button>
              <button
                onClick={() => {
                  onClose()
                  navigate('/register')
                }}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-terracotta-500 text-white hover:bg-terracotta-600"
              >
                注册
              </button>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
