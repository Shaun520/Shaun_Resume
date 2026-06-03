import { Button } from 'antd'
import {
  SaveOutlined,
  DownloadOutlined,
  PictureOutlined,
  SwapOutlined,
} from '@ant-design/icons'

interface EditorToolbarProps {
  dirty: boolean
  saving: boolean
  exporting: boolean
  saveWarning?: boolean
  onManualSave: () => void
  onExportPdf: () => void
  onExportImage: () => void
  onToggleTemplatePanel: () => void
}

export default function EditorToolbar({
  dirty,
  saving,
  exporting,
  saveWarning,
  onManualSave,
  onExportPdf,
  onExportImage,
  onToggleTemplatePanel,
}: EditorToolbarProps) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{ borderColor: '#E8E0D4', backgroundColor: '#FFFFFF' }}
      role="toolbar"
      aria-label="编辑器工具栏"
    >
      <div className="flex items-center gap-4">
        <span className="font-serif text-lg font-semibold" style={{ color: '#2C1810' }}>
          简历编辑器
        </span>
        {dirty && (
          <span
            className="text-sm px-2 py-0.5 rounded"
            style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
            role="status"
            aria-live="polite"
          >
            未保存
          </span>
        )}
        {saving && (
          <span className="text-sm animate-pulse" style={{ color: '#9C8C7C' }} aria-label="保存中">
            保存中...
          </span>
        )}
        {saveWarning && (
          <span
            className="text-sm px-2 py-0.5 rounded"
            style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
            role="alert"
          >
            自动保存暂时不可用
          </span>
        )}
      </div>
      <nav className="flex items-center gap-3" aria-label="操作按钮">
        <Button
          icon={<SwapOutlined />}
          onClick={onToggleTemplatePanel}
          aria-label="切换模板"
        >
          切换模板
        </Button>
        <Button
          icon={<SaveOutlined />}
          loading={saving}
          onClick={onManualSave}
          disabled={!dirty}
          aria-label="手动保存简历"
        >
          保存
        </Button>
        <Button
          icon={<DownloadOutlined />}
          loading={exporting}
          onClick={onExportPdf}
          aria-label="导出为 PDF 文件"
        >
          导出 PDF
        </Button>
        <Button
          icon={<PictureOutlined />}
          loading={exporting}
          onClick={onExportImage}
          aria-label="导出为 PNG 图片"
        >
          导出图片
        </Button>
      </nav>
    </header>
  )
}
