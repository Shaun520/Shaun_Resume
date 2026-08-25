/**
 * GitHub 文件存储配置模块
 * 读取环境变量，校验 GITHUB_STORAGE_ENABLED=true 时所有必填项完整性（启动期 fail-fast）
 */

export interface GithubConfig {
  enabled: boolean
  owner: string
  repo: string
  branch: string
  token: string
  rawBase: string
  maxFileSize: number
}

const REQUIRED_KEYS_WHEN_ENABLED = [
  'GITHUB_OWNER',
  'GITHUB_REPO',
  'GITHUB_TOKEN',
] as const

function readEnv(): GithubConfig {
  const enabled = process.env.GITHUB_STORAGE_ENABLED === 'true'

  const config: GithubConfig = {
    enabled,
    owner: process.env.GITHUB_OWNER ?? '',
    repo: process.env.GITHUB_REPO ?? '',
    branch: process.env.GITHUB_BRANCH ?? 'main',
    token: process.env.GITHUB_TOKEN ?? '',
    rawBase: process.env.GITHUB_RAW_BASE || 'https://raw.githubusercontent.com',
    maxFileSize: Number(process.env.GITHUB_MAX_FILE_SIZE) || 5 * 1024 * 1024,
  }

  if (enabled) {
    const missing = REQUIRED_KEYS_WHEN_ENABLED.filter(
      (key) => !process.env[key],
    )
    if (missing.length > 0) {
      throw new Error(
        `GitHub 存储已启用但以下环境变量缺失: ${missing.join(', ')}。` +
        '请参考 .env.example 补全配置，或设置 GITHUB_STORAGE_ENABLED=false 回退本地存储。',
      )
    }
  }

  return config
}

/** 全局单例，启动时初始化一次 */
export const githubConfig = readEnv()