/**
 * 分页线计算工具
 * 基于 A4 尺寸容器高度 + ResizeObserver 监听内容溢出
 */

export interface PaginationInfo {
  /** 总页数 */
  pageCount: number
  /** 每页的分页线位置（距顶部 px） */
  pageBreaks: number[]
}

const A4_HEIGHT_MM = 297
/** A4 高度换算为 px (96dpi 近似) */
const A4_HEIGHT_PX = A4_HEIGHT_MM * 3.78

/**
 * 计算内容需要的页数和分页位置
 */
export function calculatePagination(containerHeight: number): PaginationInfo {
  if (containerHeight <= A4_HEIGHT_PX) {
    return { pageCount: 1, pageBreaks: [] }
  }

  const pageCount = Math.ceil(containerHeight / A4_HEIGHT_PX)
  const pageBreaks: number[] = []

  for (let i = 1; i < pageCount; i++) {
    pageBreaks.push(i * A4_HEIGHT_PX)
  }

  return { pageCount, pageBreaks }
}

/**
 * 创建 ResizeObserver 监听容器尺寸变化
 */
export function createPaginationObserver(
  container: HTMLElement,
  onChange: (info: PaginationInfo) => void
): ResizeObserver {
  const observer = new ResizeObserver(() => {
    const info = calculatePagination(container.scrollHeight)
    onChange(info)
  })

  observer.observe(container)
  return observer
}
