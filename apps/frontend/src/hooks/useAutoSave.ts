import { useEffect, useRef, useCallback, useState } from 'react'

type SaveFn = () => Promise<void>

export type SaveStatus = 'idle' | 'dirty' | 'syncing' | 'synced' | 'error'

/** 自动保存 Hook：30 秒定时同步、手动保存立即触发、网络中断检测与恢复补推 */
export function useAutoSave(saveFn: SaveFn, enabled = true) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingRef = useRef(false)
  const failCountRef = useRef(0)
  const [saveWarning, setSaveWarning] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(async () => {
      if (!enabled || pendingRef.current) return
      pendingRef.current = true
      setSaveStatus('syncing')
      try {
        await saveFn()
        failCountRef.current = 0
        setSaveWarning(false)
        setSaveStatus('synced')
        setLastSavedAt(new Date().toISOString())
      } catch {
        failCountRef.current += 1
        setSaveStatus('error')
        if (failCountRef.current >= 3) {
          setSaveWarning(true)
        }
      } finally {
        pendingRef.current = false
      }
    }, 30_000)
  }, [saveFn, enabled])

  /** 手动触发保存 */
  const manualSave = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    pendingRef.current = true
    setSaveStatus('syncing')
    try {
      await saveFn()
      failCountRef.current = 0
      setSaveWarning(false)
      setSaveStatus('synced')
      setLastSavedAt(new Date().toISOString())
    } catch {
      setSaveStatus('error')
    } finally {
      pendingRef.current = false
      if (enabled) startTimer()
    }
  }, [saveFn, enabled, startTimer])

  /** 标记数据已修改（未保存状态） */
  const markDirty = useCallback(() => {
    if (saveStatus !== 'syncing') {
      setSaveStatus('dirty')
    }
  }, [saveStatus])

  useEffect(() => {
    if (enabled) {
      startTimer()
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [enabled, startTimer])

  return { manualSave, saveWarning, saveStatus, lastSavedAt, markDirty }
}
