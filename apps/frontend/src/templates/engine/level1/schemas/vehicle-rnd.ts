/**
 * vehicle-rnd Schema - 研发人才模板
 * 对应原型 56d：单栏、楷体、浅蓝圆形图标标题、内联头部、圆形头像
 */
import type { TemplateSchema } from '../../interfaces'
import { BlockType } from '../../interfaces'

export const vehicleRndSchema: TemplateSchema = {
  id: 'vehicle-rnd',
  name: '研发人才模板',
  category: '汽车/研发',
  layout: {
    mode: 'single',
    spacing: 18,
    padding: { top: 28, right: 28, bottom: 28, left: 28 },
  },
  theme: {
    primaryColor: '#6DA9D9',
    fontFamily: '"楷体", "KaiTi", "STKaiti", "SimKai", "楷体_GB2312", serif',
    fontSize: {
      name: '32px',
      heading: '16px',
      subheading: '14px',
      body: '14px',
      small: '12px',
    },
    colors: {
      primary: '#6DA9D9',
      secondary: '#4A90D9',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#6B6B6B',
      border: '#E0E0E0',
      accent: '#EAF3FA',
    },
    decor: {
      titleStyle: 'icon-circle',
      iconColor: '#6DA9D9',
      iconTextColor: '#FFFFFF',
      divider: 'line',
      // 区块标题：图标圆 30px / svg 15 / 描边 2.4；标题 700 + 字距 3px；分隔线 1px #e0e0e0
      iconSize: 30,
      iconSvgSize: 15,
      iconStrokeWidth: 2.4,
      titleFontWeight: 700,
      titleLetterSpacing: '3px',
      dividerColor: '#E0E0E0',
      dividerHeight: 1,
      dividerMarginTop: 9,
      dividerMarginBottom: 14,
      headerStyle: 'inline',
      avatarShape: 'circle',
      // 头部：姓名 4px 字距、墨色；英文名同行；下边框 2px 墨色；头像 96px + 白边框
      nameLetterSpacing: '4px',
      nameColor: '#1A1A1A',
      englishInline: true,
      englishColor: '#6B6B6B',
      headerBorderColor: '#1A1A1A',
      headerBorderWidth: 2,
      headerPaddingBottom: 22,
      contactColor: '#6B6B6B',
      contactGap: 22,
      avatarSize: 96,
      avatarBorderWidth: 3,
      avatarBorderColor: '#FFFFFF',
      sectionIcon: {
        [BlockType.Summary]: 'person',
        [BlockType.Experience]: 'briefcase',
        [BlockType.Projects]: 'folder',
        [BlockType.OrgExperience]: 'users',
        [BlockType.Honors]: 'trophy',
        [BlockType.Skills]: 'info',
      },
    },
  },
  sections: [
    { type: BlockType.Header, visible: true },
    { type: BlockType.Summary, visible: true },
    { type: BlockType.Experience, visible: true },
    { type: BlockType.Projects, visible: true },
    { type: BlockType.OrgExperience, visible: true },
    { type: BlockType.Honors, visible: true },
    { type: BlockType.Skills, visible: true },
  ],
}