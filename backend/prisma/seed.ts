import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const templates = [
    {
      name: '经典模板',
      description: '适合传统行业，布局清晰稳重，黑白配色突出内容',
      thumbnailUrl: '/uploads/templates/classic-thumb.jpg',
      schemaKey: 'classic',
      level: 1,
      industryTags: '传统行业,金融,教育,政府',
      status: 'active',
    },
    {
      name: '现代模板',
      description: '适合互联网和科技行业，简约设计搭配色彩点缀',
      thumbnailUrl: '/uploads/templates/modern-thumb.jpg',
      schemaKey: 'modern',
      level: 1,
      industryTags: '互联网,科技,设计,媒体',
      status: 'active',
    },
    {
      name: '极简模板',
      description: '极简风格，留白充足，适合创意和设计类岗位',
      thumbnailUrl: '/uploads/templates/minimal-thumb.jpg',
      schemaKey: 'minimal',
      level: 1,
      industryTags: '创意,设计,艺术,自由职业',
      status: 'active',
    },
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { schemaKey: template.schemaKey },
      update: template,
      create: template,
    })
  }

  console.log('Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
