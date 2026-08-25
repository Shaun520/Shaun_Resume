import { useState, useMemo, type FormEvent } from 'react'
import { App } from 'antd'
import { userService } from '../../services/userService'

interface PasswordFormProps {
  email: string
}

interface PasswordFields {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

type StrengthLevel = 'weak' | 'medium' | 'strong'

/** 计算新密码强度：长度+字符多样性 */
function calcStrength(pwd: string): { level: StrengthLevel; label: string; color: string; percent: number } {
  if (!pwd) return { level: 'weak', label: '请输入密码', color: '#E8E0D4', percent: 0 }
  let score = 0
  if (pwd.length >= 8) score += 1
  if (pwd.length >= 12) score += 1
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1
  if (/[0-9]/.test(pwd)) score += 1
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1

  if (score <= 2) return { level: 'weak', label: '弱：长度不足或字符单一', color: '#DC2626', percent: 33 }
  if (score <= 3) return { level: 'medium', label: '中：建议加入大写字母或符号', color: '#D48060', percent: 66 }
  return { level: 'strong', label: '强：满足所有安全要求', color: '#4A7C59', percent: 100 }
}

/**
 * 修改密码表单：
 * - 字段：当前密码、新密码、确认密码
 * - 校验：8-32 位、包含字母和数字、新旧密码不一致、确认密码不匹配
 * - 强度提示
 * - 成功后清空表单
 */
export default function PasswordForm({ email }: PasswordFormProps) {
  const { message } = App.useApp()
  const [fields, setFields] = useState<PasswordFields>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof PasswordFields, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const strength = useMemo(() => calcStrength(fields.newPassword), [fields.newPassword])

  const update = (key: keyof PasswordFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof PasswordFields, string>> = {}

    if (!fields.currentPassword) {
      next.currentPassword = '请输入当前密码'
    }

    if (!fields.newPassword) {
      next.newPassword = '请输入新密码'
    } else if (fields.newPassword.length < 8 || fields.newPassword.length > 32) {
      next.newPassword = '新密码长度需为 8-32 位'
    } else if (!/[a-zA-Z]/.test(fields.newPassword) || !/[0-9]/.test(fields.newPassword)) {
      next.newPassword = '新密码需同时包含字母和数字'
    } else if (fields.newPassword === fields.currentPassword) {
      next.newPassword = '新密码不能与当前密码相同'
    }

    if (!fields.confirmPassword) {
      next.confirmPassword = '请再次输入新密码'
    } else if (fields.confirmPassword !== fields.newPassword) {
      next.confirmPassword = '两次输入的新密码不一致'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await userService.changePassword({
        currentPassword: fields.currentPassword,
        newPassword: fields.newPassword,
      })
      message.success('密码修改成功，请使用新密码重新登录')
      setFields({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setErrors({})
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      const msg = e.response?.data?.message ?? '密码修改失败，请稍后重试'
      message.error(msg)
      // 如果是当前密码错误，将错误定位到 currentPassword 字段
      if (msg.includes('当前密码')) {
        setErrors((prev) => ({ ...prev, currentPassword: msg }))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="修改密码表单">
      <p className="text-xs text-warm-500 mb-4">
        正在修改账户 <span className="font-medium text-warm-700">{email}</span> 的登录密码
      </p>

      <div className="space-y-4">
        {/* 当前密码 */}
        <div>
          <label
            htmlFor="pwd-current"
            className="block text-sm font-medium text-warm-700 mb-1.5"
          >
            当前密码
          </label>
          <div className="relative">
            <input
              id="pwd-current"
              type={showCurrent ? 'text' : 'password'}
              value={fields.currentPassword}
              onChange={(e) => update('currentPassword', e.target.value)}
              className={`w-full px-3 py-2 pr-20 bg-white border rounded-lg text-sm text-warm-900 focus:outline-none focus:ring-2 transition-all ${
                errors.currentPassword
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-warm-200 focus:border-terracotta-300 focus:ring-terracotta-100'
              }`}
              aria-label="当前密码"
              aria-invalid={!!errors.currentPassword}
              aria-describedby={errors.currentPassword ? 'pwd-current-err' : undefined}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-warm-500 hover:text-warm-700 transition-colors focus:outline-none focus:underline"
              aria-label={showCurrent ? '隐藏当前密码' : '显示当前密码'}
            >
              {showCurrent ? '隐藏' : '显示'}
            </button>
          </div>
          {errors.currentPassword && (
            <p id="pwd-current-err" className="text-xs text-red-500 mt-1" role="alert">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* 新密码 */}
        <div>
          <label
            htmlFor="pwd-new"
            className="block text-sm font-medium text-warm-700 mb-1.5"
          >
            新密码
          </label>
          <div className="relative">
            <input
              id="pwd-new"
              type={showNew ? 'text' : 'password'}
              value={fields.newPassword}
              onChange={(e) => update('newPassword', e.target.value)}
              className={`w-full px-3 py-2 pr-20 bg-white border rounded-lg text-sm text-warm-900 focus:outline-none focus:ring-2 transition-all ${
                errors.newPassword
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-warm-200 focus:border-terracotta-300 focus:ring-terracotta-100'
              }`}
              aria-label="新密码"
              aria-invalid={!!errors.newPassword}
              aria-describedby="pwd-new-hint"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-warm-500 hover:text-warm-700 transition-colors focus:outline-none focus:underline"
              aria-label={showNew ? '隐藏新密码' : '显示新密码'}
            >
              {showNew ? '隐藏' : '显示'}
            </button>
          </div>
          {/* 强度指示器 */}
          {fields.newPassword && (
            <div className="mt-2" aria-live="polite">
              <div className="h-1 w-full bg-warm-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </div>
          )}
          {errors.newPassword && (
            <p id="pwd-new-err" className="text-xs text-red-500 mt-1" role="alert">
              {errors.newPassword}
            </p>
          )}
          <p id="pwd-new-hint" className="text-xs text-warm-500 mt-1">
            8-32 位，需同时包含字母和数字
          </p>
        </div>

        {/* 确认密码 */}
        <div>
          <label
            htmlFor="pwd-confirm"
            className="block text-sm font-medium text-warm-700 mb-1.5"
          >
            确认新密码
          </label>
          <input
            id="pwd-confirm"
            type={showNew ? 'text' : 'password'}
            value={fields.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-warm-900 focus:outline-none focus:ring-2 transition-all ${
              errors.confirmPassword
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-warm-200 focus:border-terracotta-300 focus:ring-terracotta-100'
            }`}
            aria-label="确认新密码"
            aria-invalid={!!errors.confirmPassword}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1" role="alert">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)' }}
            aria-label="提交修改密码"
          >
            {submitting ? '提交中...' : '更新密码'}
          </button>
        </div>
      </div>
    </form>
  )
}
