import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Tabs } from 'antd'
import SubmissionsPanel from '../../components/Publish/SubmissionsPanel'
import TemplateSubmitForm from '../../components/Publish/TemplateSubmitForm'

type TabKey = 'submissions' | 'submit'

const VALID_TABS: TabKey[] = ['submissions', 'submit']

/** 发布中心：合并「我的提交」与「发布模板」两个 tab */
export default function PublishCenter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const rawTab = searchParams.get('tab')
  const activeTab: TabKey = VALID_TABS.includes(rawTab as TabKey) ? (rawTab as TabKey) : 'submissions'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  const handleTabChange = (key: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', key)
    setSearchParams(next, { replace: true })
  }

  return (
    <main
      className="min-h-screen"
      style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}
      role="main"
      aria-label="发布中心"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section
          className="bg-white rounded-xl border border-warm-100 overflow-hidden"
          aria-label="发布中心内容"
        >
          <div className="px-5 pt-4 pb-2 flex items-end justify-between gap-3 flex-wrap border-b border-warm-100">
            <div>
              <h1 className="font-serif text-xl font-bold text-warm-900 leading-tight">
                发布中心
              </h1>
              <p className="text-xs text-warm-500 mt-0.5">
                管理你的模板提交，或发布新模板
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/templates')}
              className="text-xs text-terracotta-600 hover:text-terracotta-700 focus:outline-none focus:ring-2 focus:ring-terracotta-300 rounded px-2 py-1"
            >
              浏览模板中心 →
            </button>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            size="middle"
            tabBarStyle={{ paddingLeft: 20, marginBottom: 0 }}
            items={[
              {
                key: 'submissions',
                label: (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    我的提交
                  </span>
                ),
                children: (
                  <div className="px-5 py-4" role="tabpanel" aria-label="我的提交面板">
                    <SubmissionsPanel
                      onSwitchToSubmit={() => handleTabChange('submit')}
                    />
                  </div>
                ),
              },
              {
                key: 'submit',
                label: (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
                    </svg>
                    发布模板
                  </span>
                ),
                children: (
                  <div className="px-5 py-4" role="tabpanel" aria-label="发布模板面板">
                    <TemplateSubmitForm
                      onSubmitted={() => handleTabChange('submissions')}
                    />
                  </div>
                ),
              },
            ]}
          />
        </section>
      </div>
    </main>
  )
}
