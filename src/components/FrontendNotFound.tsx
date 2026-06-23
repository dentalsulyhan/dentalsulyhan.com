"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LinkJSXConverter, RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'

type SplitNotFoundContent = {
  title?: string | null
  content?: unknown
  buttonText?: string | null
  buttonLink?: string | null
  image?: Media | number | null
  position?: 'left' | 'right' | null
  imageWidth?: 'full' | 'contained' | null
}

type FrontendNotFoundProps = {
  locale?: 'es' | 'en' | 'uk'
  splitContent?: SplitNotFoundContent | null
}

const copy = {
  es: {
    title: 'Pagina no encontrada',
    text: 'La pagina que buscas no existe o fue movida.',
    home: 'Ir al inicio',
    services: 'Ver servicios',
    contact: 'Contacto',
    back: 'Volver atras',
  },
  en: {
    title: 'Page not found',
    text: 'The page you are looking for does not exist or has been moved.',
    home: 'Go home',
    services: 'View services',
    contact: 'Contact us',
    back: 'Go back',
  },
  uk: {
    title: 'Сторінку не знайдено',
    text: 'Сторінка, яку ви шукаєте, не існує або була переміщена.',
    home: 'На головну',
    services: 'Послуги',
    contact: 'Контакти',
    back: 'Назад',
  },
} as const

function detectLocale(pathname: string): keyof typeof copy {
  const locale = pathname.split('/')[1]
  if (locale === 'es' || locale === 'en' || locale === 'uk') return locale
  return 'es'
}

function mediaUrl(field: unknown): string | null {
  if (!field || typeof field !== 'object') return null
  if ('url' in field) return (field as Media).url ?? null
  return null
}

function internalDocToHref({ linkNode }: { linkNode: any }) {
  const doc = linkNode?.fields?.doc?.value
  const relationTo = linkNode?.fields?.doc?.relationTo
  const slug = typeof doc === 'object' && doc ? doc.slug : null

  if (!slug) return '#'

  if (relationTo === 'pages') {
    return slug === 'home' ? '/' : `/${slug}`
  }

  if (relationTo === 'services') {
    return slug === 'home' ? '/services' : `/services/${slug}`
  }

  return `/${slug}`
}

export default function FrontendNotFound({ locale: forcedLocale, splitContent }: FrontendNotFoundProps = {}) {
  const pathname = usePathname() || ''
  const locale = forcedLocale || detectLocale(pathname)
  const t = copy[locale]

  if (splitContent) {
    const imageUrl = splitContent.image ? mediaUrl(splitContent.image) : null
    const isImageLeft = (splitContent.position || 'left') === 'left'
    const isContained = splitContent.imageWidth === 'contained'

    return (
      <main className="min-h-[calc(100vh-70px)] flex items-center justify-center px-[20px] py-[60px] bg-[#fafafa]">
        <div className="relative max-w-[1200px] w-full overflow-hidden rounded-[28px] border border-[#22282b]/10 bg-white shadow-[0_20px_80px_rgba(34,40,43,0.08)]">
          <div className="relative z-10 flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col">
            <div className={`w-1/2 max-[991px]:w-full min-h-[320px] max-[991px]:min-h-0 max-[991px]:aspect-[4/3] ${isImageLeft ? 'order-1' : 'order-2 max-[991px]:order-1'} overflow-hidden ${isContained ? 'p-[28px] max-[767px]:p-[18px] bg-[#fbf6f3]' : ''}`}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={splitContent.title || t.title}
                  className={`w-full h-full block ${isContained ? 'object-contain rounded-[18px]' : 'object-cover'}`}
                />
              ) : (
                <div className={`w-full h-full ${isContained ? 'rounded-[18px] bg-[#e8e0d8]' : 'bg-[#e8e0d8]'}`} />
              )}
            </div>
            <div className={`w-1/2 max-[991px]:w-full flex flex-col justify-center gap-5 py-12 max-[1100px]:py-10 bg-[#fbf6f3] ${isImageLeft ? 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]' : 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]'}`}>
              <h1 className="text-[34px] max-[767px]:text-[26px] font-semibold leading-tight text-[#22282b]">
                {splitContent.title || t.title}
              </h1>
              <div className="prose max-w-none text-[#505a5e]">
                {splitContent.content ? (
                  <RichText
                    data={splitContent.content as any}
                    converters={({ defaultConverters }) => ({
                      ...defaultConverters,
                      ...LinkJSXConverter({ internalDocToHref }),
                    })}
                  />
                ) : (
                  <p>{t.text}</p>
                )}
              </div>
              {splitContent.buttonText && (
                <div>
                  <Link href={splitContent.buttonLink || `/${locale}`} className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-[#3c5557] text-[#3c5557] text-[15px] font-medium hover:bg-[#3c5557] hover:text-white transition-colors no-underline bg-white/80">
                    {splitContent.buttonText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-70px)] flex items-center justify-center px-[20px] py-[60px] bg-[#fafafa]">
      <div className="relative max-w-[920px] w-full overflow-hidden rounded-[28px] border border-[#22282b]/10 bg-white shadow-[0_20px_80px_rgba(34,40,43,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(60,85,87,0.12),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(232,224,216,0.8),_transparent_36%)]" />
        <div className="relative z-10 grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-[40px] max-[767px]:p-[24px] flex flex-col justify-center">
            <h1 className="text-[34px] max-[767px]:text-[26px] font-semibold leading-tight text-[#22282b] mb-4">
              {t.title}
            </h1>
            <p className="text-[16px] max-[767px]:text-[15px] leading-relaxed text-[#505a5e] max-w-[42ch]">
              {t.text}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}`} className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#3c5557] text-white border border-[#3c5557] text-[15px] font-medium hover:bg-transparent hover:text-[#3c5557] transition-colors no-underline">
                {t.home}
              </Link>
              <Link href={`/${locale}/services`} className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-[#22282b]/15 text-[#22282b] text-[15px] font-medium hover:border-[#3c5557] hover:text-[#3c5557] transition-colors no-underline">
                {t.services}
              </Link>
              <Link href={`/${locale}/#contact_us`} className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-[#22282b]/15 text-[#22282b] text-[15px] font-medium hover:border-[#3c5557] hover:text-[#3c5557] transition-colors no-underline">
                {t.contact}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="mt-5 text-left text-[14px] font-medium text-[#7a8489] hover:text-[#3c5557] transition-colors"
            >
              {t.back}
            </button>
          </div>
          <div className="min-h-[340px] bg-[#fbf6f3] flex items-center justify-center p-[30px] max-[767px]:p-[20px]">
            <div className="max-w-[300px] w-full">
              <svg viewBox="0 0 400 400" className="w-full h-auto" fill="none">
                <circle cx="200" cy="200" r="148" fill="#fff" opacity="0.8" />
                <circle cx="200" cy="200" r="122" stroke="#3c5557" strokeWidth="10" opacity="0.18" />
                <path d="M150 150h100v10h-100zM150 190h100v10h-100zM150 230h70v10h-70z" fill="#3c5557" opacity="0.35" />
                <path d="M125 276c18-20 42-30 75-30h0c33 0 57 10 75 30" stroke="#3c5557" strokeWidth="10" strokeLinecap="round" opacity="0.35" />
                <text x="200" y="135" textAnchor="middle" fill="#3c5557" fontSize="72" fontWeight="700">404</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
