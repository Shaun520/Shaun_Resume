/**
 * 内置模板注册
 * 将 Level 1 Schema 模板注册到全局 Registry
 */

import { templateRegistry } from '../TemplateRegistry'
import type { ReactNode } from 'react'
import { classicSchema } from './schemas/classic'
import { modernSchema } from './schemas/modern'
import { minimalSchema } from './schemas/minimal'
import { vehicleRndSchema } from './schemas/vehicle-rnd'
import { brandCommSchema } from './schemas/brand-comm'
import { medDeviceSchema } from './schemas/med-device'
import type { Level1Template, ResumeContent, RenderContext, TemplateSchema } from '../interfaces'

function createLevel1Template(schema: TemplateSchema): Level1Template {
  const isKaiti = /KaiTi/i.test(schema.theme.fontFamily)
  return {
    level: 1,
    meta: {
      id: schema.id,
      name: schema.name,
      author: 'Shaun Resume',
      category: schema.category,
      tags: Array.from(
        new Set([
          schema.category,
          schema.layout.mode === 'double' ? '双栏' : '单栏',
          ...(isKaiti ? ['楷体'] : []),
        ]),
      ),
      thumbnail: '',
      description: `${schema.name} - ${schema.category}行业适用`,
      level: 1,
    },
    schema,
    /**
     * Level 1 模板不通过 render() 方法渲染。
     * 实际渲染由 TemplateRenderer 检测 template.level === 1 后
     * 委托给 SchemaRenderer 完成。此方法仅满足 ITemplate 接口契约，
     * 不应被直接调用。
     */
    render(_data: ResumeContent, _ctx: RenderContext): ReactNode {
      return null
    },
  }
}

export function registerBuiltInTemplates(): void {
  templateRegistry.registerBuiltIn(createLevel1Template(classicSchema))
  templateRegistry.registerBuiltIn(createLevel1Template(modernSchema))
  templateRegistry.registerBuiltIn(createLevel1Template(minimalSchema))
  templateRegistry.registerBuiltIn(createLevel1Template(vehicleRndSchema))
  templateRegistry.registerBuiltIn(createLevel1Template(brandCommSchema))
  templateRegistry.registerBuiltIn(createLevel1Template(medDeviceSchema))
}

export { classicSchema, modernSchema, minimalSchema, vehicleRndSchema, brandCommSchema, medDeviceSchema }
