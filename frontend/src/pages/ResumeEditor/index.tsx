import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout, Button, Spin, App, Tabs } from 'antd'
import { useResume } from '../../hooks/useResume'
import { useAutoSave } from '../../hooks/useAutoSave'
import { useExport } from '../../hooks/useExport'
import TemplateRenderer from '../../templates/engine/TemplateRenderer'
import TemplatePanel from './TemplatePanel'
import EditorToolbar from './EditorToolbar'
import { registerBuiltInTemplates } from '../../templates/engine/level1'
import BasicInfoForm from './BasicInfoForm'
import EducationForm from './EducationForm'
import WorkForm from './WorkForm'
import ProjectForm from './ProjectForm'
import SkillsForm from './SkillsForm'

const { Sider, Content } = Layout

export default function ResumeEditor() {
  const { id: resumeId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const previewRef = useRef<HTMLDivElement>(null)
  const [showTemplatePanel, setShowTemplatePanel] = useState(false)

  const {
    content,
    loading,
    saving,
    dirty,
    schemaKey,
    setTemplateId,
    updateBasicInfo,
    updateEducation,
    updateWorkExperience,
    updateProjectExperience,
    updateSkills,
    saveContent,
  } = useResume(resumeId)

  const { manualSave, saveWarning } = useAutoSave(saveContent, !!resumeId && dirty)

  const { exporting, exportPdf, exportImage, error: exportError } = useExport({
    containerRef: previewRef,
    defaultFilename: content.basicInfo.name || 'resume',
  })

  // 初始化内置模板
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
  }, [manualSave])

  const handleExportPdf = useCallback(async () => {
    try {
      await exportPdf()
      message.success('PDF 导出成功')
    } catch {
      message.error('PDF 导出失败')
    }
  }, [exportPdf])

  const handleExportImage = useCallback(async () => {
    try {
      await exportImage('png')
      message.success('图片导出成功')
    } catch {
      message.error('图片导出失败')
    }
  }, [exportImage])

  const handleTemplateSelect = useCallback(
    (newTemplateId: string, newSchemaKey: string) => {
      setTemplateId(newTemplateId, newSchemaKey)
      message.success(`已切换到新模板`)
    },
    [setTemplateId, message]
  )

  // Loading 状态
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" role="status" aria-label="加载中">
        <Spin size="large" tip="加载简历中..." />
      </div>
    )
  }

  // Error 状态
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
      {/* 顶部工具栏 */}
      <EditorToolbar
        dirty={dirty}
        saving={saving}
        exporting={exporting}
        saveWarning={saveWarning}
        onManualSave={handleManualSave}
        onExportPdf={handleExportPdf}
        onExportImage={handleExportImage}
        onToggleTemplatePanel={() => setShowTemplatePanel(true)}
      />

      <Layout>
        {/* 左侧编辑区 */}
        <Sider
          width={480}
          className="overflow-y-auto"
          style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid #E8E0D4' }}
          role="region"
          aria-label="编辑区域"
        >
          <div className="p-6 space-y-6">
            <Tabs
              defaultActiveKey="basic"
              items={[
                {
                  key: 'basic',
                  label: '基本信息',
                  children: (
                    <BasicInfoForm data={content.basicInfo} onChange={updateBasicInfo} />
                  ),
                },
                {
                  key: 'education',
                  label: '教育经历',
                  children: (
                    <EducationForm data={content.education} onChange={updateEducation} />
                  ),
                },
                {
                  key: 'work',
                  label: '工作经历',
                  children: (
                    <WorkForm data={content.workExperience} onChange={updateWorkExperience} />
                  ),
                },
                {
                  key: 'projects',
                  label: '项目经历',
                  children: (
                    <ProjectForm
                      data={content.projectExperience}
                      onChange={updateProjectExperience}
                    />
                  ),
                },
                {
                  key: 'skills',
                  label: '技能列表',
                  children: <SkillsForm data={content.skills} onChange={updateSkills} />,
                },
              ]}
            />
          </div>
        </Sider>

        {/* 右侧预览区 */}
        <Content
          className="overflow-y-auto flex justify-center p-6"
          style={{ backgroundColor: '#FDFBF7' }}
          role="region"
          aria-label="实时预览区域"
        >
          <div
            ref={previewRef}
            className="shadow-lg bg-white overflow-hidden"
            style={{
              width: '210mm',
              minHeight: '297mm',
            }}
          >
            <TemplateRenderer templateId={schemaKey || 'classic'} data={content} />
          </div>
        </Content>
      </Layout>

      {/* 模板选择面板 */}
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
