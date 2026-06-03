/**
 * 图片导出工具
 * html2canvas → Canvas.toBlob()，PNG/JPG 格式，每页独立图片
 */

import html2canvas from 'html2canvas'

export type ImageFormat = 'png' | 'jpeg'

export interface ImageExportOptions {
  element: HTMLElement
  format?: ImageFormat
  filename?: string
  quality?: number
  scale?: number
}

export async function exportToImage({
  element,
  format = 'png',
  filename = 'resume.png',
  quality = 0.95,
  scale = 2,
}: ImageExportOptions): Promise<void> {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality)
  })

  if (!blob) throw new Error('图片生成失败')

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
