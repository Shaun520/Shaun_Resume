import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { AppRouter } from './router'
import ErrorBoundary from './components/Common/ErrorBoundary'

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AntApp>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </AntApp>
    </ConfigProvider>
  )
}
