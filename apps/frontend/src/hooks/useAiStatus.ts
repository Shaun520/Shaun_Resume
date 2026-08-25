import { useState, useEffect, useCallback } from 'react'
import { aiService } from '../services/aiService'

/** 检查 AI 服务可用性的 Hook */
export function useAiStatus() {
  const [available, setAvailable] = useState(false)
  const [checked, setChecked] = useState(false)

  const checkStatus = useCallback(async () => {
    try {
      const status = await aiService.getStatus()
      setAvailable(status.available)
    } catch {
      setAvailable(false)
    } finally {
      setChecked(true)
    }
  }, [])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  return { available, checked, recheck: checkStatus }
}
