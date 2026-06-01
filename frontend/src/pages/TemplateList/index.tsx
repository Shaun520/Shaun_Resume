import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const templates = [
  {
    id: 1,
    name: '简约专业',
    category: '通用',
    description: '简洁大方的设计，适合各行业求职',
    color: '#C65D3B',
    preview: 'minimalist',
    uses: 12800
  },
  {
    id: 2,
    name: '现代商务',
    category: '商务',
    description: '现代感十足的商务风格，突出专业形象',
    color: '#4A7C59',
    preview: 'modern',
    uses: 9560
  },
  {
    id: 3,
    name: '创意设计',
    category: '设计',
    description: '创意十足，适合设计师、创意工作者',
    color: '#5B8FAF',
    preview: 'creative',
    uses: 7890
  },
  {
    id: 4,
    name: '学术科研',
    category: '学术',
    description: '严谨的学术风格，适合研究生、研究员',
    color: '#6B5B95',
    preview: 'academic',
    uses: 6540
  },
  {
    id: 5,
    name: '技术工程师',
    category: '技术',
    description: '技术感强烈，适合程序员、工程师',
    color: '#E67E22',
    preview: 'tech',
    uses: 11200
  },
  {
    id: 6,
    name: '金融精英',
    category: '金融',
    description: '高端大气，适合金融、咨询行业',
    color: '#2C3E50',
    preview: 'finance',
    uses: 8920
  },
  {
    id: 7,
    name: '教育行业',
    category: '教育',
    description: '温馨亲切，适合教师、培训师',
    color: '#16A085',
    preview: 'education',
    uses: 5670
  },
  {
    id: 8,
    name: '医疗健康',
    category: '医疗',
    description: '专业可信，适合医疗从业者',
    color: '#D35400',
    preview: 'medical',
    uses: 4320
  },
  {
    id: 9,
    name: '市场营销',
    category: '市场',
    description: '活力四射，适合市场营销人员',
    color: '#C0392B',
    preview: 'marketing',
    uses: 7230
  },
  {
    id: 10,
    name: '人力资源',
    category: 'HR',
    description: '亲和力强，适合HR从业者',
    color: '#8E44AD',
    preview: 'hr',
    uses: 3890
  }
]

const categories = ['全部', '通用', '商务', '设计', '学术', '技术', '金融', '教育', '医疗', '市场', 'HR']

export default function TemplateList() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === '全部' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage)

  return (
    <main className="min-h-screen" style={{ paddingTop: '64px', backgroundColor: '#F5F0E8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Page Header - 紧凑 */}
        <div className="mb-5">
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-warm-900 mb-1">
            模板中心
          </h1>
          <p className="text-sm text-warm-500">
            精选 {templates.length} 款专业简历模板，一键套用
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-4 mb-5">
          
          {/* Search Input */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索模板名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:border-terracotta-300 focus:ring-2 focus:ring-terracotta-100 transition-all duration-200"
            />
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-terracotta-500 text-white shadow-md'
                    : 'bg-warm-50 text-warm-600 hover:bg-warm-100 hover:text-warm-800 border border-warm-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mt-3 pt-3 border-t border-warm-100 flex items-center justify-between">
            <span className="text-xs text-warm-500">
              找到 <span className="font-semibold text-terracotta-600">{filteredTemplates.length}</span> 个模板
            </span>
            {(searchQuery || selectedCategory !== '全部') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('全部')
                  setCurrentPage(1)
                }}
                className="text-xs text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>

        {/* Templates Grid - 紧凑布局 */}
        {currentTemplates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {currentTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group bg-white rounded-xl border border-warm-100 overflow-hidden hover:shadow-lg hover:border-terracotta-200 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/editor')}
                >
                  
                  {/* Preview Area */}
                  <div 
                    className="relative h-44 bg-gradient-to-br from-warm-50 to-warm-100 p-4 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${template.color}15, ${template.color}25)`
                    }}
                  >
                    
                    {/* Mock Resume Content */}
                    <div className="space-y-2 opacity-70 group-hover:opacity-90 transition-opacity">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: template.color + '40' }}
                        ></div>
                        <div className="space-y-1 flex-1">
                          <div 
                            className="h-2 rounded-full w-20"
                            style={{ backgroundColor: template.color + '60' }}
                          ></div>
                          <div 
                            className="h-1.5 rounded-full w-16"
                            style={{ backgroundColor: template.color + '30' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5 pt-2">
                        <div className="h-1.5 bg-warm-200 rounded-full w-full"></div>
                        <div className="h-1.5 bg-warm-200 rounded-full w-4/5"></div>
                        <div className="h-1.5 bg-warm-200 rounded-full w-3/5"></div>
                      </div>

                      <div className="pt-2 space-y-1.5">
                        <div className="h-1.5 bg-warm-150 rounded-full w-2/3"></div>
                        <div className="h-1.5 bg-warm-150 rounded-full w-1/2"></div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <button className="px-5 py-2 bg-white text-warm-900 rounded-lg text-sm font-semibold shadow-lg hover:bg-terracotta-500 hover:text-white transition-colors duration-200">
                        使用此模板
                      </button>
                    </div>

                    {/* Category Badge */}
                    <span 
                      className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium text-white shadow-sm"
                      style={{ backgroundColor: template.color }}
                    >
                      {template.category}
                    </span>
                  </div>

                  {/* Info Section */}
                  <div className="p-4">
                    <h3 className="font-bold text-base text-warm-900 mb-1 group-hover:text-terracotta-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-warm-500 line-clamp-2 mb-3 leading-relaxed">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-warm-100">
                      <div className="flex items-center gap-1.5 text-xs text-warm-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{template.uses.toLocaleString()} 次使用</span>
                      </div>
                      
                      <button className="text-terracotta-500 hover:text-terracotta-600 font-medium text-xs transition-colors">
                        预览 →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - 紧凑分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pb-4">
                
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? 'text-warm-300 cursor-not-allowed'
                      : 'text-warm-700 hover:bg-warm-100 border border-warm-200'
                  }`}
                >
                  ← 上一页
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-terracotta-500 text-white shadow-md'
                            : 'text-warm-600 hover:bg-warm-100 border border-warm-200'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'text-warm-300 cursor-not-allowed'
                      : 'text-warm-700 hover:bg-warm-100 border border-warm-200'
                  }`}
                >
                  下一页 →
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-xl border border-warm-100">
            <svg
              className="w-16 h-16 mx-auto text-warm-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-bold text-warm-800 mb-2">未找到匹配的模板</h3>
            <p className="text-sm text-warm-500 mb-4">
              尝试调整搜索关键词或选择其他分类
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('全部')
                setCurrentPage(1)
              }}
              className="btn-primary-custom px-5 py-2 text-sm"
            >
              重置筛选条件
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
