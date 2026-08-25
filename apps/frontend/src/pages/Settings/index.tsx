import { useState, useEffect, useCallback } from 'react'
import { App, Spin, Typography } from 'antd'
import { userService } from '../../services/userService'
import { useAuth } from '../../contexts/AuthContext'
import type { User } from '../../types/auth'
import AvatarUpload from './AvatarUpload'

import PasswordForm from './PasswordForm'

const { Title, Text } = Typography

/** 个人设置页：账户信息（只读）+ 昵称修改 + 头像上传 + 修改密码 */
export default function Settings() {
  const { message } = App.useApp()
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<User | null>(authUser)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nickname, setNickname] = useState(authUser?.nickname ?? '')
  const [savingNickname, setSavingNickname] = useState(false)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await userService.getProfile()
      setProfile(res)
      setNickname(res.nickname)
    } catch {
      setError('加载账户信息失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authUser) {
      // 优先使用 AuthContext 缓存以避免初次闪烁
      setProfile(authUser)
      setNickname(authUser.nickname)
      setLoading(false)
      // 静默刷新：AuthContext 缓存可能缺少 createdAt/lastLoginAt
      userService.getProfile().then((res) => {
        setProfile(res)
        setNickname(res.nickname)
      }).catch(() => {
        // 静默失败，继续使用缓存数据
      })
    } else {
      fetchProfile()
    }
  }, [authUser, fetchProfile])

  const handleNicknameSave = async () => {
    if (!profile) return
    const trimmed = nickname.trim()
    if (trimmed.length < 2 || trimmed.length > 20) {
      message.warning('昵称需为 2-20 个字符')
      return
    }
    if (trimmed === profile.nickname) {
      message.info('昵称未变更')
      return
    }
    setSavingNickname(true)
    try {
      const updated = await userService.updateProfile({ nickname: trimmed })
      setProfile(updated)
      // 同步刷新 AuthContext 中的 user
      localStorage.setItem('shaun_user', JSON.stringify(updated))
      message.success('昵称已更新')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      message.error(e.response?.data?.message ?? '昵称更新失败，请稍后重试')
    } finally {
      setSavingNickname(false)
    }
  }

  const handleAvatarUploaded = async (avatarUrl: string) => {
    try {
      const updated = await userService.updateProfile({ avatarUrl })
      setProfile(updated)
      localStorage.setItem('shaun_user', JSON.stringify(updated))
      message.success('头像已更新')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      message.error(e.response?.data?.message ?? '头像保存失败')
    }
  }

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}
        role="status"
        aria-label="正在加载账户信息"
      >
        <Spin size="large" tip="加载中..." />
      </main>
    )
  }

  if (error && !profile) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#FEE2E2' }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: '#DC2626' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <Title level={4} className="!font-serif !mb-2" style={{ color: '#2C1810' }}>
            加载失败
          </Title>
          <Text style={{ color: '#9C8C7C' }} className="block mb-4">
            {error}
          </Text>
          <button
            onClick={fetchProfile}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)' }}
            aria-label="重新加载账户信息"
          >
            重新加载
          </button>
        </div>
      </main>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <main
      className="min-h-screen"
      style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}
      role="main"
      aria-label="个人设置页"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header>
          <Title level={2} className="!font-serif !mb-1" style={{ color: '#2C1810' }}>
            个人设置
          </Title>
          <Text style={{ color: '#9C8C7C' }}>管理你的账户信息、头像与密码</Text>
        </header>

        {/* 头像区 */}
        <section
          className="bg-white rounded-xl border border-warm-100 p-6"
          aria-labelledby="settings-avatar-heading"
        >
          <h3
            id="settings-avatar-heading"
            className="font-serif text-lg font-semibold text-warm-900 mb-4"
          >
            头像
          </h3>
          <AvatarUpload
            currentUrl={profile.avatarUrl}
            nickname={profile.nickname}
            onUploaded={handleAvatarUploaded}
          />
        </section>

        {/* 基本信息 */}
        <section
          className="bg-white rounded-xl border border-warm-100 p-6"
          aria-labelledby="settings-basic-heading"
        >
          <h3
            id="settings-basic-heading"
            className="font-serif text-lg font-semibold text-warm-900 mb-4"
          >
            基本信息
          </h3>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="settings-email"
                className="block text-sm font-medium text-warm-700 mb-1.5"
              >
                邮箱
              </label>
              <input
                id="settings-email"
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-500 cursor-not-allowed"
                aria-label="注册邮箱（不可修改）"
              />
              <Text className="text-xs text-warm-500 mt-1 block">邮箱暂不支持修改</Text>
            </div>

            <div>
              <label
                htmlFor="settings-nickname"
                className="block text-sm font-medium text-warm-700 mb-1.5"
              >
                昵称
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="settings-nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                  className="flex-1 px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm text-warm-900 focus:outline-none focus:border-terracotta-300 focus:ring-2 focus:ring-terracotta-100 transition-all"
                  aria-label="昵称"
                  aria-describedby="settings-nickname-hint"
                />
                <button
                  onClick={handleNicknameSave}
                  disabled={savingNickname || nickname.trim() === profile.nickname}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)' }}
                  aria-label="保存昵称"
                >
                  {savingNickname ? '保存中...' : '保存'}
                </button>
              </div>
              <Text id="settings-nickname-hint" className="text-xs text-warm-500 mt-1 block">
                2-20 个字符
              </Text>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-warm-100">
              <div>
                <Text className="text-xs text-warm-500 block mb-1">注册时间</Text>
                <Text className="text-sm text-warm-800">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleString('zh-CN')
                    : '—'}
                </Text>
              </div>
              <div>
                <Text className="text-xs text-warm-500 block mb-1">最近登录</Text>
                <Text className="text-sm text-warm-800">
                  {profile.lastLoginAt
                    ? new Date(profile.lastLoginAt).toLocaleString('zh-CN')
                    : '—'}
                </Text>
              </div>
            </div>
          </div>
        </section>

        {/* 修改密码 */}
        <section
          className="bg-white rounded-xl border border-warm-100 p-6"
          aria-labelledby="settings-password-heading"
        >
          <h3
            id="settings-password-heading"
            className="font-serif text-lg font-semibold text-warm-900 mb-4"
          >
            修改密码
          </h3>
          <PasswordForm email={profile.email} />
        </section>
      </div>
    </main>
  )
}
