import { Navigate, useSearchParams } from 'react-router-dom'

/** 兼容旧路由：/templates/submit → /publish?tab=submit */
export default function TemplateSubmit() {
  const [searchParams] = useSearchParams()
  const merged = new URLSearchParams(searchParams)
  merged.set('tab', 'submit')
  return <Navigate to={`/publish?${merged.toString()}`} replace />
}
