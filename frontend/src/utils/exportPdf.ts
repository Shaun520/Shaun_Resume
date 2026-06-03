/**
 * PDF 导出工具
 * html2canvas + jsPDF，对 TemplateRenderer 输出截图并生成多页 PDF
 */

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const A4_WIDTH = 210 // mm
const A4_HEIGHT = 297 // mm

export interface PdfExportOptions {
  element: HTMLElement
  filename?: string
  scale?: number
}

export async function exportToPdf({
  element,
  filename = 'resume.pdf',
  scale = 2,
}: PdfExportOptions): Promise<void> {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/png')
  const imgWidth = A4_WIDTH
  const imgHeight = (canvas.height * A4_WIDTH) / canvas.width

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  let heightLeft = imgHeight
  let position = 0

  // 第一页
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= A4_HEIGHT

  // 后续分页
  while (heightLeft > 0) {
    position -= A4_HEIGHT
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= A4_HEIGHT
  }

  pdf.save(filename)
}
