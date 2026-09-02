/**
 * brand-comm Schema - 品牌传播模板
 * 对应原型 bdcb：单栏、楷体、左侧竖条标题、内联头部
 */
import type { TemplateSchema } from '../../interfaces'
import { BlockType } from '../../interfaces'

export const brandCommSchema: TemplateSchema = {
  id: 'brand-comm',
  name: '品牌传播模板',
  category: '传媒/公益',
  layout: {
    mode: 'single',
    spacing: 18,
    padding: { top: 28, right: 28, bottom: 28, left: 28 },
  },
  theme: {
    primaryColor: '#333333',
    fontFamily: '"楷体", "KaiTi", "STKaiti", "SimKai", "楷体_GB2312", serif',
    fontSize: {
      name: '32px',
      heading: '16px',
      subheading: '14px',
      body: '14px',
      small: '12px',
    },
    colors: {
      primary: '#333333',
      secondary: '#555555',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#555555',
      border: '#E0E0E0',
      accent: '#F2F2F2',
    },
    decor: {
      titleStyle: 'left-bar',
      divider: 'thin',
      headerStyle: 'inline',
      avatarShape: 'circle',
      // 区块标题：左侧黑色竖条 + 标题 700 + 字距 3px；分隔线 1px #e0e0e0
      leftBarColor: '#111111',
      titleFontWeight: 700,
      titleLetterSpacing: '3px',
      dividerColor: '#E0E0E0',
      dividerHeight: 1,
      dividerMarginTop: 9,
      dividerMarginBottom: 14,
      // 头部：姓名 4px 字距墨色、英文名同行；下边框 1px #e0e0e0；头像 96px 圆形
      nameLetterSpacing: '4px',
      nameColor: '#1A1A1A',
      englishInline: true,
      englishColor: '#555555',
      headerBorderColor: '#E0E0E0',
      headerBorderWidth: 1,
      headerPaddingBottom: 20,
      contactColor: '#555555',
      contactGap: 24,
      avatarSize: 96,
      avatarBorderWidth: 0,
      sectionIcon: {},
    },
  },
  sections: [
    { type: BlockType.Header, visible: true },
    { type: BlockType.Summary, visible: true },
    { type: BlockType.Experience, visible: true },
    { type: BlockType.Education, visible: true },
    { type: BlockType.OrgExperience, visible: true },
    { type: BlockType.Honors, visible: true },
    { type: BlockType.Skills, visible: true },
  ],
}