import { Navigate, useSearchParams } from 'react-router-dom'

/** 兼容旧路由：/my-submissions → /publish?tab=submissions */
export default function MySubmissions() {
  const [searchParams] = useSearchParams()
  const merged = new URLSearchParams(searchParams)
  merged.set('tab', 'submissions')
  return <Navigate to={`/publish?${merged.toString()}`} replace />
}
