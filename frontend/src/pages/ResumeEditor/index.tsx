import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Layout,
  Button,
  Tooltip,
  Input,
  Select,
  ColorPicker,
  Slider,
  Switch,
  Radio,
  Collapse,
} from 'antd'
import type { Color } from 'antd/es/color-picker'

const { Sider, Content } = Layout
const { Panel } = Collapse

// ==================== Types ====================
interface ResumeModule {
  id: string
  type: string
  title: string
  icon: React.ReactNode
  enabled: boolean
}

interface ResumeData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  summary: string
  theme: {
    primaryColor: string
    fontFamily: string
    fontSize: number
    spacing: number
    layout: 'single' | 'double'
    showPhoto: boolean
    photoShape: 'circle' | 'square' | 'rounded'
  }
  modules: ResumeModule[]
}

// ==================== Icons ====================
const Icons = {
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  briefcase: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  academic: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  award: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  language: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  ),
  project: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  eye: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  download: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  save: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  ),
  undo: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  ),
  redo: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
    </svg>
  ),
  back: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  drag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
    </svg>
  ),
  photo: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
}

// ==================== Mock Data ====================
const defaultModules: ResumeModule[] = [
  { id: 'profile', type: 'profile', title: '个人信息', icon: Icons.user, enabled: true },
  { id: 'summary', type: 'summary', title: '个人简介', icon: Icons.user, enabled: true },
  { id: 'experience', type: 'experience', title: '工作经历', icon: Icons.briefcase, enabled: true },
  { id: 'education', type: 'education', title: '教育背景', icon: Icons.academic, enabled: true },
  { id: 'skills', type: 'skills', title: '技能特长', icon: Icons.code, enabled: true },
  { id: 'projects', type: 'projects', title: '项目经历', icon: Icons.project, enabled: false },
  { id: 'awards', type: 'awards', title: '荣誉奖项', icon: Icons.award, enabled: false },
  { id: 'languages', type: 'languages', title: '语言能力', icon: Icons.language, enabled: false },
]

const initialResumeData: ResumeData = {
  name: '张三',
  title: '高级前端工程师',
  email: 'zhangsan@example.com',
  phone: '138-0000-0000',
  location: '北京市朝阳区',
  summary:
    '拥有5年前端开发经验，精通React、Vue等主流框架。热衷于用户体验优化和性能调优，具备良好的团队协作能力和项目管理经验。',
  theme: {
    primaryColor: '#C65D3B',
    fontFamily: 'Inter',
    fontSize: 14,
    spacing: 24,
    layout: 'single',
    showPhoto: true,
    photoShape: 'circle',
  },
  modules: defaultModules,
}

// ==================== Components ====================

