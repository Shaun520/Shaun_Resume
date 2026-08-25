/**
 * GitHub 文件存储 Provider 接口与实现
 * 基于 GitHub Contents API，使用 Node 原生 fetch（Node 18+），不额外引入依赖。
 * - put：PUT /repos/{owner}/{repo}/contents/{key}（body 为 base64）
 * - delete：GET 拿 sha → DELETE contents
 * 鉴权使用私有 Token（仅存在于后端），返回 raw.githubusercontent.com 永久地址。
 */
import { githubConfig } from '../config/github.js'
import { AppError } from '../middleware/errorHandler.js'

export interface GithubStorageProvider {
  put(key: string, data: Buffer, contentType: string): Promise<string>
  deleteObjects(
    keys: string[],
  ): Promise<{ deleted: string[]; failed: Array<{ key: string; reason: string }> }>
}

const API_BASE = 'https://api.github.com'

/** 限流/配额触发时短暂退避重试的最大次数 */
const MAX_RATE_LIMIT_RETRIES = 2

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildAuthHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${githubConfig.token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

/** 判断是否为可重试的限流响应（429，或 403 且剩余配额为 0） */
function isRateLimited(res: Response): boolean {
  if (res.status === 429) return true
  if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') {
    return true
  }
  return false
}

/** 读取响应体，统一封装为可读错误信息 */
async function readErrorBody(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string }
    return data.message ?? `GitHub API 错误 (${res.status})`
  } catch {
    return `GitHub API 错误 (${res.status})`
  }
}

export class GithubFileStorageProvider implements GithubStorageProvider {
  /** 写入（或覆盖）文件并返回 raw 公开地址 */
  async put(key: string, data: Buffer, _contentType: string): Promise<string> {
    this.assertEnabled()

    const url = `${API_BASE}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${encodeKey(key)}`

    let attempt = 0
    for (;;) {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          ...buildAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload ${key}`,
          content: data.toString('base64'),
          branch: githubConfig.branch,
        }),
      })

      if (res.ok) {
        return this.buildRawUrl(key)
      }

      if (isRateLimited(res) && attempt < MAX_RATE_LIMIT_RETRIES) {
        attempt += 1
        await sleep(500 * Math.pow(2, attempt))
        continue
      }

      throw new AppError(503, `上传到 GitHub 失败: ${await readErrorBody(res)}`)
    }
  }

  /** 批量删除文件 */
  async deleteObjects(keys: string[]): Promise<{
    deleted: string[]
    failed: Array<{ key: string; reason: string }>
  }> {
    this.assertEnabled()

    if (keys.length === 0) {
      return { deleted: [], failed: [] }
    }
    if (keys.length > 20) {
      throw new AppError(400, '单次最多删除 20 个对象')
    }

    const deleted: string[] = []
    const failed: Array<{ key: string; reason: string }> = []

    for (const key of keys) {
      try {
        const sha = await this.getSha(key)
        await this.deleteOne(key, sha)
        deleted.push(key)
      } catch (err) {
        failed.push({
          key,
          reason: err instanceof AppError ? err.message : 'DELETE_FAILED',
        })
      }
    }

    return { deleted, failed }
  }

  private async getSha(key: string): Promise<string> {
    const url = `${API_BASE}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${encodeKey(key)}`

    let attempt = 0
    for (;;) {
      const res = await fetch(url, {
        method: 'GET',
        headers: buildAuthHeaders(),
      })

      if (res.ok) {
        const data = (await res.json()) as { sha: string }
        return data.sha
      }

      if (isRateLimited(res) && attempt < MAX_RATE_LIMIT_RETRIES) {
        attempt += 1
        await sleep(500 * Math.pow(2, attempt))
        continue
      }

      throw new AppError(404, `文件不存在: ${key}`)
    }
  }

  private async deleteOne(key: string, sha: string): Promise<void> {
    const url = `${API_BASE}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${encodeKey(key)}`

    let attempt = 0
    for (;;) {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...buildAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete ${key}`,
          branch: githubConfig.branch,
          sha,
        }),
      })

      if (res.ok || res.status === 404) {
        return
      }

      if (isRateLimited(res) && attempt < MAX_RATE_LIMIT_RETRIES) {
        attempt += 1
        await sleep(500 * Math.pow(2, attempt))
        continue
      }

      throw new AppError(503, `删除 GitHub 文件失败: ${await readErrorBody(res)}`)
    }
  }

  private buildRawUrl(key: string): string {
    const base = githubConfig.rawBase.replace(/\/$/, '')
    // jsDelivr 使用 {repo}@{branch} 版本语法；raw.githubusercontent.com 使用 {repo}/{branch}
    const repoRef = base.includes('jsdelivr.net')
      ? `${githubConfig.repo}@${githubConfig.branch}`
      : `${githubConfig.repo}/${githubConfig.branch}`
    return `${base}/${githubConfig.owner}/${repoRef}/${key}`
  }

  private assertEnabled(): void {
    if (!githubConfig.enabled) {
      throw new AppError(503, 'GitHub 存储未启用，请配置 GITHUB_* 环境变量')
    }
  }
}

/** 对 key 中的路径分段做 URL 编码，避免特殊字符破坏 PATH 路由 */
function encodeKey(key: string): string {
  return key
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')
}

/** 全局单例（懒初始化） */
let providerInstance: GithubFileStorageProvider | null = null

export function getFileStorageProvider(): GithubFileStorageProvider {
  if (!providerInstance) {
    providerInstance = new GithubFileStorageProvider()
  }
  return providerInstance
}