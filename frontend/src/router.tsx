import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from 'antd'
import Loading from './components/Common/Loading'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'

const { Content } = Layout

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ResumeList = lazy(() => import('./pages/ResumeList'))
const ResumeEditor = lazy(() => import('./pages/ResumeEditor'))
const TemplateList = lazy(() => import('./pages/TemplateList'))
const Settings = lazy(() => import('./pages/Settings'))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // const token = localStorage.getItem('accessToken')
  // if (!token) {
  //   return <Navigate to="/login" replace />
  // }
  return <>{children}</>
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

/** Layout with Header + Footer for main pages */
function MainLayout() {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="flex-1">
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}

/** Full-screen layout without Header/Footer for auth/editor pages */
function FullscreenLayout() {
  return <Outlet />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Fullscreen routes — no header/footer */}
        <Route element={<FullscreenLayout />}>
          <Route path="/login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
          <Route path="/register" element={<SuspenseWrapper><Register /></SuspenseWrapper>} />
          <Route
            path="/resumes/:id/edit"
            element={
              <SuspenseWrapper>
                <ProtectedRoute><ResumeEditor /></ProtectedRoute>
              </SuspenseWrapper>
            }
          />
        </Route>

        {/* Main routes — with header/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<SuspenseWrapper><Home /></SuspenseWrapper>} />
          <Route
            path="/resumes"
            element={
              <SuspenseWrapper>
                <ProtectedRoute><ResumeList /></ProtectedRoute>
              </SuspenseWrapper>
            }
          />
          <Route path="/templates" element={<SuspenseWrapper><TemplateList /></SuspenseWrapper>} />
          <Route
            path="/settings"
            element={
              <SuspenseWrapper>
                <ProtectedRoute><Settings /></ProtectedRoute>
              </SuspenseWrapper>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
