import axios from 'axios'

// ==================== Token 管理（由 AuthContext 统一驱动） ====================

let accessToken: string | null = null

/** Token 变更回调列表，AuthContext 通过此机制同步 token */
const tokenListeners: Array<(token: string | null) => void> = []

export function setAccessToken(token: string | null): void {
  accessToken = token
  // 通知所有监听者（目前仅用于调试/日志，未来可扩展）
  tokenListeners.forEach((listener) => listener(token))
}

export function getAccessToken(): string | null {
  return accessToken
}

/** 注册 token 变更监听器（AuthContext 初始化时调用） */
export function onTokenChange(callback: (token: string | null) => void): () => void {
  tokenListeners.push(callback)
  return () => {
    const index = tokenListeners.indexOf(callback)
    if (index > -1) tokenListeners.splice(index, 1)
  }
}

// ==================== Axios 实例 ====================

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：附加 Token
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 响应拦截器：401 自动刷新 Token（带并发锁，防止多个请求同时触发刷新）
let refreshPromise: Promise<string> | null = null

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // 多个请求同时 401 时，复用同一个刷新 Promise，避免并发刷新风暴
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${import.meta.env.VITE_API_BASE_URL ?? '/api'}/auth/refresh`,
            {},
            { withCredentials: true },
          )
          .then((res) => {
            const newAccessToken = res.data.accessToken
            setAccessToken(newAccessToken)
            return newAccessToken
          })
          .catch((refreshError) => {
            // Refresh Token 也过期，清除本地状态并跳转登录
            setAccessToken(null)
            window.location.href = '/login'
            return Promise.reject(refreshError)
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      try {
        const newAccessToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
