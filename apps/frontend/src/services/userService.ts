import apiClient from './apiClient'
import type { User } from '../types/auth'

export interface UpdateProfileRequest {
  nickname?: string
  avatarUrl?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

/** 用户管理相关 API 调用 */
export const userService = {
  /** 获取当前用户信息 */
  async getProfile(): Promise<User> {
    const res = await apiClient.get<User>('/users/me')
    return res.data
  },

  /** 更新用户资料（昵称、头像地址） */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const res = await apiClient.patch<User>('/users/me', data)
    return res.data
  },

  /** 修改密码 */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const res = await apiClient.patch<{ message: string }>('/users/me/password', data)
    return res.data
  },

  /** 更新头像 URL（上传文件后调用，将 raw URL 落库） */
  async updateAvatarUrl(avatarUrl: string): Promise<User> {
    const res = await apiClient.patch<User>('/users/me', { avatarUrl })
    return res.data
  },
}

export default userService
