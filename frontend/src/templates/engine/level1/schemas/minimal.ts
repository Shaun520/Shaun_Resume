/**
 * Minimal Schema - 极简模板
 * 单栏极简布局、大量留白、最小化装饰元素
 */

import type { TemplateSchema } from '../../interfaces'
import { BlockType } from '../../interfaces'

export const minimalSchema: TemplateSchema = {
  id: 'minimal',
  name: '极简模板',
  category: '设计',
  layout: {
    mode: 'single',
    spacing: 24,
    padding: { top: 32, right: 32, bottom: 32, left: 32 },
  },
  theme: {
    primaryColor: '#374151',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    fontSize: {
      name: '28px',
      heading: '14px',
      subheading: '13px',
      body: '12px',
      small: '10px',
    },
    colors: {
      primary: '#111827',
      secondary: '#374151',
      background: '#FFFFFF',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      accent: '#F3F4F6',
    },
  },
  sections: [
    { type: BlockType.Header, visible: true },
    { type: BlockType.Summary, visible: true },
    { type: BlockType.Experience, visible: true },
    { type: BlockType.Education, visible: true },
    { type: BlockType.Projects, visible: false },
    { type: BlockType.Skills, visible: true },
  ],
}
