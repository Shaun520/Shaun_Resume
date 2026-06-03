/**
 * 模板注册中心
 * 管理内置模板、插件模板和 HTML 模板的注册与查找
 */

import type { ITemplate, Level1Template, TemplateMeta } from './interfaces'

class TemplateRegistry {
  private templates = new Map<string, ITemplate>()

  /** 注册 Level 1 内置模板 */
  registerBuiltIn(template: Level1Template): void {
    if (this.templates.has(template.meta.id)) {
      console.warn(`[TemplateRegistry] Template "${template.meta.id}" already registered, overwriting.`)
    }
    this.templates.set(template.meta.id, template)
  }

  /** 注册 Level 2 插件模板（预留） */
  registerPlugin(template: ITemplate): void {
    if (template.level !== 2) {
      throw new Error('[TemplateRegistry] registerPlugin only accepts level 2 templates')
    }
    this.templates.set(template.meta.id, template)
  }

  /** 注册 Level 3 HTML 模板（预留） */
  registerHtmlTemplate(template: ITemplate): void {
    if (template.level !== 3) {
      throw new Error('[TemplateRegistry] registerHtmlTemplate only accepts level 3 templates')
    }
    this.templates.set(template.meta.id, template)
  }

  /** 根据 ID 获取模板 */
  get(id: string): ITemplate | undefined {
    return this.templates.get(id)
  }

  /** 获取所有模板元信息列表 */
  getList(): TemplateMeta[] {
    return Array.from(this.templates.values()).map((t) => t.meta)
  }

  /** 按级别筛选模板 */
  getByLevel(level: 1 | 2 | 3): ITemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.level === level)
  }

  /** 清空所有模板（测试用） */
  clear(): void {
    this.templates.clear()
  }
}

/** 全局单例 */
export const templateRegistry = new TemplateRegistry()
export default TemplateRegistry
