import { notFound } from 'next/navigation'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media, Page, Pricing, Service, SiteContact, SiteSetting } from '@/payload-types'
import { getBlockTheme, getButtonStyle, getThemeBackgroundStyle } from '@/lib/blockThemes'
import { buildLocalizedPath } from '@/lib/localizedRouting'
import { resolveInternalHref } from '@/lib/internalLinkResolver'
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from '@/lib/structuredData'
import { getConfiguredSiteUrl } from '@/lib/seo'
import {
  getCachedPagePathEntries,
  getCachedServicePathEntries,
  getCachedServicesPage,
  getCachedSiteContacts,
  getCachedSiteSettings,
} from '@/lib/publicData'
import ContactForm from '../../../../components/ContactForm'

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

export async function ServicesListingPageContent({
  locale,
}: {
  locale: string
}) {
  const [allPagesDocs, allServicesDocs, pageData, siteSettings, siteContacts, siteUrl] = await Promise.all([
    getCachedPagePathEntries(locale as 'es' | 'en' | 'uk').catch(() => []),
    getCachedServicePathEntries(locale as 'es' | 'en' | 'uk').catch(() => []),
    getCachedServicesPage(locale as 'es' | 'en' | 'uk', 3).catch(() => null),
    getCachedSiteSettings(locale as 'es' | 'en' | 'uk').catch((error) => {
      console.error('Error fetching site settings for services page:', error)
      return null as SiteSetting | null
    }),
    getCachedSiteContacts(locale as 'es' | 'en' | 'uk').catch((error) => {
      console.error('Error fetching site contacts for services page:', error)
      return {} as SiteContact
    }),
    getConfiguredSiteUrl(),
  ])

  const pagePaths = Object.fromEntries(
    allPagesDocs
      .filter((page) => typeof page.slug === 'string' && typeof page.path === 'string')
      .map((page) => [page.slug, { path: page.slug === 'home' ? '/' : `/${page.path}` }]),
  )
  const servicePaths = Object.fromEntries(
    allServicesDocs
      .filter((service) => typeof service.slug === 'string' && typeof service.path === 'string')
      .map((service) => [service.slug, { path: service.path }]),
  )
  if (!pageData) return notFound()
  const servicesBasePath = `/${pageData.path || 'services'}`
  const resolveHref = (link: string | null | undefined) =>
    resolveInternalHref({
      link,
      locale,
      pagePaths,
      servicePaths,
      servicesPagePath: servicesBasePath,
    })

  const contacts: ContactData = {
    ...siteContacts,
    ...(siteSettings?.contacts || {}),
    socialLinks: siteSettings?.socialLinks || siteContacts?.socialLinks || [],
  }

  const pageLayout = pageData.layout || []
  const globalContact = siteSettings?.globalContactSection
  const itemListStructuredData = buildItemListStructuredData(
    allServicesDocs
      .filter((service) => typeof service.title === 'string' && Boolean(service.path))
      .map((service) => ({
        name: service.title as string,
        path: buildLocalizedPath(locale, `${servicesBasePath}/${service.path}`),
      })),
    siteUrl,
  )
  const breadcrumbStructuredData = buildBreadcrumbStructuredData([
    {
      name: locale === 'uk' ? 'Головна' : locale === 'en' ? 'Home' : 'Inicio',
      path: locale === 'es' ? '/' : `/${locale}`,
    },
    {
      name: pageData.title,
      path: servicesBasePath,
    },
  ], siteUrl)

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
      locale === 'uk' ? 'Детальніше' : locale === 'en' ? 'Learn more' : 'Más información',
  }

  return (
    <>
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
      )}
      {itemListStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />
      )}
      <main>
      {pageLayout.map((block, idx) => {
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
                  <div className="w-1/2 max-[991px]:w-full relative overflow-hidden min-h-[300px] max-[991px]:min-h-0 max-[991px]:aspect-[4/3]">
                    {imageUrl ? <Image src={imageUrl} alt={block.title} fill sizes="(max-width: 991px) 100vw, 50vw" className="object-cover" priority /> : <div className="w-full h-full bg-[#e8e0d8]" />}
                  </div>
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
              <section key={block.id || idx} className="flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col">
                <div className={`w-1/2 max-[991px]:w-full min-h-[320px] max-[991px]:min-h-0 max-[991px]:aspect-[4/3] ${isImageLeft ? 'order-1' : 'order-2 max-[991px]:order-1'} ${isImageContained ? 'flex items-center justify-center p-[24px] max-[1100px]:p-[20px] max-[767px]:p-[16px]' : ''}`}>
                  <div className={isImageContained ? 'w-full max-w-[520px] h-full max-[991px]:max-w-none max-[991px]:h-full overflow-hidden rounded-[24px] shadow-[0_18px_40px_rgba(34,40,43,0.08)]' : 'w-full h-full'}>
                    {imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image src={imageUrl} alt={block.title || `Services ${idx + 1}`} fill sizes="(max-width: 991px) 100vw, 50vw" className="object-cover" />
                      </div>
                    ) : <div className="w-full h-full bg-[#e8e0d8]" />}
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

          case 'content': {
            const compactSpacing = isCompactSpacing(block)
            const theme = getBlockTheme(block.theme)
            const buttonClass = getButtonStyle(block.buttonStyle)
            const contentWidthClass = block.fullWidthContent ? 'max-w-[1200px]' : 'max-w-[900px]'
            const backgroundImageUrl = mediaUrl((block as { backgroundImage?: unknown }).backgroundImage)
            const overlayColor = typeof (block as { overlayColor?: unknown }).overlayColor === 'string'
              ? (block as { overlayColor?: string }).overlayColor
              : '#000000'
            const overlayOpacityValue = typeof (block as { overlayOpacity?: unknown }).overlayOpacity === 'number'
              ? (block as { overlayOpacity?: number }).overlayOpacity
              : 35
            const overlayOpacity = Math.min(100, Math.max(0, overlayOpacityValue ?? 35)) / 100
            return (
              <section
                key={block.id || idx}
                className={backgroundImageUrl ? 'relative overflow-hidden' : compactSpacing ? `py-[50px] max-[767px]:py-[32px] ${theme.section}` : `py-[100px] max-[767px]:py-[64px] ${theme.section}`}
                style={backgroundImageUrl ? undefined : getThemeBackgroundStyle(theme, 'section')}
              >
                {backgroundImageUrl && (
                <>
                  <Image src={backgroundImageUrl} alt={block.title || 'Content background'} fill sizes="100vw" className="object-cover" />
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: overlayColor,
                        opacity: overlayOpacity,
                      }}
                    />
                </>
              )}
                <div className={`relative z-10 ${contentWidthClass} mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px] ${backgroundImageUrl ? (compactSpacing ? 'py-[50px] max-[767px]:py-[32px]' : 'py-[100px] max-[767px]:py-[64px]') : ''}`}>
                  {block.title && (
                    <h2
                      className={`text-[32px] max-[767px]:text-[24px] font-semibold text-[#3c5557] text-center ${
                        block.content || block.bottomText ? 'mb-6' : 'mb-0'
                      }`}
                    >
                      {block.title}
                    </h2>
                  )}
                  {block.content && (
                    <div className="prose prose-lg max-w-none text-[#22282b] max-[767px]:text-left">
                      <RichText data={block.content} />
                    </div>
                  )}
                  {block.bottomText && (
                    <div className="prose prose-lg max-w-none text-[#22282b] mt-8 max-[767px]:text-left">
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

          case 'pricingGroupShowcase': {
            const pricingGroup = isPricingDoc(block.pricingGroup) ? block.pricingGroup : null
            const imageUrl = mediaUrl(block.image)
            const isImageLeft = (block.position || 'left') === 'left'
            const theme = getBlockTheme(block.theme)

            if (!pricingGroup) return null

            return (
              <section key={block.id || idx} className="flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col">
                <div className={`w-1/2 max-[991px]:w-full min-h-[320px] max-[991px]:min-h-0 max-[991px]:aspect-[4/3] ${isImageLeft ? 'order-1' : 'order-2 max-[991px]:order-1'}`}>
                  {imageUrl ? (
                    <div className="relative w-full h-full min-h-[320px]">
                      <Image src={imageUrl} alt={pricingGroup.title} fill sizes="(max-width: 991px) 100vw, 50vw" className="object-cover" />
                    </div>
                  ) : <div className="w-full h-full bg-[#e8e0d8]" />}
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
                      errorMessage={globalContact?.errorMessage || (locale === 'uk' ? 'Не вдалося надіслати форму. Спробуйте ще раз.' : locale === 'en' ? 'The form could not be submitted. Please try again.' : 'No se pudo enviar el formulario. Inténtelo de nuevo.')}
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

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return ServicesListingPageContent({ locale })
}
