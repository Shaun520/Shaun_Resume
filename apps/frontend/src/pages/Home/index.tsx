import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen" style={{ paddingTop: '64px' }}>
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="hero-badge">
                <span className="pulse-dot"></span>
                已有超过 50,000+ 用户信赖
              </div>

              {/* Heading - 调小字号以匹配参考文件 */}
              <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-warm-900 leading-tight tracking-tight">
                用优雅的方式<br />
                <span className="text-terracotta-500 italic">讲述你的故事</span>
              </h1>

              {/* Description - 调整大小 */}
              <p className="text-base lg:text-lg text-warm-600 leading-relaxed max-w-lg">
                专业的在线简历制作工具，让你轻松创建令人印象深刻的简历。从精选模板开始，几分钟内完成完美简历。
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  className="btn-primary-custom px-6 py-3 text-sm"
                  onClick={() => navigate('/templates')}
                >
                  <span>选择模板开始</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>

                <button
                  className="px-6 py-3 rounded-xl text-sm font-medium border-2 border-warm-300 text-warm-700 hover:border-terracotta-400 hover:text-terracotta-600 hover:bg-terracotta-50/50 transition-all duration-300"
                  onClick={() => navigate('/resumes')}
                >
                  从头开始
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-warm-500">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-terracotta-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  免费使用
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-terracotta-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  无需注册
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-terracotta-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  PDF 导出
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              {/* Background Decoration */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-terracotta-100 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-warm-200 rounded-full blur-3xl opacity-50"></div>

              {/* Resume Preview Card */}
              <div className="relative bg-white rounded-2xl shadow-xl p-8 rotate-2 hover:rotate-0 transition-transform duration-500 border border-warm-100">
                {/* Card Header */}
                <div className="border-b-2 border-terracotta-500 pb-4 mb-6">
                  <h3 className="font-serif text-2xl font-semibold text-warm-900">林小溪</h3>
                  <p className="text-terracotta-500 text-sm mt-1 font-medium">产品经理 | 5年经验</p>
                </div>

                {/* Mock Content */}
                <div className="space-y-3">
                  <div className="h-2.5 bg-warm-100 rounded-full w-3/4"></div>
                  <div className="h-2.5 bg-warm-100 rounded-full w-full"></div>
                  <div className="h-2.5 bg-warm-100 rounded-full w-5/6"></div>

                  <div className="pt-4 space-y-2">
                    <div className="h-2 bg-warm-50 rounded-full w-1/2"></div>
                    <div className="h-2 bg-warm-50 rounded-full w-2/3"></div>
                  </div>

                  <div className="pt-4 border-t border-warm-100">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-warm-50 text-warm-700 text-xs rounded-full font-medium">
                        用户研究
                      </span>
                      <span className="px-3 py-1.5 bg-warm-50 text-warm-700 text-xs rounded-full font-medium">
                        数据分析
                      </span>
                      <span className="px-3 py-1.5 bg-terracotta-50 text-terracotta-700 text-xs rounded-full font-medium">
                        产品规划
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Notification Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-5 -rotate-3 hover:rotate-0 transition-transform duration-500 border border-warm-100 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-terracotta-100 to-terracotta-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-terracotta-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-warm-900 truncate">简历已自动保存</p>
                    <p className="text-xs text-warm-500 mt-0.5">刚刚 · 云端同步完成</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="bg-white py-16 border-y border-warm-100">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-warm-900 mb-3">
              为什么选择我们
            </h2>
            <p className="text-warm-500 text-base max-w-xl mx-auto">
              专业的设计、流畅的体验、强大的功能
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="group p-6 rounded-xl border border-warm-100 hover:border-terracotta-200 hover:shadow-md transition-all duration-300 bg-warm-50/30">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-50 to-terracotta-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-terracotta-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-warm-900 text-base mb-2">实时编辑预览</h3>
              <p className="text-warm-600 text-sm leading-relaxed">
                左侧编辑，右侧实时预览，所见即所得的编辑体验
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-xl border border-warm-100 hover:border-terracotta-200 hover:shadow-md transition-all duration-300 bg-warm-50/30">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-50 to-terracotta-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-terracotta-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-warm-900 text-base mb-2">拖拽排序</h3>
              <p className="text-warm-600 text-sm leading-relaxed">
                自由调整简历各模块的顺序，打造个性化布局
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-xl border border-warm-100 hover:border-terracotta-200 hover:shadow-md transition-all duration-300 bg-warm-50/30">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-50 to-terracotta-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-terracotta-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-warm-900 text-base mb-2">多格式导出</h3>
              <p className="text-warm-600 text-sm leading-relaxed">
                支持 PDF、Word 等多种格式导出，满足不同需求
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
