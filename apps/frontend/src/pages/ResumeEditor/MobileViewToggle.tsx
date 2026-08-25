interface MobileViewToggleProps {
  view: 'edit' | 'preview'
  onChange: (view: 'edit' | 'preview') => void
}

/** 移动端底部视图切换（编辑 ↔ 预览） */
export default function MobileViewToggle({ view, onChange }: MobileViewToggleProps) {
  return (
    <div
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center bg-white rounded-full shadow-lg border border-warm-200 p-1"
      role="tablist"
      aria-label="移动端视图切换"
    >
      <button
        type="button"
        onClick={() => onChange('edit')}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          view === 'edit' ? 'bg-terracotta-500 text-white' : 'text-warm-700'
        }`}
        aria-selected={view === 'edit'}
        role="tab"
      >
        编辑
      </button>
      <button
        type="button"
        onClick={() => onChange('preview')}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          view === 'preview' ? 'bg-terracotta-500 text-white' : 'text-warm-700'
        }`}
        aria-selected={view === 'preview'}
        role="tab"
      >
        预览
      </button>
    </div>
  )
}
