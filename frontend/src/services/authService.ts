import apiClient from './apiClient'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshResponse,
  User,
} from '../types/auth'

/** 认证相关 API 调用 */
export const authService = {
  /** 注册 */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  /** 登录 */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  /** 刷新 Token */
  async refresh(): Promise<RefreshResponse> {
    const res = await apiClient.post<RefreshResponse>('/auth/refresh', {}, { withCredentials: true })
    return res.data
  },

  /** 登出 */
  async logout(): Promise<{ message: string }> {
    const res = await apiClient.post<{ message: string }>('/auth/logout')
    return res.data
  },

  /** 获取当前用户信息（验证 Token 有效性） */
  async getProfile(): Promise<User> {
    const res = await apiClient.get<User>('/users/me')
    return res.data
  },
}
