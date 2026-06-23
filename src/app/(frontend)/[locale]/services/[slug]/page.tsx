import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'

function mediaUrl(field: unknown): string | null {
  if (!field) return null
  if (typeof field === 'object' && field !== null && 'url' in field) {
    return (field as Media).url ?? null
  }
  return null
}

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
    <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px] pt-[140px] pb-[100px]">
      <h1 className="text-[40px] max-[767px]:text-[28px] font-semibold text-[#22282b] mb-12 text-center">
        {service.title}
      </h1>

      <div className="flex flex-col gap-16">
        {service.layout?.map((block, index) => {
          if (block.blockType === 'contentImage') {
            const isRight = block.position === 'right'
            const imageUrl = mediaUrl(block.image)

            return (
              <div
                key={index}
                className={`page-services-row ${isRight ? 'page-services-row-L' : 'page-services-row-R'} flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col`}
              >
                <div
                  className={`page-services-row-photo w-1/2 max-[991px]:w-full min-h-[320px] max-[991px]:min-h-0 max-[991px]:aspect-[4/3] ${
                    isRight ? 'order-2 max-[991px]:order-1' : 'order-1'
                  }`}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt={service.title} className="w-full h-full object-cover block" />
                  ) : (
                    <div className="w-full h-full bg-[#e8e0d8]" />
                  )}
                </div>

                <div
                  className={`w-1/2 max-[991px]:w-full flex flex-col justify-center gap-5 bg-[#fbf6f3] py-12 max-[1100px]:py-10 ${
                    isRight
                      ? 'page-services-row-L-text order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]'
                      : 'page-services-row-R-text order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]'
                  }`}
                >
                  <div className="prose max-w-none text-[#505a5e]">
                    <RichText data={block.text} />
                  </div>
                </div>
              </div>
            )
          }

          if (block.blockType === 'accordion') {
            return (
              <details
                key={index}
                className="group rounded-[20px] bg-[#f4ede7] border border-[#3c5557]/10 p-6 cursor-pointer"
              >
                <summary className="text-[22px] max-[767px]:text-[18px] font-semibold text-[#22282b] list-none flex justify-between items-center gap-4">
                  <span>{block.heading}</span>
                  <span className="group-open:rotate-45 transition-transform text-2xl text-[#3c5557]">+</span>
                </summary>
                <div className="mt-4 prose max-w-none text-[#505a5e]">
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
