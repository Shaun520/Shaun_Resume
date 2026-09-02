/**
 * med-device Schema - 医疗研发模板
 * 对应原型 f385：单栏、楷体、橙色圆形图标标题、蓝横幅头部、圆形头像
 */
import type { TemplateSchema } from '../../interfaces'
import { BlockType } from '../../interfaces'

export const medDeviceSchema: TemplateSchema = {
  id: 'med-device',
  name: '医疗研发模板',
  category: '医疗/生物',
  layout: {
    mode: 'single',
    spacing: 18,
    padding: { top: 28, right: 28, bottom: 28, left: 28 },
  },
  theme: {
    primaryColor: '#E8913A',
    fontFamily: '"楷体", "KaiTi", "STKaiti", "SimKai", "楷体_GB2312", serif',
    fontSize: {
      name: '32px',
      heading: '16px',
      subheading: '14px',
      body: '14px',
      small: '12px',
    },
    colors: {
      primary: '#E8913A',
      secondary: '#4A90D9',
      background: '#FFFFFF',
      text: '#222222',
      textSecondary: '#6B6B6B',
      border: '#E6E6E6',
      accent: '#FBEEDA',
    },
    decor: {
      titleStyle: 'icon-circle',
      iconColor: '#E8913A',
      iconTextColor: '#FFFFFF',
      divider: 'line',
      headerStyle: 'banner',
      headerBannerColor: '#4A90D9',
      headerTextColor: '#FFFFFF',
      avatarShape: 'circle',
      // 区块标题：橙色圆 32px / svg 16 / 描边 2.3；标题 700 + 字距 3px；分隔线 2px #f0f2f5
      iconSize: 32,
      iconSvgSize: 16,
      iconStrokeWidth: 2.3,
      titleFontWeight: 700,
      titleLetterSpacing: '3px',
      dividerColor: '#F0F2F5',
      dividerHeight: 2,
      dividerMarginTop: 9,
      dividerMarginBottom: 14,
      // 头部横幅：姓名 4px 字距、英文名 16px；联系方式 #eaf2fa 间距 22；头像 104px + 3px 白边
      nameLetterSpacing: '4px',
      englishColor: '#FFFFFF',
      contactColor: '#EAF2FA',
      contactGap: 22,
      avatarSize: 104,
      avatarBorderWidth: 3,
      avatarBorderColor: '#FFFFFF',
      sectionIcon: {
        [BlockType.Summary]: 'lightbulb',
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
    { type: BlockType.Education, visible: true },
    { type: BlockType.OrgExperience, visible: true },
    { type: BlockType.Honors, visible: true },
    { type: BlockType.Skills, visible: true },
  ],
}