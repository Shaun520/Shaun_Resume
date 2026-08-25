import { beforeEach, describe, expect, it, vi } from 'vitest'
import { githubConfig } from '../config/github.js'
import { GithubFileStorageProvider } from './githubProvider.js'

// 覆盖单例配置，避免依赖真实环境变量
Object.assign(githubConfig, {
  enabled: true,
  owner: 'test-owner',
  repo: 'test-repo',
  branch: 'main',
  token: 'ghp_test',
  rawBase: 'https://raw.githubusercontent.com',
})

const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

function jsonResponse(
  body: unknown,
  status: number,
  headers?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    ...(headers ? { headers } : {}),
  })
}

describe('GithubFileStorageProvider', () => {
  const provider = new GithubFileStorageProvider()
  const key = 'avatars/user-1/uuid.png'
  const data = Buffer.from('fake-image-bytes', 'utf8')

  beforeEach(() => {
    fetchMock.mockReset()
  })

  describe('put', () => {
    it('上传成功时返回 raw URL，并提交 base64 内容', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({}, 201))

      const url = await provider.put(key, data, 'image/png')

      expect(url).toBe(
        'https://raw.githubusercontent.com/test-owner/test-repo/main/avatars/user-1/uuid.png',
      )

      const [callUrl, init] = fetchMock.mock.calls[0]! as unknown as [
        string,
        { method?: string; body?: string; headers?: Record<string, string> },
      ]
      expect(callUrl).toContain('/repos/test-owner/test-repo/contents/')
      expect(init.method).toBe('PUT')

      const body = JSON.parse(init.body as string)
      expect(body.content).toBe(data.toString('base64'))
      expect(body.branch).toBe('main')
      expect(init.headers?.Authorization).toBe('Bearer ghp_test')
    })

    it('遇到限流（403 且剩余配额为 0）时自动重试后成功', async () => {
      fetchMock
        .mockResolvedValueOnce(
          jsonResponse({ message: 'rate limited' }, 403, { 'x-ratelimit-remaining': '0' }),
        )
        .mockResolvedValueOnce(jsonResponse({}, 201))

      const url = await provider.put(key, data, 'image/png')

      expect(url).toBe(
        'https://raw.githubusercontent.com/test-owner/test-repo/main/avatars/user-1/uuid.png',
      )
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('非限流错误直接抛 503 AppError', async () => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse({ message: 'Bad credentials' }, 401),
      )

      await expect(provider.put(key, data, 'image/png')).rejects.toMatchObject({
        statusCode: 503,
      })
    })
  })

  describe('deleteObjects', () => {
    it('删除成功：先 GET 拿 sha，再 DELETE', async () => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse({ sha: 'abc123' }, 200))
        .mockResolvedValueOnce(jsonResponse({}, 200))

      const result = await provider.deleteObjects([key])

      expect(result.deleted).toEqual([key])
      expect(result.failed).toEqual([])

      expect(fetchMock.mock.calls[0]![0]).toContain('/repos/test-owner/test-repo/contents/')
      expect(fetchMock.mock.calls[0]![1].method).toBe('GET')
      expect(fetchMock.mock.calls[1]![1].method).toBe('DELETE')

      const deleteBody = JSON.parse(fetchMock.mock.calls[1]![1].body as string)
      expect(deleteBody.sha).toBe('abc123')
    })

    it('文件不存在时记为 failed', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'Not Found' }, 404))

      const result = await provider.deleteObjects([key])

      expect(result.deleted).toEqual([])
      expect(result.failed).toEqual([{ key, reason: '文件不存在: ' + key }])
    })
  })
})