import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { setAccessToken, getAccessToken } from '../services/apiClient'
import { authService } from '../services/authService'
import type { User } from '../types/auth'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** 认证上下文 Provider：管理用户状态、Token 自动刷新、登录/注册/登出 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 初始化：验证 Token 有效性，有效则恢复用户信息，无效则清除状态
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken()
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // 调用 /api/users/me 验证 Token 是否仍然有效
        const res = await authService.getProfile()
        setUser(res)
        localStorage.setItem('shaun_user', JSON.stringify(res))
      } catch {
        // Token 无效或已过期，清除本地状态
        setAccessToken(null)
        localStorage.removeItem('shaun_user')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login({ email, password })
    setAccessToken(res.accessToken)
    setUser(res.user)
    localStorage.setItem('shaun_user', JSON.stringify(res.user))
  }, [])

  const register = useCallback(async (email: string, password: string, nickname: string) => {
    const res = await authService.register({ email, password, nickname })
    setAccessToken(res.accessToken)
    setUser(res.user)
    localStorage.setItem('shaun_user', JSON.stringify(res.user))
  }, [])

  const logout = useCallback(() => {
    authService.logout().catch(() => {})
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem('shaun_user')
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** 获取认证上下文的 Hook */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth 必须在 AuthProvider 内使用')
  }
  return ctx
}

export default AuthContext
