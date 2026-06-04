import { Button, Dropdown } from 'antd'

import {
  ArrowLeftOutlined,
  SaveOutlined,
  DownloadOutlined,
  PictureOutlined,
  SwapOutlined,
  MoreOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import SaveIndicator from './SaveIndicator'
import type { SaveStatus } from '../../hooks/useAutoSave'
import { HookAPI } from 'antd/es/modal/useModal'

interface EditorToolbarProps {
  dirty: boolean
  saving: boolean
  exporting: boolean
  saveWarning?: boolean
  saveStatus?: SaveStatus
  lastSavedAt?: string | null
  modal: HookAPI
  onBack: () => void
  onManualSave: () => void
  onExportPdf: () => void
  onExportImage: () => void
  onToggleTemplatePanel: () => void
  onFillSample: () => void
}

export default function EditorToolbar({
  dirty,
  saving,
  exporting,
  saveWarning,
  saveStatus = 'idle',
  lastSavedAt,
  modal,
  onBack,
  onManualSave,
  onExportPdf,
  onExportImage,
  onToggleTemplatePanel,
  onFillSample,
}: EditorToolbarProps) {
  const indicatorStatus: SaveStatus =
    saving ? 'syncing' : saveStatus === 'dirty' ? 'dirty' : saveStatus

  // 移动端收纳次要操作到 "更多" 菜单
  const moreMenuItems: MenuProps['items'] = [
    {
      key: 'fillSample',
      label: '填充示例',
      icon: <ThunderboltOutlined />,
      onClick: onFillSample,
    },
    {
      key: 'exportImage',
      label: '导出图片',
      icon: <PictureOutlined />,
      disabled: exporting,
      onClick: onExportImage,
    },
    {
      key: 'exportPdf',
      label: '导出 PDF',
      icon: <DownloadOutlined />,
      disabled: exporting,
      onClick: onExportPdf,
    },
  ]

  const handleBack = () => {
    if (dirty) {
      modal.confirm({
        title: '当前修改尚未保存',
        content: '离开后未保存的修改将会丢失，确定要返回吗？',
        okText: '离开',
        cancelText: '继续编辑',
        onOk: onBack,
      })
    } else {
      onBack()
    }
  }

  return (
    <header
      className="flex items-center justify-between gap-2 px-3 md:px-6 py-3 border-b"
      style={{ borderColor: '#E8E0D4', backgroundColor: '#FFFFFF' }}
      role="toolbar"
      aria-label="编辑器工具栏"
    >
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          aria-label="返回简历列表"
          size="middle"
        >
          <span className="hidden sm:inline">返回</span>
        </Button>
        <span
          className="font-serif text-base md:text-lg font-semibold truncate"
          style={{ color: '#2C1810' }}
        >
          简历编辑器
        </span>
        <SaveIndicator status={indicatorStatus} lastSavedAt={lastSavedAt} />
        {saveWarning && (
          <span
            className="hidden sm:inline-block text-sm px-2 py-0.5 rounded"
            style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
            role="alert"
          >
            自动保存暂时不可用
          </span>
        )}
      </div>

      {/* 桌面端：完整按钮组 */}
      <nav className="hidden md:flex items-center gap-3" aria-label="操作按钮">
        <Button
          icon={<ThunderboltOutlined />}
          onClick={onFillSample}
          aria-label="填充示例"
        >
          填充示例
        </Button>
        <Button icon={<SwapOutlined />} onClick={onToggleTemplatePanel} aria-label="切换模板">
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

      {/* 移动端：核心 + 更多 */}
      <nav className="flex md:hidden items-center gap-2" aria-label="操作按钮">
        <Button
          icon={<SwapOutlined />}
          onClick={onToggleTemplatePanel}
          aria-label="切换模板"
          size="middle"
        />
        <Button
          icon={<SaveOutlined />}
          loading={saving}
          onClick={onManualSave}
          disabled={!dirty}
          aria-label="手动保存简历"
          size="middle"
        />
        <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight" trigger={['click']}>
          <Button icon={<MoreOutlined />} aria-label="更多操作" size="middle" />
        </Dropdown>
      </nav>
    </header>
  )
}
