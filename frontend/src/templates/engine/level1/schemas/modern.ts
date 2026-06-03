/**
 * Modern Schema - 现代模板
 * 双栏布局（左侧信息 + 右侧内容）、现代感配色、卡片式区块
 */

import type { TemplateSchema } from '../../interfaces'
import { BlockType } from '../../interfaces'

export const modernSchema: TemplateSchema = {
  id: 'modern',
  name: '现代模板',
  category: '互联网',
  layout: {
    mode: 'double',
    spacing: 12,
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
    leftRatio: 0.35,
  },
  theme: {
    primaryColor: '#2563EB',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: {
      name: '22px',
      heading: '15px',
      subheading: '13px',
      body: '12px',
      small: '10px',
    },
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      background: '#FAFBFC',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      accent: '#DBEAFE',
    },
  },
  sections: [
    // 左栏
    { type: BlockType.Header, column: 'left', visible: true },
    { type: BlockType.Skills, column: 'left', visible: true },
    { type: BlockType.Education, column: 'left', visible: true },

    // 右栏
    { type: BlockType.Summary, column: 'right', visible: true },
    { type: BlockType.Experience, column: 'right', visible: true },
    { type: BlockType.Projects, column: 'right', visible: true },
  ],
}
