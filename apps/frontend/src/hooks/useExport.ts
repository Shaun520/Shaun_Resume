/**
 * 导出 Hook
 * 封装 PDF 和图片导出逻辑，兼容 L1/L2/L3 三种渲染输出
 */

import { useState, useCallback, useRef } from 'react'
import { exportToPdf } from '../utils/exportPdf'
import { exportToImage } from '../utils/exportImage'

interface UseExportOptions {
  /** 渲染容器 ref */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** 默认文件名 */
  defaultFilename?: string
}

export interface UseExportReturn {
  exporting: boolean
  exportPdf: (filename?: string) => Promise<void>
  exportImage: (format?: 'png' | 'jpeg', filename?: string) => Promise<void>
  error: string | null
}

export function useExport({ containerRef, defaultFilename = 'resume' }: UseExportOptions): UseExportReturn {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const exportLockRef = useRef(false)

  const exportPdf = useCallback(
    async (filename?: string) => {
      if (exportLockRef.current || !containerRef.current) return
      exportLockRef.current = true
      setExporting(true)
      setError(null)

      try {
        await exportToPdf({
          element: containerRef.current,
          filename: filename || `${defaultFilename}.pdf`,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'PDF 导出失败')
      } finally {
        setExporting(false)
        exportLockRef.current = false
      }
    },
    [containerRef, defaultFilename]
  )

  const exportImage = useCallback(
    async (format: 'png' | 'jpeg' = 'png', filename?: string) => {
      if (exportLockRef.current || !containerRef.current) return
      exportLockRef.current = true
      setExporting(true)
      setError(null)

      try {
        await exportToImage({
          element: containerRef.current,
          format,
          filename: filename || `${defaultFilename}.${format}`,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : '图片导出失败')
      } finally {
        setExporting(false)
        exportLockRef.current = false
      }
    },
    [containerRef, defaultFilename]
  )

  return { exporting, exportPdf, exportImage, error }
}
