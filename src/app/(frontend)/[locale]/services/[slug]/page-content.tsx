import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import ContactForm from '../../../../../components/ContactForm'
import AccordionList from '../../../../../components/AccordionList'
import type { Media, Pricing, Service, SiteContact, SiteSetting } from '@/payload-types'
import { getBlockTheme, getButtonStyle, getThemeBackgroundStyle } from '@/lib/blockThemes'
import { buildLocalizedPath } from '@/lib/localizedRouting'
import { resolveInternalHref } from '@/lib/internalLinkResolver'
import { buildBreadcrumbStructuredData, buildFaqStructuredData } from '@/lib/structuredData'

function mediaUrl(field: unknown): string | null {
  if (!field) return null
  if (typeof field === 'object' && field !== null && 'url' in field) {
    return (field as Media).url ?? null
  }
  return null
}

function isPricingDoc(value: number | Pricing): value is Pricing {
  return typeof value === 'object' && value !== null
}

function isServiceDoc(value: number | Service): value is Service {
  return typeof value === 'object' && value !== null
}

function isCompactSpacing(block: unknown): boolean {
  return typeof block === 'object' && block !== null && Boolean((block as { compactSpacing?: boolean }).compactSpacing)
}

function hexToRgb(hex: string) {
  const sanitized = hex.replace('#', '').trim()
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map((char) => char + char)
          .join('')
      : sanitized

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function getOverlayTextTone(backgroundImageUrl: string | null, overlayColor: string, overlayOpacity: number) {
  if (!backgroundImageUrl) return 'dark'

  const rgb = hexToRgb(overlayColor)
  if (!rgb) return 'light'

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  const effectiveBrightness = brightness * overlayOpacity + 255 * (1 - overlayOpacity)

  return effectiveBrightness < 165 ? 'light' : 'dark'
}

function getCenteredGridClass(columns: '2' | '3' | '4', itemIndex: number, totalItems: number) {
  return getGridItemClass(columns, itemIndex, totalItems, 'center')
}

function getGridItemClass(
  columns: '2' | '3' | '4',
  itemIndex: number,
  totalItems: number,
  incompleteRowAlignment: 'center' | 'start' = 'center',
) {
  const columnCount = Number(columns)
  const remainder = totalItems % columnCount
  const baseClass = columns === '2' ? 'col-span-6' : columns === '3' ? 'col-span-4' : 'col-span-3'

  if (incompleteRowAlignment === 'start') return baseClass

  if (remainder === 0 || totalItems <= columnCount) return baseClass

  const lastRowStart = totalItems - remainder
  if (itemIndex < lastRowStart) return baseClass

  const offset = itemIndex - lastRowStart

  if (columns === '2' && remainder === 1) return `${baseClass} col-start-4`

  if (columns === '3') {
    if (remainder === 1) return `${baseClass} col-start-5`
    if (remainder === 2) return offset === 0 ? `${baseClass} col-start-3` : `${baseClass} col-start-7`
  }

  if (columns === '4') {
    if (remainder === 1) return `${baseClass} col-start-5`
    if (remainder === 2) return offset === 0 ? `${baseClass} col-start-3` : `${baseClass} col-start-7`
    if (remainder === 3) {
      return offset === 0
        ? `${baseClass} col-start-2`
        : offset === 1
          ? `${baseClass} col-start-5`
          : `${baseClass} col-start-8`
    }
  }

  return baseClass
}

function getDefaultPatientTypeOptions(locale: string) {
  if (locale === 'uk') return [{ label: 'Новий пацієнт' }, { label: 'Існуючий пацієнт' }]
  if (locale === 'en') return [{ label: 'New patient' }, { label: 'Existing patient' }]
  return [{ label: 'Nuevo paciente' }, { label: 'Paciente existente' }]
}

function getDefaultReferralSourceOptions(locale: string) {
  if (locale === 'uk') {
    return [
      { label: 'Instagram' },
      { label: 'Google' },
      { label: 'Facebook' },
      { label: 'Рекомендація' },
      { label: 'Інше' },
    ]
  }
  if (locale === 'en') {
    return [
      { label: 'Instagram' },
      { label: 'Google' },
      { label: 'Facebook' },
      { label: 'Recommendation' },
      { label: 'Other' },
    ]
  }
  return [
    { label: 'Instagram' },
    { label: 'Google' },
    { label: 'Facebook' },
    { label: 'Recomendación' },
    { label: 'Otro' },
  ]
}

type ContactData = SiteContact & {
  socialLinks?: SiteSetting['socialLinks']
}

const primaryButtonClass = getButtonStyle('primary')

export async function ServiceDetailPageContent({
  locale,
  slug,
}: {
  locale: string
  slug: string
}) {
  const payload = await getPayload({ config: configPromise })
  const [allPagesResult, allServicesResult] = await Promise.all([
    payload.find({
      collection: 'pages',
      locale: locale as 'es' | 'en' | 'uk',
      fallbackLocale: false,
      limit: 200,
    }),
    payload.find({
      collection: 'services',
      locale: locale as 'es' | 'en' | 'uk',
      fallbackLocale: false,
      limit: 200,
    }),
  ])

  const pagePaths = Object.fromEntries(
    allPagesResult.docs
      .filter((page) => typeof page.slug === 'string' && typeof page.path === 'string')
      .map((page) => [page.slug, { path: page.slug === 'home' ? '/' : `/${page.path}` }]),
  )
  const servicePaths = Object.fromEntries(
    allServicesResult.docs
      .filter((service) => typeof service.slug === 'string' && typeof service.path === 'string')
      .map((service) => [service.slug, { path: service.path }]),
  )

  const { docs } = await payload.find({
    collection: 'services',
    where: {
      path: { equals: slug },
    },
    locale: locale as 'es' | 'en' | 'uk',
    fallbackLocale: false,
    depth: 3,
    limit: 1,
  })

  const service = docs[0]
  if (!service) return notFound()
  const servicePageResult = await payload.find({
    collection: 'pages',
    locale: locale as 'es' | 'en' | 'uk',
    fallbackLocale: false,
    where: {
      slug: {
        equals: 'services',
      },
    },
    limit: 1,
  })
  const servicesPage = servicePageResult.docs[0]
  const servicesBasePath = `/${servicesPage?.path || 'services'}`
  const resolveHref = (link: string | null | undefined) =>
    resolveInternalHref({
      link,
      locale,
      pagePaths,
      servicePaths,
      servicesPagePath: servicesBasePath,
    })

  let siteSettings: SiteSetting | null = null
  try {
    siteSettings = (await payload.findGlobal({
      slug: 'site-settings',
      locale: locale as 'es' | 'en' | 'uk',
    })) as SiteSetting
  } catch (error) {
    console.error('Error fetching site settings for service page:', error)
  }

  let siteContacts: SiteContact = {} as SiteContact
  try {
    siteContacts = (await payload.findGlobal({
      slug: 'site-contacts',
      locale: locale as 'es' | 'en' | 'uk',
    })) as SiteContact
  } catch (error) {
    console.error('Error fetching site contacts for service page:', error)
  }

  const contacts: ContactData = {
    ...siteContacts,
    ...(siteSettings?.contacts || {}),
    socialLinks: siteSettings?.socialLinks || siteContacts?.socialLinks || [],
  }

  const globalContact = siteSettings?.globalContactSection
  const serviceLayout = service.layout || []
  const faqStructuredData = buildFaqStructuredData(
    serviceLayout.flatMap((block) => {
      if (block.blockType !== 'faq') return []

      return (block.items || []).map((item) => ({
        heading: item.heading,
        content: item.content,
      }))
    }),
  )
  const breadcrumbStructuredData = buildBreadcrumbStructuredData([
    {
      name: locale === 'uk' ? 'Головна' : locale === 'en' ? 'Home' : 'Inicio',
      path: locale === 'es' ? '/' : `/${locale}`,
    },
    {
      name: servicesPage?.title || (locale === 'uk' ? 'Послуги' : locale === 'en' ? 'Services' : 'Servicios'),
      path: servicesBasePath,
    },
    {
      name: service.title,
      path: buildLocalizedPath(locale, `${servicesBasePath}/${service.path || service.slug}`),
    },
  ])

  const copy = {
    phoneLabel: siteSettings?.contacts?.phoneLabel || (locale === 'uk' ? 'Телефон' : locale === 'en' ? 'Phone' : 'Telefono'),
    emailLabel: siteSettings?.contacts?.emailLabel || 'Email',
    addressLabel: siteSettings?.contacts?.addressLabel || (locale === 'uk' ? 'Адреса' : locale === 'en' ? 'Address' : 'Direccion'),
    transportLabel:
      siteSettings?.contacts?.transportLabel ||
      (locale === 'uk' ? 'Як дістатися' : locale === 'en' ? 'How to get here' : 'Como llegar'),
    socialLabel:
      siteSettings?.contacts?.socialLabel ||
      (locale === 'uk' ? 'Соцмережі' : locale === 'en' ? 'Social media' : 'Redes sociales'),
    detailsLabel:
      locale === 'uk' ? 'Детальніше' : locale === 'en' ? 'Learn more' : 'Mas informacion',
  }

  return (
    <>
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
      )}
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}
      <main>
      {serviceLayout.map((block, idx) => {
        switch (block.blockType) {
          case 'hero': {
            const imageUrl = mediaUrl(block.image)
            const buttonClass = getButtonStyle(block.buttonStyle)
            const theme = getBlockTheme(block.theme)
            return (
              <section key={block.id || idx} className={`pt-[10px] ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                <div className="flex items-stretch min-h-[400px] max-[991px]:min-h-0 max-[991px]:flex-col">
                  <div className={`w-1/2 max-[991px]:w-full flex flex-col justify-center pl-[max(30px,calc((100vw-1200px)/2))] pr-[30px] py-16 max-[1100px]:px-[24px] max-[1100px]:py-12 max-[767px]:px-[20px] max-[767px]:py-10 ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                    <h1 className="text-[32px] leading-[50px] max-[767px]:text-[24px] max-[767px]:leading-[35px] font-semibold mb-5 text-[#22282b]">
                      {block.title}
                    </h1>
                    {block.subtitle && (
                      <p className="text-[18px] max-[767px]:text-[15px] text-[#909da2] mb-8 leading-relaxed">
                        {block.subtitle}
                      </p>
                    )}
                    {block.buttonText && (
                      <div>
                        <a href={resolveHref(block.buttonLink)} className={buttonClass}>
                          {block.buttonText}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="w-1/2 max-[991px]:w-full relative overflow-hidden h-[clamp(400px,44vw,640px)] max-[991px]:h-auto max-[991px]:min-h-[300px] max-[991px]:aspect-[4/3]">
                    {imageUrl ? <img src={imageUrl} alt={block.title} className="w-full h-full object-cover block" /> : <div className="w-full h-full bg-[#e8e0d8]" />}
                  </div>
                </div>
              </section>
            )
          }

          case 'content': {
            const compactSpacing = isCompactSpacing(block)
            const theme = getBlockTheme(block.theme)
            const buttonClass = getButtonStyle(block.buttonStyle)
            const contentWidthClass = block.fullWidthContent ? 'max-w-[1200px]' : 'max-w-[900px]'
            const backgroundImageUrl = mediaUrl((block as { backgroundImage?: unknown }).backgroundImage)
            const hasBackgroundImage = Boolean(backgroundImageUrl)
            const overlayColor = typeof (block as { overlayColor?: unknown }).overlayColor === 'string'
              ? (block as { overlayColor?: string }).overlayColor
              : '#000000'
            const overlayOpacityValue = typeof (block as { overlayOpacity?: unknown }).overlayOpacity === 'number'
              ? (block as { overlayOpacity?: number }).overlayOpacity
              : 35
            const overlayOpacity = Math.min(100, Math.max(0, overlayOpacityValue ?? 35)) / 100
            const textTone = getOverlayTextTone(backgroundImageUrl, overlayColor || '#000000', overlayOpacity)
            const isLightText = textTone === 'light'

            return (
              <section
                key={block.id || idx}
                className={backgroundImageUrl ? 'relative overflow-hidden' : compactSpacing ? `py-[50px] max-[767px]:py-[32px] ${theme.section}` : `py-[100px] max-[767px]:py-[64px] ${theme.section}`}
                style={backgroundImageUrl ? undefined : getThemeBackgroundStyle(theme, 'section')}
              >
                {backgroundImageUrl && (
                  <>
                    <img src={backgroundImageUrl} alt={block.title || 'Content background'} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
                  </>
                )}
                <div className={`relative z-10 ${contentWidthClass} mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px] ${backgroundImageUrl ? (compactSpacing ? 'py-[50px] max-[767px]:py-[32px]' : 'py-[100px] max-[767px]:py-[64px]') : ''}`}>
                  {block.title && (
                    <h2 className={`text-[32px] max-[767px]:text-[24px] font-semibold text-center ${hasBackgroundImage ? (isLightText ? 'text-force-white' : 'text-force-dark') : 'text-[#3c5557]'} ${block.content || block.bottomText ? 'mb-6' : 'mb-0'}`}>
                      {block.title}
                    </h2>
                  )}
                  {block.content && (
                    <div
                      className={`prose prose-lg max-w-none max-[767px]:text-left ${
                        hasBackgroundImage
                          ? isLightText
                            ? 'prose-light'
                            : 'prose-dark'
                          : 'text-[#22282b]'
                      }`}
                    >
                      <RichText data={block.content} />
                    </div>
                  )}
                  {block.bottomText && (
                    <div
                      className={`prose prose-lg max-w-none mt-8 max-[767px]:text-left ${
                        hasBackgroundImage
                          ? isLightText
                            ? 'prose-light'
                            : 'prose-dark'
                          : 'text-[#22282b]'
                      }`}
                    >
                      <RichText data={block.bottomText} />
                    </div>
                  )}
                  {block.buttonText && (
                    <div className="mt-6 text-center">
                      <a href={resolveHref(block.buttonLink)} className={buttonClass}>
                        {block.buttonText}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'contentImage': {
            const imageUrl = mediaUrl(block.image)
            const isImageLeft = (block.position || 'left') === 'left'
            const isImageContained = (block as { imageWidth?: unknown }).imageWidth === 'contained'
            const theme = getBlockTheme(block.theme)
            const buttonClass = getButtonStyle(block.buttonStyle)

            return (
              <section key={block.id || idx} className={`flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                <div className={`w-1/2 max-[991px]:w-full min-h-[420px] max-[991px]:min-h-[320px] max-[991px]:aspect-[4/3] relative overflow-hidden ${isImageLeft ? 'order-1' : 'order-2 max-[991px]:order-1'} ${isImageContained ? 'flex items-center justify-center p-[24px] max-[1100px]:p-[20px] max-[767px]:p-[16px]' : ''}`}>
                  <div className={isImageContained ? 'relative w-full max-w-[520px] h-full min-h-[420px] max-[991px]:max-w-none max-[991px]:h-full max-[991px]:min-h-[320px] overflow-hidden rounded-[24px] shadow-[0_18px_40px_rgba(34,40,43,0.08)]' : 'relative w-full h-full min-h-[420px] max-[991px]:min-h-[320px] overflow-hidden'}>
                    {imageUrl ? <img src={imageUrl} alt={block.title || service.title} className="absolute inset-0 w-full h-full object-cover block" /> : <div className="w-full h-full bg-[#e8e0d8]" />}
                  </div>
                </div>
                <div className={`w-1/2 max-[991px]:w-full flex flex-col justify-center gap-5 py-12 max-[1100px]:py-10 ${theme.panel} ${isImageLeft ? 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]' : 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]'}`} style={getThemeBackgroundStyle(theme, 'panel')}>
                  {block.title && <h2 className="text-[24px] max-[767px]:text-[20px] font-semibold text-[#3c5557]">{block.title}</h2>}
                  <div className="prose max-w-none text-[#22282b]">
                    <RichText data={block.text} />
                  </div>
                  {block.buttonText && (
                    <div className="mt-4">
                      <a href={resolveHref(block.buttonLink)} className={buttonClass}>
                        {block.buttonText}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'advantages': {
            const isRowLayout = (block.itemLayout || 'column') === 'row'
            const compactSpacing = isCompactSpacing(block)
            const theme = getBlockTheme(block.theme)
            const buttonClass = getButtonStyle(block.buttonStyle)
            const textWidthClass = block.fullWidthText ? 'max-w-[1200px]' : 'max-w-[760px]'
            const desktopColumns = (block as { columns?: '2' | '3' | '4' }).columns || '3'
            const incompleteRowAlignment =
              (block as { incompleteRowAlignment?: 'center' | 'start' }).incompleteRowAlignment || 'center'
            const items = block.items || []
            const advantagesBottomText = (block as { bottomText?: unknown }).bottomText
            return (
              <section
                key={block.id || idx}
                className={compactSpacing ? `${theme.section} py-[56px] max-[767px]:py-[40px]` : `${theme.section} py-[100px] max-[767px]:py-[64px]`}
                style={getThemeBackgroundStyle(theme, 'section')}
              >
                <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px]">
                  {block.sectionTitle && (
                    <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-center mb-[60px] max-[767px]:mb-8 text-[#3c5557]">
                      {block.sectionTitle}
                    </h2>
                  )}
                  {block.subtitle && (
                    <div className={`mobile-richtext-left prose prose-lg ${textWidthClass} mx-auto text-[#505a5e] text-center mb-10 max-[767px]:text-left`}>
                      <RichText data={block.subtitle} />
                    </div>
                  )}
                  <div className="grid grid-cols-12 gap-x-8 gap-y-10 max-[1200px]:grid-cols-2 max-[1200px]:gap-x-8 max-[1200px]:gap-y-8 max-[767px]:grid-cols-1 max-[767px]:gap-y-6">
                    {items.map((item, itemIndex) => {
                      const iconUrl = mediaUrl(item.icon)
                      return (
                        <div
                          key={item.id || itemIndex}
                          className={`flex flex-col items-center text-center gap-4 w-full ${getGridItemClass(desktopColumns, itemIndex, items.length, incompleteRowAlignment)} max-[1200px]:col-span-1 max-[1200px]:col-start-auto max-[767px]:col-span-1 ${isRowLayout ? 'max-[767px]:items-center max-[767px]:text-center' : 'max-[767px]:items-start max-[767px]:text-left'}`}
                        >
                          <div className={`flex w-full ${isRowLayout ? 'flex-row items-center gap-4 text-left max-[767px]:flex-col max-[767px]:justify-center max-[767px]:gap-3 max-[767px]:text-center' : `flex-col items-center text-center ${item.title ? 'gap-5' : 'gap-2'} max-[767px]:flex-col max-[767px]:justify-start max-[767px]:text-left`}`}>
                            {iconUrl ? (
                              <img src={iconUrl} alt={item.title || 'Advantage icon'} className="w-auto h-[50px] shrink-0" />
                            ) : (
                              <div className="w-[50px] h-[50px] rounded-full bg-[#3c5557]/10 flex items-center justify-center shrink-0">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#3c5557]">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="currentColor"/>
                                </svg>
                              </div>
                            )}
                            {item.title && <h3 className={`text-[20px] font-medium text-[#22282b] ${isRowLayout ? 'mb-0' : ''}`}>{item.title}</h3>}
                          </div>
                          {item.text && (
                            <div className={`${isRowLayout ? 'text-center' : 'mobile-richtext-left max-[767px]:text-left max-[767px]:[&_p]:text-left max-[767px]:[&_li]:text-left'} text-[14px] text-[#909da2] leading-relaxed prose max-w-none prose-p:my-0 prose-p:text-[14px] prose-li:text-[14px]`}>
                              <RichText data={item.text} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {block.buttonText && (
                    <div className="mt-[50px] text-center">
                      <a href={resolveHref(block.buttonLink)} className={buttonClass}>
                        {block.buttonText}
                      </a>
                    </div>
                  )}
                  {Boolean(advantagesBottomText) && (
                    <div className={`mobile-richtext-left prose prose-lg ${textWidthClass} mx-auto text-[#505a5e] text-center mt-10 max-[767px]:text-left`}>
                      <RichText data={advantagesBottomText as never} />
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'cards': {
            const compactSpacing = isCompactSpacing(block)
            const itemLayout = block.itemLayout || 'column'
            const theme = getBlockTheme(block.theme)
            const buttonClass = getButtonStyle(block.buttonStyle)
            const items = block.items || []
            const cardsBottomText = (block as { bottomText?: unknown }).bottomText
            const desktopColumns = (block as { columns?: '2' | '3' | '4' }).columns || '4'
            const incompleteRowAlignment =
              (block as { incompleteRowAlignment?: 'center' | 'start' }).incompleteRowAlignment || 'center'
            return (
              <section key={block.id || idx} className={compactSpacing ? `py-[50px] max-[767px]:py-[32px] ${theme.section}` : `py-[100px] max-[767px]:py-[64px] ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px]">
                  {block.sectionTitle && <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-[#22282b] text-center mb-8 max-[767px]:mb-6">{block.sectionTitle}</h2>}
                  {block.intro && (
                    <div className="mobile-richtext-left prose prose-lg max-w-[900px] mx-auto text-[#505a5e] text-center mb-10 max-[767px]:mb-8 max-[767px]:text-left">
                      <RichText data={block.intro} />
                    </div>
                  )}
                  <div className="grid grid-cols-12 gap-x-6 gap-y-8 max-[1200px]:grid-cols-2 max-[1200px]:gap-x-6 max-[1200px]:gap-y-6 max-[767px]:grid-cols-1 max-[767px]:gap-y-4">
                    {items.map((item, itemIndex) => {
                      const iconUrl = mediaUrl(item.icon)
                      return (
                        <div
                          key={item.id || itemIndex}
                          className={`relative h-full border-t border-[#3c5557]/[0.16] pt-4 max-[767px]:pt-3 ${getGridItemClass(desktopColumns, itemIndex, items.length, incompleteRowAlignment)} max-[1200px]:col-span-1 max-[1200px]:col-start-auto max-[767px]:col-span-1`}
                        >
                          {(iconUrl || item.title) && (
                            <div className={`flex ${itemLayout === 'row' ? `items-start ${item.title ? 'gap-3' : 'gap-2'}` : `flex-col ${item.title ? 'gap-2' : 'gap-1'}`} ${item.title ? 'mb-3' : 'mb-2'}`}>
                              {iconUrl && (
                                <div className={`w-[38px] h-[38px] rounded-[12px] bg-[#3c5557]/[0.05] flex items-center justify-center shrink-0 ${item.title ? 'mt-[2px]' : 'mt-0'}`}>
                                  <img src={iconUrl} alt={item.title || 'Card icon'} className="w-[20px] h-[20px] object-contain shrink-0" />
                                </div>
                              )}
                              {item.title && <h3 className="text-[16px] max-[767px]:text-[14px] font-semibold text-[#2d4447] mb-0 leading-snug tracking-[-0.01em]">{item.title}</h3>}
                            </div>
                          )}
                          {item.text && (
                            <div className="mobile-richtext-left prose max-w-none text-[13px] leading-[1.6] text-[#5a666b] prose-p:my-0 prose-p:text-[13px] prose-p:leading-[1.6] prose-li:my-1 prose-li:text-[13px] prose-li:leading-[1.6] max-[767px]:text-left">
                              <RichText data={item.text} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {block.buttonText && (
                    <div className="mt-8 text-center">
                      <a href={resolveHref(block.buttonLink)} className={buttonClass}>
                        {block.buttonText}
                      </a>
                    </div>
                  )}
                  {Boolean(cardsBottomText) && (
                    <div className="mobile-richtext-left prose prose-lg max-w-[900px] mx-auto text-[#505a5e] text-center mt-10 max-[767px]:mt-8 max-[767px]:text-left">
                      <RichText data={cardsBottomText as never} />
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'steps': {
            const compactSpacing = isCompactSpacing(block)
            const theme = getBlockTheme(block.theme)
            return (
              <section key={block.id || idx} className={compactSpacing ? `py-[50px] max-[767px]:py-[32px] ${theme.section}` : `py-[100px] max-[767px]:py-[64px] ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                <div className="max-w-[1100px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px]">
                  {block.sectionTitle && <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-[#22282b] text-center mb-10">{block.sectionTitle}</h2>}
                  <div className="grid grid-cols-2 gap-6 max-[767px]:grid-cols-1">
                    {block.items?.map((item, itemIndex) => (
                      <div key={item.id || itemIndex} className={`rounded-[24px] ${theme.cardAlt} p-7 max-[767px]:p-5`} style={getThemeBackgroundStyle(theme, 'cardAlt')}>
                        <div className="flex items-start gap-4">
                          <div
                            style={{ fontFamily: 'var(--second-font)' }}
                            className="w-[42px] h-[42px] rounded-full bg-[#3c5557] text-white flex items-center justify-center text-[18px] font-semibold shrink-0"
                          >
                            {itemIndex + 1}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[22px] max-[767px]:text-[19px] font-semibold text-[#3c5557] mb-3">{item.title}</h3>
                            <div className="prose max-w-none text-[#505a5e]">
                              <RichText data={item.text} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          case 'faq': {
            const compactSpacing = isCompactSpacing(block)
            const theme = getBlockTheme(block.theme)
            const faqColumns = block.columns === 'two'
            const faqBottomText = (block as { bottomText?: unknown }).bottomText
            const textWidthClass = (block as { fullWidthText?: boolean }).fullWidthText ? 'max-w-[1200px]' : 'max-w-[760px]'
            return (
              <section key={block.id || idx} className={compactSpacing ? `py-[50px] max-[767px]:py-[32px] ${theme.section}` : `py-[100px] max-[767px]:py-[64px] ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px]">
                  {block.sectionTitle && <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-[#22282b] text-center mb-10">{block.sectionTitle}</h2>}
                  {block.intro && (
                    <div className={`prose prose-lg ${textWidthClass} mx-auto text-[#505a5e] mb-10 text-center max-[767px]:text-left`}>
                      <RichText data={block.intro} />
                    </div>
                  )}
                  <AccordionList
                    items={block.items}
                    columns={faqColumns ? 2 : 1}
                    itemClassName={`rounded-[18px] ${theme.card} border border-[#3c5557]/10 px-5 py-4 max-[767px]:px-4 max-[767px]:py-3`}
                    headingClassName="text-[18px] max-[767px]:text-[16px] font-semibold text-[#22282b]"
                    iconClassName="text-[24px] text-[#3c5557]"
                    contentClassName="prose max-w-none text-[14px] leading-relaxed text-[#505a5e] prose-p:my-0 prose-li:text-[14px]"
                  />
                  {Boolean(faqBottomText) && (
                    <div className={`prose prose-lg ${textWidthClass} mx-auto text-[#505a5e] mt-10 text-center max-[767px]:text-left`}>
                      <RichText data={faqBottomText as never} />
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'comparison': {
            const compactSpacing = isCompactSpacing(block)
            const theme = getBlockTheme(block.theme)
            const isSplitLayout = block.layoutStyle === 'split'
            const backgroundImageUrl = mediaUrl((block as { backgroundImage?: unknown }).backgroundImage)
            const overlayColor = typeof (block as { overlayColor?: unknown }).overlayColor === 'string'
              ? (block as { overlayColor?: string }).overlayColor
              : '#000000'
            const overlayOpacityValue = typeof (block as { overlayOpacity?: unknown }).overlayOpacity === 'number'
              ? (block as { overlayOpacity?: number }).overlayOpacity
              : 35
            const overlayOpacity = Math.min(100, Math.max(0, overlayOpacityValue ?? 35)) / 100
            const textTone = getOverlayTextTone(backgroundImageUrl, overlayColor || '#000000', overlayOpacity)
            const isLightText = textTone === 'light'
            const leftContent = (block as { leftContent?: unknown }).leftContent
            const rightContent = (block as { rightContent?: unknown }).rightContent

            if (isSplitLayout) {
              return (
                <section
                  key={block.id || idx}
                  className={`relative overflow-hidden ${compactSpacing ? 'py-[56px] max-[767px]:py-[40px]' : 'py-[110px] max-[767px]:py-[70px]'} ${backgroundImageUrl ? '' : theme.section}`}
                  style={backgroundImageUrl ? undefined : getThemeBackgroundStyle(theme, 'section')}
                >
                  {backgroundImageUrl && (
                    <>
                      <img src={backgroundImageUrl} alt={block.sectionTitle || 'Comparison background'} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
                    </>
                  )}
                  <div className="relative z-10 max-w-[1120px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px]">
                    {block.sectionTitle && (
                      <h2 className={`text-[34px] max-[767px]:text-[24px] font-semibold text-center mb-6 ${backgroundImageUrl ? (isLightText ? 'text-force-white' : 'text-force-dark') : 'text-[#22282b]'}`}>
                        {block.sectionTitle}
                      </h2>
                    )}
                    {block.intro && (
                      <div className={`mobile-richtext-left prose prose-lg max-w-[820px] mx-auto text-center mb-12 max-[767px]:text-left ${backgroundImageUrl ? (isLightText ? 'prose-light' : 'prose-dark') : 'text-[#505a5e]'}`}>
                        <RichText data={block.intro} />
                      </div>
                    )}
                    <div className="grid grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] gap-x-10 items-start max-[767px]:grid-cols-1 max-[767px]:gap-y-8">
                      <div className={backgroundImageUrl && isLightText ? 'text-white' : ''}>
                        <h3 className={`text-[24px] max-[767px]:text-[20px] font-semibold mb-5 ${backgroundImageUrl ? (isLightText ? 'text-force-white' : 'text-force-dark') : 'text-[#3c5557]'}`}>{block.leftColumnTitle}</h3>
                        {Boolean(leftContent) && (
                          <div className={`prose max-w-none ${backgroundImageUrl ? (isLightText ? 'prose-light' : 'prose-dark') : 'text-[#505a5e]'}`}>
                            <RichText data={leftContent as never} />
                          </div>
                        )}
                      </div>
                      <div className={`w-px self-stretch ${backgroundImageUrl ? (isLightText ? 'bg-white/30 max-[767px]:hidden' : 'bg-[#22282b]/20 max-[767px]:hidden') : 'bg-[#3c5557]/15 max-[767px]:hidden'}`} />
                      <div className={backgroundImageUrl && isLightText ? 'text-white' : ''}>
                        <h3 className={`text-[24px] max-[767px]:text-[20px] font-semibold mb-5 ${backgroundImageUrl ? (isLightText ? 'text-force-white' : 'text-force-dark') : 'text-[#3c5557]'}`}>{block.rightColumnTitle}</h3>
                        {Boolean(rightContent) && (
                          <div className={`prose max-w-none ${backgroundImageUrl ? (isLightText ? 'prose-light' : 'prose-dark') : 'text-[#505a5e]'}`}>
                            <RichText data={rightContent as never} />
                          </div>
                        )}
                      </div>
                    </div>
                    {block.conclusion && (
                      <div className={`mobile-richtext-left prose prose-lg max-w-[820px] mx-auto text-center mt-12 max-[767px]:text-left ${backgroundImageUrl ? (isLightText ? 'prose-light' : 'prose-dark') : 'text-[#505a5e]'}`}>
                        <RichText data={block.conclusion} />
                      </div>
                    )}
                  </div>
                </section>
              )
            }

            return (
              <section key={block.id || idx} className={compactSpacing ? `py-[50px] max-[767px]:py-[32px] ${theme.section}` : `py-[100px] max-[767px]:py-[64px] ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                <div className="max-w-[1100px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px]">
                  {block.sectionTitle && <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-[#22282b] text-center mb-6">{block.sectionTitle}</h2>}
                  {block.intro && (
                    <div className="mobile-richtext-left prose prose-lg max-w-[900px] mx-auto text-[#505a5e] mb-10 max-[767px]:text-left">
                      <RichText data={block.intro} />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-6 max-[767px]:grid-cols-1">
                    <div className={`rounded-[24px] ${theme.cardAlt} p-7 max-[767px]:p-5 border border-[#22282b]/[0.06]`} style={getThemeBackgroundStyle(theme, 'cardAlt')}>
                      <h3 className="text-[24px] max-[767px]:text-[20px] font-semibold text-[#3c5557] mb-5">{block.leftColumnTitle}</h3>
                      {Boolean(leftContent) && (
                        <div className="prose max-w-none text-[#505a5e]">
                          <RichText data={leftContent as never} />
                        </div>
                      )}
                    </div>
                    <div className={`rounded-[24px] ${theme.panelAlt} p-7 max-[767px]:p-5 border border-[#22282b]/[0.06]`} style={getThemeBackgroundStyle(theme, 'panelAlt')}>
                      <h3 className="text-[24px] max-[767px]:text-[20px] font-semibold text-[#3c5557] mb-5">{block.rightColumnTitle}</h3>
                      {Boolean(rightContent) && (
                        <div className="prose max-w-none text-[#505a5e]">
                          <RichText data={rightContent as never} />
                        </div>
                      )}
                    </div>
                  </div>
                  {block.conclusion && (
                    <div className="mobile-richtext-left prose prose-lg max-w-[900px] mx-auto text-[#505a5e] mt-10 max-[767px]:text-left">
                      <RichText data={block.conclusion} />
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'contentAccordion': {
            const imageUrl = mediaUrl(block.image)
            const isImageLeft = (block.position || 'left') === 'left'
            const theme = getBlockTheme(block.theme)
            const accordionBottomText = (block as { bottomText?: unknown }).bottomText

            return (
              <section key={block.id || idx} className={`flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                <div className={`w-1/2 max-[991px]:w-full min-h-[420px] max-[991px]:min-h-[320px] max-[991px]:aspect-[4/3] ${isImageLeft ? 'order-1' : 'order-2 max-[991px]:order-1'}`}>
                  {imageUrl ? <img src={imageUrl} alt={block.title || service.title} className="w-full h-full object-cover block" /> : <div className="w-full h-full bg-[#e8e0d8]" />}
                </div>
                <div className={`w-1/2 max-[991px]:w-full flex flex-col justify-center gap-6 py-12 max-[1100px]:py-10 ${theme.panel} ${isImageLeft ? 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]' : 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]'}`} style={getThemeBackgroundStyle(theme, 'panel')}>
                  {block.title && <h2 className="text-[28px] max-[767px]:text-[22px] font-semibold text-[#3c5557]">{block.title}</h2>}
                  {block.intro && (
                    <div className="prose max-w-none text-[#505a5e]">
                      <RichText data={block.intro} />
                    </div>
                  )}
                  <AccordionList
                    items={block.items}
                    itemClassName={`w-full rounded-[18px] ${theme.card} border border-[#3c5557]/10 px-5 py-4 max-[767px]:px-4 max-[767px]:py-3`}
                    headingClassName="text-[18px] max-[767px]:text-[16px] font-semibold text-[#22282b]"
                    iconClassName="text-[24px] text-[#3c5557]"
                    contentClassName="prose max-w-none text-[14px] leading-relaxed text-[#505a5e] prose-p:my-0 prose-li:text-[14px]"
                  />
                  {Boolean(accordionBottomText) && (
                    <div className="mobile-richtext-left prose max-w-none text-[#505a5e]">
                      <RichText data={accordionBottomText as never} />
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'cta': {
            const backgroundImageUrl = mediaUrl((block as { backgroundImage?: unknown }).backgroundImage)
            const theme = getBlockTheme(block.theme)
            const buttonClass = getButtonStyle(block.buttonStyle)
            const overlayColor = typeof (block as { overlayColor?: unknown }).overlayColor === 'string'
              ? (block as { overlayColor?: string }).overlayColor
              : '#000000'
            const overlayOpacityValue = typeof (block as { overlayOpacity?: unknown }).overlayOpacity === 'number'
              ? (block as { overlayOpacity?: number }).overlayOpacity
              : 35
            const overlayOpacity = Math.min(100, Math.max(0, overlayOpacityValue ?? 35)) / 100
            const textTone = getOverlayTextTone(backgroundImageUrl, overlayColor || '#000000', overlayOpacity)
            const isLightText = textTone === 'light'

            return (
              <section key={block.id || idx} className={`relative overflow-hidden py-[100px] max-[767px]:py-[64px] ${backgroundImageUrl ? '' : theme.section}`} style={backgroundImageUrl ? undefined : getThemeBackgroundStyle(theme, 'section')}>
                {backgroundImageUrl && (
                  <>
                    <img src={backgroundImageUrl} alt={block.title || 'CTA background'} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
                  </>
                )}
                <div className="relative z-10 max-w-[900px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px] text-center">
                  {block.title && <h2 className={`text-[34px] max-[767px]:text-[24px] font-semibold mb-6 ${backgroundImageUrl ? (isLightText ? 'text-force-white' : 'text-force-dark') : 'text-[#22282b]'}`}>{block.title}</h2>}
                  {block.content && (
                    <div className={`prose prose-lg max-w-none ${backgroundImageUrl ? (isLightText ? 'prose-light' : 'prose-dark') : 'text-[#505a5e]'}`}>
                      <RichText data={block.content} />
                    </div>
                  )}
                  {block.buttonText && (
                    <div className="mt-8">
                      <a href={resolveHref(block.buttonLink)} className={buttonClass}>
                        {block.buttonText}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'pricingGroupShowcase': {
            const pricingGroup = isPricingDoc(block.pricingGroup) ? block.pricingGroup : null
            const imageUrl = mediaUrl(block.image)
            const isImageLeft = (block.position || 'left') === 'left'
            const theme = getBlockTheme(block.theme)

            if (!pricingGroup) return null

            return (
              <section key={block.id || idx} className={`flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                <div className={`w-1/2 max-[991px]:w-full min-h-[420px] max-[991px]:min-h-[320px] max-[991px]:aspect-[4/3] relative overflow-hidden ${isImageLeft ? 'order-1' : 'order-2 max-[991px]:order-1'}`}>
                  {imageUrl ? <img src={imageUrl} alt={pricingGroup.title} className="absolute inset-0 w-full h-full object-cover block" /> : <div className="w-full h-full bg-[#e8e0d8]" />}
                </div>
                <div className={`w-1/2 max-[991px]:w-full flex flex-col justify-center gap-6 py-12 max-[1100px]:py-10 ${idx % 2 === 0 ? theme.panel : theme.panelAlt} ${isImageLeft ? 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]' : 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]'}`} style={getThemeBackgroundStyle(theme, idx % 2 === 0 ? 'panel' : 'panelAlt')}>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-[28px] max-[767px]:text-[23px] font-semibold text-[#3c5557] tracking-[-0.02em]">
                      {pricingGroup.title}
                    </h2>
                    {pricingGroup.description && (
                      <div className="prose max-w-none text-[#5d676b] prose-p:my-0 prose-p:leading-relaxed">
                        <RichText data={pricingGroup.description} />
                      </div>
                    )}
                  </div>

                  {pricingGroup.items && pricingGroup.items.length > 0 && (
                    <div className="flex flex-col">
                      {pricingGroup.items.map((item, itemIndex) => {
                        const linkedService = item.servicePage && isServiceDoc(item.servicePage) ? item.servicePage : null
                        return (
                          <div
                            key={item.id || itemIndex}
                            className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-2 items-center border-b border-[#22282b]/10 py-2 last:border-b-0 max-[767px]:grid-cols-[minmax(0,1fr)_auto] max-[767px]:gap-x-3 max-[767px]:gap-y-2 max-[767px]:items-start max-[767px]:py-3"
                          >
                            <div className="min-w-0 pr-2">
                              {linkedService ? (
                                <a
                                  href={buildLocalizedPath(
                                    locale,
                                    `${servicesBasePath}/${linkedService.path || linkedService.slug}`,
                                  )}
                                  className="block mb-0 text-[17px] max-[767px]:text-[16px] font-medium text-[#22282b] leading-snug hover:text-[#3c5557] transition-colors no-underline"
                                >
                                  {item.serviceName}
                                </a>
                              ) : (
                                <h3 className="mb-0 text-[17px] max-[767px]:text-[16px] font-medium text-[#22282b] leading-snug">
                                  {item.serviceName}
                                </h3>
                              )}
                              {item.note && (
                                <p className="text-[13px] text-[#7a8489] mt-0 leading-relaxed italic">
                                  {item.note}
                                </p>
                              )}
                              {linkedService && (
                                <a
                                  href={buildLocalizedPath(
                                    locale,
                                    `${servicesBasePath}/${linkedService.path || linkedService.slug}`,
                                  )}
                                  className="inline-flex mt-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#3c5557] hover:opacity-80 no-underline"
                                >
                                  {pricingGroup.detailsLinkLabel || copy.detailsLabel}
                                </a>
                              )}
                            </div>
                            <div className="justify-self-end self-center max-[767px]:justify-self-start">
                              <div
                                style={{ fontFamily: 'var(--second-font)' }}
                                className="inline-flex items-center px-0 py-0 text-[15px] max-[767px]:text-[14px] font-semibold text-[#3c5557] whitespace-nowrap"
                              >
                                {item.pricePrefix ? `${item.pricePrefix} ` : ''}
                                {item.price}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'globalContactSection': {
            const compactSpacing = isCompactSpacing(block)
            const theme = getBlockTheme(block.theme)
            return (
              <section
                key={block.id || idx}
                id="contact_us"
                className={compactSpacing ? `${theme.panel} py-[64px] max-[767px]:py-[44px] contact_us` : `${theme.panel} py-[100px] max-[767px]:py-[64px] contact_us`}
                style={getThemeBackgroundStyle(theme, 'panel')}
              >
                <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] flex gap-[80px] max-[1100px]:gap-[40px] max-[991px]:flex-col max-[991px]:gap-[50px] items-start">
                  <div className="w-1/2 max-[991px]:w-full flex flex-col contact_us-info">
                    <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-left mb-6 text-[#22282b]">
                      {siteSettings?.contacts?.sectionTitle || (locale === 'uk' ? 'Контакти' : locale === 'en' ? 'Contact' : 'Contacto')}
                    </h2>
                    {siteSettings?.contacts?.sectionDescription && (
                      <div className="text-[15px] text-[#909da2] leading-relaxed mb-8 prose max-w-none">
                        {typeof siteSettings.contacts.sectionDescription === 'string' ? (
                          <p>{siteSettings.contacts.sectionDescription}</p>
                        ) : (
                          <RichText data={siteSettings.contacts.sectionDescription} />
                        )}
                      </div>
                    )}
                    <div className="flex flex-col gap-6 text-[#22282b]">
                      {contacts.email && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{copy.emailLabel}</span>
                          <a
                            href={`mailto:${contacts.email}`}
                            style={{ fontFamily: 'var(--second-font)' }}
                            className="text-[18px] font-medium hover:opacity-80 transition-opacity"
                          >
                            {contacts.email}
                          </a>
                        </div>
                      )}
                      {contacts.phone && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{copy.phoneLabel}</span>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                              {contacts.telegram && (
                                <a
                                  href={contacts.telegram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center hover:scale-105 transition-transform"
                                  title="Telegram"
                                >
                                  <img src="/icons/telegram.svg" alt="Telegram" className="w-[18px] h-[18px]" />
                                </a>
                              )}
                              {contacts.whatsapp && (
                                <a
                                  href={contacts.whatsapp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center hover:scale-105 transition-transform"
                                  title="WhatsApp"
                                >
                                  <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-[18px] h-[18px]" />
                                </a>
                              )}
                            </div>
                            <div className="h-[18px] w-px bg-[#22282b]/15" />
                            <a
                              href={`tel:${contacts.phone.replace(/\s+/g, '')}`}
                              style={{ fontFamily: 'var(--second-font)' }}
                              className="flex items-center gap-[8px] text-[18px] font-medium hover:opacity-80 transition-opacity"
                            >
                              <img src="/icons/phone.svg" alt="Phone" className="w-[16px] h-[16px] opacity-85" />
                              <span>{contacts.phone}</span>
                            </a>
                          </div>
                        </div>
                      )}
                      {contacts.address && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{copy.addressLabel}</span>
                          <p style={{ fontFamily: 'var(--second-font)' }} className="text-[16px] leading-relaxed font-medium">{contacts.address}</p>
                        </div>
                      )}
                      {contacts.transport && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{copy.transportLabel}</span>
                          <p style={{ fontFamily: 'var(--second-font)' }} className="text-[15px] text-[#505a5e] leading-relaxed">{contacts.transport}</p>
                        </div>
                      )}
                      {contacts.socialLinks && contacts.socialLinks.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{copy.socialLabel}</span>
                          <div className="flex items-center gap-3 flex-wrap">
                            {contacts.socialLinks.map((link, linkIndex) => (
                              <a key={linkIndex} href={link.url} target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium text-[#3c5557] hover:opacity-80 no-underline">
                                {link.platform}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`w-1/2 max-[991px]:w-full ${theme.panelAlt} rounded-[20px] p-8 max-[1100px]:p-6 shadow-md`} style={getThemeBackgroundStyle(theme, 'panelAlt')}>
                    {(globalContact?.formTitle || globalContact?.formDescription) && (
                      <div className="mb-6">
                        {globalContact?.formTitle && <h3 className="text-[24px] max-[767px]:text-[20px] font-semibold text-[#22282b] mb-3">{globalContact.formTitle}</h3>}
                        {globalContact?.formDescription && (
                          <div className="text-[#909da2] prose max-w-none">
                            <RichText data={globalContact.formDescription} />
                          </div>
                        )}
                      </div>
                    )}
                    <ContactForm
                      locale={locale}
                      fullNamePlaceholder={globalContact?.fullNamePlaceholder || (locale === 'uk' ? 'ПІБ' : locale === 'en' ? 'Full name' : 'Nombre completo')}
                      phonePlaceholder={globalContact?.phonePlaceholder || (locale === 'uk' ? 'Телефон' : locale === 'en' ? 'Phone' : 'Telefono')}
                      emailPlaceholder={globalContact?.emailPlaceholder || 'Email'}
                      patientTypePlaceholder={globalContact?.patientTypePlaceholder || (locale === 'uk' ? 'Я:' : locale === 'en' ? 'I am:' : 'Soy:')}
                      referralSourcePlaceholder={globalContact?.referralSourcePlaceholder || (locale === 'uk' ? 'Дізнався про вас:' : locale === 'en' ? 'How did you hear about us:' : 'Como nos conociste:')}
                      commentPlaceholder={globalContact?.commentPlaceholder || (locale === 'uk' ? 'Коментар' : locale === 'en' ? 'Comment' : 'Comentario')}
                      submitButtonLabel={globalContact?.submitButtonLabel || (locale === 'uk' ? 'Надіслати' : locale === 'en' ? 'Send' : 'Enviar')}
                      successMessage={globalContact?.successMessage || (locale === 'uk' ? 'Дякуємо! Ваше повідомлення успішно надіслано.' : locale === 'en' ? 'Thank you. Your message has been sent successfully.' : 'Gracias. Su mensaje ha sido enviado correctamente.')}
                      errorMessage={globalContact?.errorMessage || (locale === 'uk' ? 'Не вдалося надіслати форму. Спробуйте ще раз.' : locale === 'en' ? 'The form could not be submitted. Please try again.' : 'No se pudo enviar el formulario. Intentelo de nuevo.')}
                      patientTypeOptions={
                        (globalContact as { patientTypes?: Array<{ id?: string | null; label: string }> } | undefined)
                          ?.patientTypes?.length
                          ? (
                              globalContact as { patientTypes?: Array<{ id?: string | null; label: string }> }
                            ).patientTypes!.map((option) => ({ id: option.id, label: option.label }))
                          : getDefaultPatientTypeOptions(locale)
                      }
                      referralSourceOptions={
                        (globalContact as { refSources?: Array<{ id?: string | null; label: string }> } | undefined)
                          ?.refSources?.length
                          ? (
                              globalContact as { refSources?: Array<{ id?: string | null; label: string }> }
                            ).refSources!.map((option) => ({ id: option.id, label: option.label }))
                          : getDefaultReferralSourceOptions(locale)
                      }
                    />
                  </div>
                </div>
              </section>
            )
          }

          default:
            return null
        }
      })}
      </main>
    </>
  )
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  return ServiceDetailPageContent({ locale, slug })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const locales = ['es', 'en', 'uk']
  const params: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    const services = await payload.find({
      collection: 'services',
      locale: locale as 'es' | 'en' | 'uk',
      fallbackLocale: false,
      limit: 100,
    })

    services.docs.forEach((service) => {
      if (typeof service.path === 'string' && service.path) {
        params.push({ locale, slug: service.path })
      }
    })
  }

  return params
}
