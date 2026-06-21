import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: configPromise })

  // Шукаємо послугу за її slug та поточною мовою
  const { docs } = await payload.find({
    collection: 'services',
    where: {
      slug: { equals: slug },
    },
    locale: locale as 'es' | 'en' | 'uk',
  })

  const service = docs[0]

  if (!service) return notFound()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-950 mb-12 text-center">
        {service.title}
      </h1>

      {/* Рендеримо блоки (шахматка, акордеони), створені в адмінці Payload */}
      <div className="flex flex-col gap-16">
        {service.layout?.map((block, index) => {
          
          // Блок: Текст + Фото (Шахматка)
          // Блок: Текст + Фото (Шахматка)
          if (block.blockType === 'contentImage') {
            const isRight = block.position === 'right'
            
            // Підказуємо TypeScript, що тут лежить об'єкт із url та alt
            const image = block.image as { url?: string | null; alt?: string | null } | null

            return (
              <div key={index} className={`flex flex-col md:flex-row gap-8 items-start ${isRight ? 'md:flex-row-reverse' : ''}`}>
                
                <div className="flex-1 prose prose-lg text-gray-700 max-w-none">
                  <RichText data={block.text} />
                </div>
                
                {/* Тепер TypeScript спокійний, бо ми перевіряємо об'єкт image */}
                {image?.url && (
                  <div className="flex-1 w-full sticky top-24">
                    <img 
                      src={image.url} 
                      alt={image.alt || ''} 
                      className="w-full h-auto rounded-2xl object-cover shadow-lg"
                    />
                  </div>
                )}
              </div>
            )
          }

          // Блок: Акордеон
          if (block.blockType === 'accordion') {
            return (
              <details key={index} className="group bg-blue-50 rounded-xl p-6 cursor-pointer">
                <summary className="text-xl font-semibold text-blue-900 list-none flex justify-between items-center">
                  {block.heading}
                  <span className="group-open:rotate-45 transition-transform text-2xl">+</span>
                </summary>
                <div className="mt-4 text-gray-700 prose max-w-none">
                  <RichText data={block.content} />
                </div>
              </details>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

// Функція для генерації статичних шляхів під час білду (для швидкості та SEO)
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  // Отримуємо всі послуги з бази
  const services = await payload.find({
    collection: 'services',
    limit: 100,
  })

  const locales = ['es', 'en', 'uk']
  const params: { locale: string; slug: string }[] = []

  // Генеруємо комбінації: мова + послуга
  services.docs.forEach((service) => {
    locales.forEach((locale) => {
      params.push({ locale, slug: service.slug as string })
    })
  })

  return params
}