/** Left Sidebar - Module Toolbox */
function ModuleToolbox({
  modules,
  onToggle,
}: {
  modules: ResumeModule[]
  onToggle: (id: string) => void
}) {
  const availableModules = [
    { type: 'projects', title: '项目经历', icon: Icons.project },
    { type: 'awards', title: '荣誉奖项', icon: Icons.award },
    { type: 'languages', title: '语言能力', icon: Icons.language },
  ]

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#FDFBF7' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: '#E8E0D4' }}>
        <h3 className="font-serif text-sm font-semibold text-warm-900">模块管理</h3>
        <p className="text-xs text-warm-500 mt-0.5">拖拽调整顺序，点击开关显示/隐藏</p>
      </div>

      {/* Active Modules List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {modules
          .filter((m) => m.enabled)
          .map((module) => (
            <div
              key={module.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer group"
              style={{
                borderColor: '#E8E0D4',
                backgroundColor: '#FFFFFF',
              }}
            >
              <span className="text-warm-400 cursor-grab">{Icons.drag}</span>
              <span className="text-warm-600">{module.icon}</span>
              <span className="flex-1 text-sm font-medium text-warm-800">{module.title}</span>
              <Switch
                size="small"
                checked={module.enabled}
                onChange={() => onToggle(module.id)}
                style={{ backgroundColor: module.enabled ? '#C65D3B' : undefined }}
              />
            </div>
          ))}

        {/* Add Module Section */}
        <div className="pt-4">
          <h4 className="text-xs font-medium text-warm-500 uppercase tracking-wider mb-2 px-1">
            添加模块
          </h4>
          <div className="space-y-2">
            {availableModules.map((mod) => {
              const isAdded = modules.some((m) => m.type === mod.type && m.enabled)
              return (
                <button
                  key={mod.type}
                  disabled={isAdded}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
                  style={{
                    borderColor: '#E8E0D4',
                    backgroundColor: isAdded ? '#F5F0E8' : '#FFFFFF',
                  }}
                >
                  <span className="text-warm-600">{mod.icon}</span>
                  <span className="flex-1 text-sm text-left text-warm-800">{mod.title}</span>
                  {!isAdded && <span className="text-warm-400">{Icons.plus}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Right Sidebar - Properties Panel */
function PropertiesPanel({
  data,
  onChange,
}: {
  data: ResumeData
  onChange: (data: ResumeData) => void
}) {
  const handleThemeChange = (key: keyof ResumeData['theme'], value: unknown) => {
    onChange({
      ...data,
      theme: { ...data.theme, [key]: value },
    })
  }

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#FDFBF7' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: '#E8E0D4' }}>
        <h3 className="font-serif text-sm font-semibold text-warm-900">样式设置</h3>
        <p className="text-xs text-warm-500 mt-0.5">自定义简历外观和布局</p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Collapse
          defaultActiveKey={['appearance', 'layout', 'content']}
          ghost
          expandIconPosition="end"
          className="editor-collapse"
        >
          {/* Appearance */}
          <Panel header={<span className="text-sm font-medium text-warm-800">外观样式</span>} key="appearance">
            <div className="space-y-4 pt-2">
              {/* Primary Color */}
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-2">主题色</label>
                <div className="flex items-center gap-3">
                  <ColorPicker
                    value={data.theme.primaryColor}
                    onChange={(color: Color) => handleThemeChange('primaryColor', color.toHexString())}
                    showText
                    size="small"
                  />
                  <div className="flex gap-1.5">
                    {['#C65D3B', '#4A7C59', '#5B8FAF', '#6B5B95', '#2C3E50', '#E67E22'].map((c) => (
                      <button
                        key={c}
                        className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: data.theme.primaryColor === c ? c : 'transparent',
                          boxShadow: data.theme.primaryColor === c ? `0 0 0 2px ${c}40` : 'none',
                        }}
                        onClick={() => handleThemeChange('primaryColor', c)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-2">字体</label>
                <Select
                  value={data.theme.fontFamily}
                  onChange={(v) => handleThemeChange('fontFamily', v)}
                  options={[
                    { value: 'Inter', label: 'Inter (现代)' },
                    { value: 'Playfair Display', label: 'Playfair (优雅)' },
                    { value: 'Roboto', label: 'Roboto (简洁)' },
                    { value: 'Noto Sans SC', label: 'Noto Sans (中文)' },
                  ]}
                  className="w-full"
                  size="small"
                />
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-2">
                  字号 {data.theme.fontSize}px
                </label>
                <Slider
                  min={12}
                  max={18}
                  value={data.theme.fontSize}
                  onChange={(v) => handleThemeChange('fontSize', v)}
                />
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-2">
                  间距 {data.theme.spacing}px
                </label>
                <Slider
                  min={16}
                  max={40}
                  value={data.theme.spacing}
                  onChange={(v) => handleThemeChange('spacing', v)}
                />
              </div>
            </div>
          </Panel>

          {/* Layout */}
          <Panel header={<span className="text-sm font-medium text-warm-800">页面布局</span>} key="layout">
            <div className="space-y-4 pt-2">
              {/* Layout Mode */}
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-2">布局模式</label>
                <Radio.Group
                  value={data.theme.layout}
                  onChange={(e) => handleThemeChange('layout', e.target.value)}
                  className="flex gap-2"
                >
                  <Radio.Button value="single" className="flex-1 text-center text-xs">
                    单栏
                  </Radio.Button>
                  <Radio.Button value="double" className="flex-1 text-center text-xs">
                    双栏
                  </Radio.Button>
                </Radio.Group>
              </div>

              {/* Show Photo */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-warm-600">显示照片</label>
                <Switch
                  checked={data.theme.showPhoto}
                  onChange={(v) => handleThemeChange('showPhoto', v)}
                  size="small"
                />
              </div>

              {/* Photo Shape */}
              {data.theme.showPhoto && (
                <div>
                  <label className="block text-xs font-medium text-warm-600 mb-2">照片形状</label>
                  <Radio.Group
                    value={data.theme.photoShape}
                    onChange={(e) => handleThemeChange('photoShape', e.target.value)}
                    className="flex gap-2"
                  >
                    <Radio.Button value="circle" className="flex-1 text-center text-xs">
                      圆形
                    </Radio.Button>
                    <Radio.Button value="square" className="flex-1 text-center text-xs">
                      方形
                    </Radio.Button>
                    <Radio.Button value="rounded" className="flex-1 text-center text-xs">
                      圆角
                    </Radio.Button>
                  </Radio.Group>
                </div>
              )}
            </div>
          </Panel>

          {/* Content */}
          <Panel header={<span className="text-sm font-medium text-warm-800">内容编辑</span>} key="content">
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-1">姓名</label>
                <Input
                  value={data.name}
                  onChange={(e) => onChange({ ...data, name: e.target.value })}
                  size="small"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-1">职位</label>
                <Input
                  value={data.title}
                  onChange={(e) => onChange({ ...data, title: e.target.value })}
                  size="small"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-1">邮箱</label>
                <Input
                  value={data.email}
                  onChange={(e) => onChange({ ...data, email: e.target.value })}
                  size="small"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-1">电话</label>
                <Input
                  value={data.phone}
                  onChange={(e) => onChange({ ...data, phone: e.target.value })}
                  size="small"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-1">所在地</label>
                <Input
                  value={data.location}
                  onChange={(e) => onChange({ ...data, location: e.target.value })}
                  size="small"
                />
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  )
}

/** Resume Preview - A4 Paper */
function ResumePreview({ data }: { data: ResumeData }) {
  const {
    theme: { primaryColor, fontFamily, fontSize, spacing, layout, showPhoto, photoShape },
  } = data

  const photoBorderRadius =
    photoShape === 'circle' ? '50%' : photoShape === 'rounded' ? '12px' : '0px'

  return (
    <div className="w-full h-full overflow-y-auto flex justify-center py-8 px-4">
      {/* A4 Paper */}
      <div
        className="shadow-2xl transition-all duration-300"
        style={{
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: '#FFFFFF',
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: '1.6',
        }}
      >
        {/* Resume Content */}
        <div
          className={layout === 'double' ? 'grid grid-cols-3' : ''}
          style={{ gap: `${spacing}px` }}
        >
          {/* Left Column / Full Width Header */}
          <div
            className={layout === 'double' ? 'col-span-1 p-8' : 'p-8 pb-4'}
            style={layout === 'double' ? { backgroundColor: `${primaryColor}08` } : {}}
          >
            {/* Photo & Name */}
            <div className={layout === 'double' ? 'text-center' : 'flex items-start gap-6'}>
              {showPhoto && (
                <div
                  className="flex-shrink-0 overflow-hidden border-4"
                  style={{
                    width: layout === 'double' ? 100 : 80,
                    height: layout === 'double' ? 100 : 80,
                    borderRadius: photoBorderRadius,
                    borderColor: `${primaryColor}30`,
                    background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {Icons.photo}
                  </div>
                </div>
              )}
              <div className={layout === 'double' ? 'mt-4' : ''}>
                <h1
                  className="font-serif text-2xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {data.name}
                </h1>
                <p className="text-warm-600 mt-1">{data.title}</p>
                {layout === 'double' && (
                  <div className="mt-4 space-y-1.5 text-xs text-warm-500">
                    <div>{data.email}</div>
                    <div>{data.phone}</div>
                    <div>{data.location}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info - Single Column Only */}
            {layout === 'single' && (
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-warm-500">
                <span>{data.email}</span>
                <span>{data.phone}</span>
                <span>{data.location}</span>
              </div>
            )}
          </div>

          {/* Right Column / Main Content */}
          <div className={layout === 'double' ? 'col-span-2 p-8' : 'px-8 pb-8'}>
            {/* Summary */}
            {data.modules.find((m) => m.id === 'summary')?.enabled && (
              <section className="mb-6">
                <h2
                  className="font-serif text-sm font-semibold uppercase tracking-wider pb-2 mb-3 border-b-2"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  个人简介
                </h2>
                <p className="text-warm-700 leading-relaxed">{data.summary}</p>
              </section>
            )}

            {/* Experience */}
            {data.modules.find((m) => m.id === 'experience')?.enabled && (
              <section className="mb-6">
                <h2
                  className="font-serif text-sm font-semibold uppercase tracking-wider pb-2 mb-3 border-b-2"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  工作经历
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      company: '科技有限公司',
                      position: '高级前端工程师',
                      period: '2022.03 - 至今',
                      desc: '负责公司核心产品的前端架构设计与开发，带领5人团队完成多个重点项目。',
                    },
                    {
                      company: '互联网公司',
                      position: '前端工程师',
                      period: '2020.07 - 2022.02',
                      desc: '参与电商平台前端开发，负责商品详情页和购物车模块。',
                    },
                  ].map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-warm-900">{exp.position}</h3>
                          <p className="text-sm text-warm-500">{exp.company}</p>
                        </div>
                        <span className="text-xs text-warm-400 flex-shrink-0">{exp.period}</span>
                      </div>
                      <p className="text-sm text-warm-600 mt-1">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.modules.find((m) => m.id === 'education')?.enabled && (
              <section className="mb-6">
                <h2
                  className="font-serif text-sm font-semibold uppercase tracking-wider pb-2 mb-3 border-b-2"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  教育背景
                </h2>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-warm-900">计算机科学与技术 · 本科</h3>
                    <p className="text-sm text-warm-500">北京大学</p>
                  </div>
                  <span className="text-xs text-warm-400 flex-shrink-0">2016.09 - 2020.06</span>
                </div>
              </section>
            )}

            {/* Skills */}
            {data.modules.find((m) => m.id === 'skills')?.enabled && (
              <section className="mb-6">
                <h2
                  className="font-serif text-sm font-semibold uppercase tracking-wider pb-2 mb-3 border-b-2"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  技能特长
                </h2>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Vue.js', 'Node.js', 'Webpack', 'Git', 'Figma', 'Tailwind CSS'].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor,
                        }}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.modules.find((m) => m.id === 'projects')?.enabled && (
              <section className="mb-6">
                <h2
                  className="font-serif text-sm font-semibold uppercase tracking-wider pb-2 mb-3 border-b-2"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  项目经历
                </h2>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-warm-900">企业级后台管理系统</h3>
                    <span className="text-xs text-warm-400">2023.01 - 2023.06</span>
                  </div>
                  <p className="text-sm text-warm-600 mt-1">
                    基于 React + Ant Design 开发的企业级后台管理系统，支持权限管理、数据可视化等功能。
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== Main Editor Page ====================
export default function ResumeEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)

  const handleModuleToggle = (moduleId: string) => {
    setResumeData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ? { ...m, enabled: !m.enabled } : m
      ),
    }))
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Top Toolbar */}
      <div
        className="h-14 flex items-center justify-between px-4 border-b flex-shrink-0"
        style={{ backgroundColor: '#FDFBF7', borderColor: '#E8E0D4' }}
      >
        {/* Left Actions */}
        <div className="flex items-center gap-2">
          <Tooltip title="返回">
            <Button
              icon={Icons.back}
              onClick={() => navigate('/resumes')}
              className="flex items-center justify-center"
            />
          </Tooltip>
          <div className="w-px h-6 mx-1" style={{ backgroundColor: '#E8E0D4' }} />
          <Tooltip title="撤销">
            <Button icon={Icons.undo} className="flex items-center justify-center" />
          </Tooltip>
          <Tooltip title="重做">
            <Button icon={Icons.redo} className="flex items-center justify-center" />
          </Tooltip>
          <div className="ml-3">
            <span className="font-serif text-sm font-semibold text-warm-900">
              未命名简历
            </span>
            <span className="text-xs text-warm-400 ml-2">ID: {id}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Tooltip title="预览">
            <Button icon={Icons.eye} className="flex items-center justify-center">
              预览
            </Button>
          </Tooltip>
          <Tooltip title="保存">
            <Button
              icon={Icons.save}
              className="flex items-center justify-center"
              style={{ color: '#C65D3B' }}
            >
              保存
            </Button>
          </Tooltip>
          <Button
            type="primary"
            icon={Icons.download}
            className="flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #C65D3B 0%, #D48060 100%)',
              border: 'none',
            }}
          >
            导出 PDF
          </Button>
        </div>
      </div>

      {/* Editor Workspace */}
      <Layout className="flex-1 overflow-hidden" style={{ backgroundColor: 'transparent' }}>
        {/* Left Sidebar - Modules */}
        <Sider
          width={260}
          className="overflow-hidden"
          style={{ backgroundColor: 'transparent' }}
        >
          <ModuleToolbox modules={resumeData.modules} onToggle={handleModuleToggle} />
        </Sider>

        {/* Center - Preview */}
        <Content className="overflow-hidden">
          <ResumePreview data={resumeData} />
        </Content>

        {/* Right Sidebar - Properties */}
        <Sider
          width={300}
          className="overflow-hidden"
          style={{ backgroundColor: 'transparent' }}
        >
          <PropertiesPanel data={resumeData} onChange={setResumeData} />
        </Sider>
      </Layout>
    </div>
  )
}
