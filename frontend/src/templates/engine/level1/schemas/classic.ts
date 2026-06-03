/**
 * Classic Schema - 经典模板
 * 单栏布局、terracotta 主色、传统分节样式
 */

import type { TemplateSchema } from '../../interfaces'
import { BlockType } from '../../interfaces'

export const classicSchema: TemplateSchema = {
  id: 'classic',
  name: '经典模板',
  category: '通用',
  layout: {
    mode: 'single',
    spacing: 16,
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
  },
  theme: {
    primaryColor: '#B8651A',
    fontFamily: '"SimSun", "STSong", serif',
    fontSize: {
      name: '24px',
      heading: '16px',
      subheading: '14px',
      body: '13px',
      small: '11px',
    },
    colors: {
      primary: '#B8651A',
      secondary: '#8B4513',
      background: '#FFFFFF',
      text: '#2C2C2C',
      textSecondary: '#666666',
      border: '#D4A574',
      accent: '#F5E6D3',
    },
  },
  sections: [
    { type: BlockType.Header, visible: true },
    { type: BlockType.Summary, visible: true },
    { type: BlockType.Experience, visible: true },
    { type: BlockType.Education, visible: true },
    { type: BlockType.Projects, visible: true },
    { type: BlockType.Skills, visible: true },
  ],
}
