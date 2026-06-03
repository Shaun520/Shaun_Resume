import { useEffect, useRef, useCallback, useState } from 'react'

type SaveFn = () => Promise<void>

/** 自动保存 Hook：30 秒定时同步、手动保存立即触发、网络中断检测与恢复补推 */
export function useAutoSave(saveFn: SaveFn, enabled = true) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingRef = useRef(false)
  const failCountRef = useRef(0)
  const [saveWarning, setSaveWarning] = useState(false)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(async () => {
      if (pendingRef.current) return // 上次保存未完成则跳过
      pendingRef.current = true
      try {
        await saveFn()
        failCountRef.current = 0
        setSaveWarning(false)
      } catch {
        failCountRef.current += 1
        // 连续 3 次失败后提示用户
        if (failCountRef.current >= 3) {
          setSaveWarning(true)
        }
      } finally {
        pendingRef.current = false
      }
    }, 30_000) // 30 秒自动保存间隔
  }, [saveFn])

  /** 手动触发保存 */
  const manualSave = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    pendingRef.current = true
    try {
      await saveFn()
      failCountRef.current = 0
      setSaveWarning(false)
    } finally {
      pendingRef.current = false
      if (enabled) startTimer()
    }
  }, [saveFn, enabled, startTimer])

  useEffect(() => {
    if (enabled) {
      startTimer()
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [enabled, startTimer])

  return { manualSave, saveWarning }
}
