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
    {
      name: '研发人才模板',
      description: '系列岗位简历风格：楷体正文，浅蓝圆形图标分区，适合汽车/研发方向',
      thumbnailUrl: '/uploads/templates/vehicle-rnd-thumb.png',
      schemaKey: 'vehicle-rnd',
      level: 1,
      industryTags: '汽车,研发,工程,制造',
      status: 'active',
    },
    {
      name: '品牌传播模板',
      description: '黑白竖杠分区，楷体正文，适合传媒/公益/品牌方向',
      thumbnailUrl: '/uploads/templates/brand-comm-thumb.png',
      schemaKey: 'brand-comm',
      level: 1,
      industryTags: '传媒,公益,品牌,营销',
      status: 'active',
    },
    {
      name: '医疗研发模板',
      description: '蓝色横幅头部，橙色圆形图标分区，楷体正文，适合医疗/生物研发方向',
      thumbnailUrl: '/uploads/templates/med-device-thumb.png',
      schemaKey: 'med-device',
      level: 1,
      industryTags: '医疗,生物,器械,研发',
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
