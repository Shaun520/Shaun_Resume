import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout, Button, Spin, App } from 'antd'
import { useResume } from '../../hooks/useResume'
import { useAutoSave } from '../../hooks/useAutoSave'
import { useExport } from '../../hooks/useExport'
import TemplateRenderer from '../../templates/engine/TemplateRenderer'
import TemplatePanel from './TemplatePanel'
import EditorToolbar from './EditorToolbar'
import EditorTabs from './EditorTabs'
import MobileViewToggle from './MobileViewToggle'
import { registerBuiltInTemplates } from '../../templates/engine/level1'
import { SAMPLE_RESUME_DATA } from './sampleData'

const { Sider, Content } = Layout

export default function ResumeEditor() {
  const { id: resumeId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { message, modal } = App.useApp()
  const previewRef = useRef<HTMLDivElement>(null)
  const [showTemplatePanel, setShowTemplatePanel] = useState(false)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')

  const {
    content,
    loading,
    saving,
    dirty,
    schemaKey,
    switchTemplate,
    updateBasicInfo,
    updateEducation,
    updateWorkExperience,
    updateProjectExperience,
    updateSkills,
    saveContent,
  } = useResume(resumeId)

  const { manualSave, saveWarning, saveStatus, lastSavedAt } = useAutoSave(
    saveContent,
    !!resumeId && dirty,
  )

  const { exporting, exportPdf, exportImage, error: exportError } = useExport({
    containerRef: previewRef,
    defaultFilename: content.basicInfo.name || 'resume',
  })

  useEffect(() => {
    registerBuiltInTemplates()
  }, [])

  const handleManualSave = useCallback(async () => {
    try {
      await manualSave()
      message.success('保存成功')
    } catch {
      message.error('保存失败，请稍后重试')
    }
  }, [manualSave, message])

  const handleExportPdf = useCallback(async () => {
    try {
      await exportPdf()
      message.success('PDF 导出成功')
    } catch {
      message.error('PDF 导出失败')
    }
  }, [exportPdf, message])

  const handleExportImage = useCallback(async () => {
    try {
      await exportImage('png')
      message.success('图片导出成功')
    } catch {
      message.error('图片导出失败')
    }
  }, [exportImage, message])

  const handleTemplateSelect = useCallback(
    async (newTemplateId: string, newSchemaKey: string) => {
      try {
        await switchTemplate(newTemplateId, newSchemaKey)
        message.success('已切换到新模板')
      } catch {
        message.error('模板切换失败，请稍后重试')
      }
    },
    [switchTemplate, message],
  )

  const handleFillSample = useCallback(() => {
    const hasContent =
      !!content.basicInfo.name ||
      content.education.length > 0 ||
      content.workExperience.length > 0 ||
      content.projectExperience.length > 0 ||
      content.skills.length > 0

    const doFill = () => {
      updateBasicInfo(SAMPLE_RESUME_DATA.basicInfo)
      updateEducation(SAMPLE_RESUME_DATA.education)
      updateWorkExperience(SAMPLE_RESUME_DATA.workExperience)
      updateProjectExperience(SAMPLE_RESUME_DATA.projectExperience)
      updateSkills(SAMPLE_RESUME_DATA.skills)
      message.success('已填充示例')
    }

    if (hasContent) {
      modal.confirm({
        title: '填充示例',
        content: '此操作将覆盖当前简历内容，确定要继续吗？',
        okText: '确认填充',
        cancelText: '取消',
        onOk: doFill,
      })
    } else {
      doFill()
    }
  }, [
    content,
    updateBasicInfo,
    updateEducation,
    updateWorkExperience,
    updateProjectExperience,
    updateSkills,
    message,
    modal,
  ])

  const handleBack = useCallback(() => {
    navigate('/resumes')
  }, [navigate])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" role="status" aria-label="加载中">
        <Spin size="large" tip="加载简历中..." />
      </div>
    )
  }

  if (exportError) {
    return (
      <div className="h-screen flex items-center justify-center" role="alert">
        <p className="text-red-500">{exportError}</p>
        <Button onClick={() => navigate('/resumes')} className="ml-4">
          返回简历列表
        </Button>
      </div>
    )
  }

  return (
    <Layout className="h-screen" style={{ backgroundColor: '#F5F0E8' }}>
      <EditorToolbar
        onFillSample={handleFillSample}
        dirty={dirty}
        saving={saving}
        exporting={exporting}
        saveWarning={saveWarning}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        modal={modal}
        onBack={handleBack}
        onManualSave={handleManualSave}
        onExportPdf={handleExportPdf}
        onExportImage={handleExportImage}
        onToggleTemplatePanel={() => setShowTemplatePanel(true)}
      />

      <Layout>
        {/* 桌面端编辑区 */}
        <Sider
          width={480}
          className="hidden md:block overflow-y-auto"
          style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid #E8E0D4' }}
          role="region"
          aria-label="编辑区域"
        >
          <div className="p-6 space-y-6">
            <EditorTabs
              variant="desktop"
              content={content}
              onUpdateBasic={updateBasicInfo}
              onUpdateEducation={updateEducation}
              onUpdateWork={updateWorkExperience}
              onUpdateProjects={updateProjectExperience}
              onUpdateSkills={updateSkills}
            />
          </div>
        </Sider>

        {/* 移动端编辑视图 */}
        <div
          className={`md:hidden flex-1 overflow-y-auto ${
            mobileView === 'edit' ? 'block' : 'hidden'
          }`}
          style={{ backgroundColor: '#FFFFFF' }}
          role="region"
          aria-label="编辑区域"
        >
          <div className="p-4">
            <EditorTabs
              variant="mobile"
              content={content}
              onUpdateBasic={updateBasicInfo}
              onUpdateEducation={updateEducation}
              onUpdateWork={updateWorkExperience}
              onUpdateProjects={updateProjectExperience}
              onUpdateSkills={updateSkills}
            />
          </div>
        </div>

        {/* 预览区 */}
        <Content
          className={`overflow-y-auto flex justify-center p-3 md:p-6 ${
            mobileView === 'preview' ? 'block' : 'hidden md:flex'
          }`}
          style={{ backgroundColor: '#FDFBF7' }}
          role="region"
          aria-label="实时预览区域"
        >
          <div
            ref={previewRef}
            className="shadow-lg bg-white overflow-hidden"
            style={{ width: '210mm', maxWidth: '100%', minHeight: '297mm' }}
          >
            <TemplateRenderer templateId={schemaKey || 'classic'} data={content} />
          </div>
        </Content>
      </Layout>

      <MobileViewToggle view={mobileView} onChange={setMobileView} />

      {showTemplatePanel && (
        <TemplatePanel
          currentSchemaKey={schemaKey || 'classic'}
          data={content}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplatePanel(false)}
        />
      )}
    </Layout>
  )
}
