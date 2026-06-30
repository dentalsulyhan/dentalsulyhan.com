import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { HomePage as HomePageType, Page, TeamMember, Media, SiteContact, SiteSetting, Promotion } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import TeamSlider from '../../../components/TeamSlider'
import GallerySlider from '../../../components/GallerySlider'
import ContactForm from '../../../components/ContactForm'
import GoogleReviews from '../../../components/GoogleReviews'
import { getBlockTheme, getButtonStyle, getThemeBackgroundStyle } from '@/lib/blockThemes'
import { buildLocalizedPath } from '@/lib/localizedRouting'
import { resolveInternalHref } from '@/lib/internalLinkResolver'

/* ─── helper: extract URL from a Payload media relation ─── */
function mediaUrl(field: unknown): string | null {
  if (!field) return null
  if (typeof field === 'object' && field !== null && 'url' in field) {
    return (field as Media).url ?? null
  }
  return null
}

/* ─── Placeholder SVG for missing images ─── */
function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-[#e8e0d8] text-[#909da2] select-none ${className ?? ''}`}
    >
      <div className="flex flex-col items-center gap-2 p-6">
        <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="opacity-40">
          <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M4 32 l12-10 8 6 8-12 12 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        <span className="text-sm font-medium text-center">{label}</span>
      </div>
    </div>
  )
}

function isPromotionDoc(value: number | Promotion): value is Promotion {
  return typeof value === 'object' && value !== null
}

function isTeamMemberDoc(value: number | TeamMember): value is TeamMember {
  return typeof value === 'object' && value !== null
}

function isCompactSpacing(block: unknown): boolean {
  return typeof block === 'object' && block !== null && Boolean((block as { compactSpacing?: boolean }).compactSpacing)
}

function getIncompleteRowJustifyClass(block: unknown) {
  return typeof block === 'object' &&
    block !== null &&
    (block as { incompleteRowAlignment?: 'center' | 'start' }).incompleteRowAlignment === 'start'
    ? 'justify-start'
    : 'justify-center'
}

function SocialIcon({ platform }: { platform: string }) {
  const iconMap: Record<string, string> = {
    instagram: '/icons/instagram.svg',
    facebook: '/icons/facebook.svg',
    twitter: '/icons/twitter.svg',
  }
  const iconSrc = iconMap[platform]

  if (iconSrc) {
    return <img src={iconSrc} alt={platform} className="w-[20px] h-[20px]" />
  }

  if (platform === 'youtube') {
    return (
      <svg className="w-[20px] h-[20px] fill-[#22282b]" viewBox="0 0 24 24">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555a3.003 3.003 0 0 0-2.11 2.108C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }

  if (platform === 'tiktok') {
    return (
      <svg className="w-[20px] h-[20px] fill-[#22282b]" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.58 4.22.95 1.1 2.27 1.83 3.73 2.05v3.83c-1.39-.03-2.74-.51-3.87-1.37a8.09 8.09 0 0 1-2.22-2.58v9.42c.04 1.48-.3 2.96-1.01 4.26-.71 1.29-1.78 2.37-3.08 3.08a8.312 8.312 0 0 1-8.52 0A8.09 8.09 0 0 1 .74 19.86a8.21 8.21 0 0 1 0-8.52c.71-1.29 1.78-2.37 3.08-3.08a8.32 8.32 0 0 1 7.21-.49c.03.65.01 1.31.02 1.97-.68-.2-1.4-.23-2.1-.08a4.11 4.11 0 0 0-3.13 3.13c-.22.94-.12 1.93.28 2.8.39.87 1.09 1.58 1.96 1.97a4.17 4.17 0 0 0 4.14 0 4.2 4.2 0 0 0 1.97-1.97 4.131 4.131 0 0 0-.01-4.14V.02z" />
      </svg>
    )
  }

  return <span className="text-[12px] uppercase font-semibold">{platform}</span>
}

const primaryButtonClass = getButtonStyle('primary')

function getDefaultPatientTypeOptions(locale: string) {
  if (locale === 'uk') {
    return [{ label: 'Новий пацієнт' }, { label: 'Існуючий пацієнт' }]
  }

  if (locale === 'en') {
    return [{ label: 'New patient' }, { label: 'Existing patient' }]
  }

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

export async function PageContent({
  locale,
  slug = 'home',
  path,
}: {
  locale: string
  slug?: string
  path?: string
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
  const servicesPagePath = pagePaths.services?.path || '/services'
  const servicePaths = Object.fromEntries(
    allServicesResult.docs
      .filter((service) => typeof service.slug === 'string' && typeof service.path === 'string')
      .map((service) => [service.slug, { path: service.path }]),
  )
  const resolveHref = (link: string | null | undefined) =>
    resolveInternalHref({
      link,
      locale,
      pagePaths,
      servicePaths,
      servicesPagePath,
    })

  let pageData: Page | null = null
  try {
    const fetchedPages = await payload.find({
      collection: 'pages',
      depth: 2,
      locale: locale as 'es' | 'en' | 'uk',
      where: {
        ...(path
          ? {
              path: {
                equals: path,
              },
            }
          : {
              slug: {
                equals: slug,
              },
            }),
      },
      limit: 1,
    })
    pageData = (fetchedPages.docs[0] as Page | undefined) || null
  } catch (err) {
    console.error('Error fetching pages collection for home:', err)
  }

  let homeData: HomePageType = {} as HomePageType
  try {
    const fetchedHome = await payload.findGlobal({
      slug: 'home-page',
      locale: locale as 'es' | 'en' | 'uk',
    })
    if (fetchedHome) {
      homeData = fetchedHome as HomePageType
    }
  } catch (err) {
    console.error('Error fetching home-page global:', err)
  }

  let teamMembers: any = { docs: [] }
  try {
    teamMembers = await payload.find({
      collection: 'team-members',
      locale: locale as 'es' | 'en' | 'uk',
      sort: 'order',
      limit: 20,
    })
  } catch (err) {
    console.error('Error fetching team-members:', err)
  }

  let siteSettings: SiteSetting | null = null
  try {
    const fetchedSiteSettings = await payload.findGlobal({
      slug: 'site-settings',
      locale: locale as 'es' | 'en' | 'uk',
    })
    if (fetchedSiteSettings) {
      siteSettings = fetchedSiteSettings as SiteSetting
    }
  } catch (err) {
    console.error('Error fetching site-settings global:', err)
  }

  let siteContacts: SiteContact = {} as SiteContact
  try {
    const fetchedContacts = await payload.findGlobal({
      slug: 'site-contacts',
      locale: locale as 'es' | 'en' | 'uk',
    })
    if (fetchedContacts) {
      siteContacts = fetchedContacts as SiteContact
    }
  } catch (err) {
    console.error('Error fetching site-contacts global:', err)
  }
  const contacts: SiteContact = {
    ...siteContacts,
    ...(siteSettings?.contacts || {}),
    socialLinks: siteSettings?.socialLinks || siteContacts?.socialLinks || [],
  }
  const globalContact = siteSettings?.globalContactSection

  let activePromos: Promotion[] = []
  try {
    const promotionsData = await payload.find({
      collection: 'promotions',
      locale: locale as 'es' | 'en' | 'uk',
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: 10,
    })
    activePromos = promotionsData.docs as Promotion[]
  } catch (err) {
    console.error('Error fetching promotions:', err)
  }

  // ─── Localized placeholders ───
  const t = {
    es: {
      heroTitle: 'Clínica dental Sulyhan',
      heroSubtitle: 'Tu sonrisa, nuestra prioridad',
      heroButton: 'Pide tu cita',
      teamTitle: 'Nuestro Equipo',
      reviewsTitle: 'Reseñas',
      galleryTitle: 'Galería de Fotos',
      galleryDesc: 'Nuestras instalaciones modernas y acogedoras',
      whyUsTitle: 'Por qué elegirnos',
      contactTitle: 'Contacto',
      contactDesc: 'Estamos aquí para ayudarte. ¡Contáctanos!',
      philosophyTitle: 'Filosofía y valores',
      philosophyText: 'Creemos en la odontología honesta y transparente.',
      philosophyButton: 'Contáctanos',
      offersText: 'Descubre nuestras promociones y ofertas especiales.',
      aboutPlaceholder: 'Texto del bloque "Sobre nosotros". Puede editarlo desde el panel de administración.',
      whyUsText: 'Ofrecemos la mejor atención dental con tecnología de vanguardia.',
    },
    en: {
      heroTitle: 'Sulyhan Dental Clinic',
      heroSubtitle: 'Your smile, our priority',
      heroButton: 'Book an appointment',
      teamTitle: 'Our Team',
      reviewsTitle: 'Reviews',
      galleryTitle: 'Photo Gallery',
      galleryDesc: 'Our modern and welcoming facilities',
      whyUsTitle: 'Why Choose Us',
      contactTitle: 'Contact',
      contactDesc: 'We are here to help you. Contact us!',
      philosophyTitle: 'Philosophy and values',
      philosophyText: 'We believe in honest and transparent dentistry.',
      philosophyButton: 'Contact us',
      offersText: 'Discover our promotions and special offers.',
      aboutPlaceholder: 'About Us block text. You can edit it from the admin panel.',
      whyUsText: 'We offer the best dental care with cutting-edge technology.',
    },
    uk: {
      heroTitle: 'Стоматологічна клініка Сулихан',
      heroSubtitle: 'Ваша посмішка — наш пріоритет',
      heroButton: 'Записатися на прийом',
      teamTitle: 'Наша команда',
      reviewsTitle: 'Відгуки',
      galleryTitle: 'Фотогалерея',
      galleryDesc: 'Наші сучасні та затишні приміщення',
      whyUsTitle: 'Чому обирають нас',
      contactTitle: 'Контакти',
      contactDesc: 'Ми тут, щоб допомогти вам. Зв\'яжіться з нами!',
      philosophyTitle: 'Філософія та цінності',
      philosophyText: 'Ми віримо в чесну та прозору стоматологію.',
      philosophyButton: 'Зв\'язатися з нами',
      offersText: 'Дізнайтеся про наші акції та спеціальні пропозиції.',
      aboutPlaceholder: 'Текст блоку "Про нас". Ви можете відредагувати його через панель адміністратора.',
      whyUsText: 'Ми пропонуємо найкращу стоматологічну допомогу з передовими технологіями.',
    },
  }
  const loc = t[locale as keyof typeof t] || t.es

  // ─── Extract data ───
  const heroTitle = homeData.hero?.title || loc.heroTitle
  const heroSubtitle = homeData.hero?.subtitle || loc.heroSubtitle
  const heroButtonText = homeData.hero?.buttonText || loc.heroButton
  const heroButtonLink = homeData.hero?.buttonLink || '#contact_us'
  const heroImageUrl = mediaUrl(homeData.hero?.image)

  const advantages = homeData.advantages || []
  const aboutBlocks = homeData.aboutUs?.blocks || []

  const philTitle = homeData.philosophy?.sectionTitle || loc.philosophyTitle
  const philText = loc.philosophyText
  const philButton = loc.philosophyButton
  const philLink = '#contact_us'

  const teamTitle = homeData.teamSection?.title || loc.teamTitle
  const team = teamMembers.docs as TeamMember[]

  const reviewsTitle = homeData.reviews?.title || loc.reviewsTitle
  const reviewsEmbed = homeData.reviews?.embedCode || ''

  const galleryTitle = homeData.gallery?.title || loc.galleryTitle
  const galleryDesc = homeData.gallery?.description || loc.galleryDesc
  const galleryImages = homeData.gallery?.images || []

  const whyUsTitle = homeData.whyUs?.title || loc.whyUsTitle
  const whyUsText = homeData.whyUs?.text || loc.whyUsText

  const contactTitle = siteSettings?.contacts?.sectionTitle || homeData.contactsSection?.title || loc.contactTitle
  const contactDesc = siteSettings?.contacts?.sectionDescription || homeData.contactsSection?.description || loc.contactDesc
  const phoneLabel = siteSettings?.contacts?.phoneLabel || (locale === 'uk' ? 'Телефон' : locale === 'es' ? 'Teléfono' : 'Phone')
  const emailLabel = siteSettings?.contacts?.emailLabel || 'Email'
  const addressLabel = siteSettings?.contacts?.addressLabel || (locale === 'uk' ? 'Адреса' : locale === 'es' ? 'Dirección' : 'Address')
  const transportLabel = siteSettings?.contacts?.transportLabel || (locale === 'uk' ? 'Як дістатися' : locale === 'es' ? 'Cómo llegar' : 'How to get here')
  const socialLabel = siteSettings?.contacts?.socialLabel || (locale === 'uk' ? 'Ми в соцмережах' : locale === 'es' ? 'Redes sociales' : 'Social Media')

  // ─── Helper arrays for about-us alternating layout ───
  const aboutFallbacks = [
    loc.aboutPlaceholder,
    loc.aboutPlaceholder,
    loc.aboutPlaceholder,
  ]
  const legacyPrimaryTheme = getBlockTheme('white')
  const legacySecondaryTheme = getBlockTheme('soft')
  const aboutBgColors = [legacyPrimaryTheme.panel, legacyPrimaryTheme.panelAlt, legacyPrimaryTheme.panel]
  const aboutLabels = ['About Us — 1', 'About Us — 2', 'About Us — 3']

  const pageLayout = pageData?.layout || []

  if (pageLayout.length > 0) {
    return (
      <>
        {pageLayout.map((block, idx) => {
          switch (block.blockType) {
            case 'hero': {
              const imageUrl = mediaUrl(block.image)
              const buttonLink = block.buttonLink || '#contact_us'
              const buttonClass = getButtonStyle(block.buttonStyle)
              const theme = getBlockTheme(block.theme)

              return (
                <section key={block.id || idx} id={idx === 0 ? 'main-block' : undefined} className={`pt-[10px] ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                  <div className="flex items-stretch min-h-[400px] max-[991px]:min-h-0 max-[991px]:flex-col">
                    <div className={`w-1/2 max-[991px]:w-full flex flex-col justify-center pl-[max(30px,calc((100vw-1200px)/2))] pr-[30px] py-16 max-[1100px]:px-[24px] max-[1100px]:py-12 max-[767px]:px-[20px] max-[767px]:py-10 ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                      <h1 className="text-[32px] leading-[50px] max-[767px]:text-[24px] max-[767px]:leading-[35px] font-semibold mb-5 text-[#22282b]">
                        {block.title}
                      </h1>
                      {block.subtitle && (
                        <p className="text-[18px] max-[767px]:text-[15px] text-[#909da2] mb-8 leading-relaxed">{block.subtitle}</p>
                      )}
                      {block.buttonText && (
                        <div>
                          <a
                            href={resolveHref(buttonLink)}
                            className={buttonClass}
                          >
                            {block.buttonText}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="w-1/2 max-[991px]:w-full relative overflow-hidden min-h-[300px] max-[991px]:min-h-0 max-[991px]:aspect-[4/3]">
                      <div
                        className="absolute top-0 left-0 w-[10%] h-full z-[1] pointer-events-none max-[991px]:hidden"
                        style={{ background: `linear-gradient(to right, ${theme.sectionColor} 0%, transparent 100%)` }}
                      />
                      {imageUrl ? (
                        <img src={imageUrl} alt={block.title} className="w-full h-full object-cover block" />
                      ) : (
                        <ImagePlaceholder label="Hero Image" className="w-full h-full min-h-[400px]" />
                      )}
                    </div>
                  </div>
                </section>
              )
            }

            case 'advantages': {
              const isRowLayout = (block.itemLayout || 'column') === 'row'
              const compactSpacing = isCompactSpacing(block)
              const theme = getBlockTheme(block.theme)
              const buttonClass = getButtonStyle(block.buttonStyle)
              const incompleteRowJustifyClass = getIncompleteRowJustifyClass(block)
              return (
                <section
                  key={block.id || idx}
                  id="advantages"
                  className={compactSpacing ? `${theme.section} py-[56px] max-[767px]:py-[40px]` : `${theme.section} py-[100px] max-[767px]:py-[64px]`}
                  style={getThemeBackgroundStyle(theme, 'section')}
                >
                  <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px]">
                    {block.sectionTitle && (
                      <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-center mb-[60px] max-[767px]:mb-8 text-[#3c5557]">
                        {block.sectionTitle}
                      </h2>
                    )}
                    <div className={`flex flex-wrap gap-[50px] max-[1100px]:gap-[32px] ${incompleteRowJustifyClass} max-[767px]:flex-col max-[767px]:items-center`}>
                      {block.items.map((item, itemIndex) => {
                        const iconUrl = mediaUrl(item.icon)
                        return (
                          <div
                            key={item.id || itemIndex}
                            className={`flex flex-col items-center text-center gap-5 w-full max-w-[320px] max-[767px]:max-w-full ${isRowLayout ? 'max-[767px]:items-center max-[767px]:text-center' : 'max-[767px]:items-start max-[767px]:text-left'}`}
                          >
                            <div className={`flex max-[767px]:w-full ${isRowLayout ? 'flex-row items-center justify-center gap-4 text-center max-[767px]:flex-col max-[767px]:justify-center max-[767px]:gap-3 max-[767px]:text-center' : 'w-full flex-col items-center gap-5 text-center max-[767px]:justify-start max-[767px]:text-left'}`}>
                              {iconUrl ? (
                                <img src={iconUrl} alt={item.title} className="w-auto h-[50px] shrink-0" />
                              ) : (
                                <div className="w-[50px] h-[50px] rounded-full bg-[#3c5557]/10 flex items-center justify-center shrink-0">
                                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#3c5557]">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="currentColor"/>
                                  </svg>
                                </div>
                              )}
                              <h3 className={`text-[20px] font-medium text-[#22282b] ${isRowLayout ? 'mb-0' : ''}`}>{item.title}</h3>
                            </div>
                            <div className={`${isRowLayout ? 'text-center' : 'mobile-richtext-left max-[767px]:text-left max-[767px]:[&_p]:text-left max-[767px]:[&_li]:text-left'} text-[15px] text-[#909da2] leading-relaxed prose max-w-none prose-p:my-0`}>
                              <RichText data={item.text} />
                            </div>
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
                  </div>
                </section>
              )
            }

            case 'aboutUsGrid': {
              const theme = getBlockTheme(block.theme)
              const buttonClass = getButtonStyle(block.buttonStyle)
              return (
                <section key={block.id || idx} id="about_us" className="flex flex-col">
                  {block.sectionTitle && (
                    <div className={`${theme.section} py-[40px] px-[30px] max-[1100px]:px-[24px]`} style={getThemeBackgroundStyle(theme, 'section')}>
                      <div className="max-w-[1200px] mx-auto">
                        <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-[#3c5557] text-center">
                          {block.sectionTitle}
                        </h2>
                      </div>
                    </div>
                  )}
                  {block.items.map((item, itemIndex) => {
                    const imgUrl = mediaUrl(item.image)
                    const isReversed = itemIndex % 2 === 1
                    const bgClass = itemIndex % 2 === 0 ? theme.panel : theme.panelAlt
                    const buttonLink = item.buttonLink || '#contact_us'

                    return (
                      <div
                        key={item.id || itemIndex}
                        className="flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col"
                      >
                        <div
                          className={`w-1/2 max-[991px]:w-full min-h-[320px] max-[991px]:min-h-0 max-[991px]:aspect-[4/3] ${
                            isReversed ? 'order-2 max-[991px]:order-1' : 'order-1'
                          }`}
                        >
                          {imgUrl ? (
                            <img src={imgUrl} alt={item.title || `About ${itemIndex + 1}`} className="w-full h-full object-cover block" />
                          ) : (
                            <ImagePlaceholder label={item.title || aboutLabels[itemIndex % aboutLabels.length]} className="w-full h-full min-h-[320px]" />
                          )}
                        </div>
                        <div
                          className={`w-1/2 max-[991px]:w-full flex flex-col justify-center gap-5 py-14 max-[1100px]:py-10 ${bgClass} ${
                            isReversed
                              ? 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px]'
                              : 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px]'
                          }`}
                          style={getThemeBackgroundStyle(theme, itemIndex % 2 === 0 ? 'panel' : 'panelAlt')}
                        >
                          {item.title && (
                            <h3 className="text-[24px] max-[767px]:text-[20px] font-semibold text-[#3c5557] mb-2">{item.title}</h3>
                          )}
                          <div className="text-[16px] leading-relaxed text-[#22282b] prose max-w-none">
                            <RichText data={item.text} />
                          </div>
                          {item.buttonText && (
                            <div className="mt-4">
                              <a
                                href={resolveHref(buttonLink)}
                                className={buttonClass}
                              >
                                {item.buttonText}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {block.buttonText && (
                    <div className={`${theme.section} py-[40px] px-[30px] max-[1100px]:px-[24px] text-center`} style={getThemeBackgroundStyle(theme, 'section')}>
                      <a href={resolveHref(block.buttonLink)} className={buttonClass}>
                        {block.buttonText}
                      </a>
                    </div>
                  )}
                </section>
              )
            }

            case 'philosophy': {
              const isRowLayout = (block.itemLayout || 'column') === 'row'
              const compactSpacing = isCompactSpacing(block)
              const theme = getBlockTheme(block.theme)
              const buttonClass = getButtonStyle(block.buttonStyle)
              const incompleteRowJustifyClass = getIncompleteRowJustifyClass(block)
              return (
                <section
                  key={block.id || idx}
                  id="filosofia"
                  className={compactSpacing ? `py-[56px] max-[767px]:py-[40px] ${theme.section}` : `py-[100px] max-[767px]:py-[64px] ${theme.section}`}
                  style={getThemeBackgroundStyle(theme, 'section')}
                >
                  <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px]">
                    {block.sectionTitle && (
                      <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-center mb-[60px] text-[#3c5557]">
                        {block.sectionTitle}
                      </h2>
                    )}
                    <div className={`flex flex-wrap gap-[50px] max-[1100px]:gap-[32px] ${incompleteRowJustifyClass} max-[767px]:flex-col max-[767px]:items-center`}>
                      {block.items.map((item, itemIndex) => {
                        const iconUrl = mediaUrl(item.icon)
                        return (
                          <div
                            key={item.id || itemIndex}
                            className="flex flex-col items-center text-center gap-5 w-full max-w-[320px] max-[767px]:max-w-full max-[767px]:items-start max-[767px]:text-left"
                          >
                            <div className={`flex max-[767px]:w-full max-[767px]:flex-row max-[767px]:items-center max-[767px]:justify-start max-[767px]:gap-4 max-[767px]:text-left ${isRowLayout ? 'flex-row items-center justify-center gap-4 text-center' : 'w-full flex-col items-center gap-5 text-center'}`}>
                              {iconUrl ? (
                                <img src={iconUrl} alt={item.title} className="w-auto h-[50px] shrink-0" />
                              ) : (
                                <div className="w-[50px] h-[50px] rounded-full bg-[#3c5557]/10 flex items-center justify-center shrink-0">
                                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#3c5557]">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="currentColor"/>
                                  </svg>
                                </div>
                              )}
                              <h3 className={`text-[20px] font-medium text-[#22282b] ${isRowLayout ? 'mb-0' : ''}`}>{item.title}</h3>
                            </div>
                            <div className="mobile-richtext-left text-[15px] text-[#909da2] leading-relaxed prose max-w-none prose-p:my-0 max-[767px]:text-left max-[767px]:[&_p]:text-left max-[767px]:[&_li]:text-left">
                              <RichText data={item.text} />
                            </div>
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
                  </div>
                </section>
              )
            }

            case 'promotions': {
              const promotion = isPromotionDoc(block.promotion) ? block.promotion : null

              if (!promotion || promotion.isActive === false) {
                return null
              }

              const imageUrl = mediaUrl(promotion.image)
              const isImageLeft = (block.position || 'left') === 'left'
              const theme = getBlockTheme(block.theme)
              const buttonClass = getButtonStyle(block.buttonStyle)

              return (
                <section key={block.id || idx} id="offers" className={`flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col ${theme.section}`} style={getThemeBackgroundStyle(theme, 'section')}>
                  <div className={`w-1/2 max-[991px]:w-full min-h-[320px] max-[991px]:min-h-0 max-[991px]:aspect-[4/3] ${isImageLeft ? 'order-1' : 'order-2 max-[991px]:order-1'}`}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={promotion.title} className="w-full h-full object-cover block" />
                    ) : (
                      <ImagePlaceholder label={promotion.title} className="w-full h-full min-h-[320px]" />
                    )}
                  </div>
                  <div className={`w-1/2 max-[991px]:w-full flex flex-col justify-center gap-5 py-12 max-[1100px]:py-10 ${theme.panel} ${isImageLeft ? 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px]' : 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px]'}`} style={getThemeBackgroundStyle(theme, 'panel')}>
                    <h2 className="text-[24px] max-[767px]:text-[20px] font-semibold text-[#3c5557]">{promotion.title}</h2>
                    {promotion.content ? (
                      <div className="prose max-w-none text-[#22282b]">
                        <RichText data={promotion.content} />
                      </div>
                    ) : promotion.description ? (
                      <div className="text-[16px] leading-relaxed text-[#22282b] prose max-w-none prose-p:my-0">
                        {typeof promotion.description === 'string' ? <p>{promotion.description}</p> : <RichText data={promotion.description} />}
                      </div>
                    ) : null}
                    <div
                      style={{ fontFamily: 'var(--second-font)' }}
                      className="text-[13px] text-[#909da2] font-medium tracking-wide uppercase mt-4"
                    >
                      {locale === 'uk' ? 'Діє до' : locale === 'es' ? 'Válido hasta' : 'Valid until'}:{' '}
                      {new Date(promotion.validUntil).toLocaleDateString(locale === 'uk' ? 'uk-UA' : locale === 'es' ? 'es-ES' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    {block.buttonText && (
                      <div className="mt-2">
                        <a href={resolveHref(block.buttonLink)} className={buttonClass}>
                          {block.buttonText}
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )
            }

            case 'team': {
              const selectedMembers = (block.selectedMembers || []).filter(isTeamMemberDoc)
              const membersToShow = ((block.source || 'all') === 'manual'
                ? selectedMembers
                : team).slice(0, block.sliderLimit || 12)
              const compactSpacing = isCompactSpacing(block)
              const theme = getBlockTheme(block.theme)
              const buttonClass = getButtonStyle(block.buttonStyle)

              return (
                <section
                  key={block.id || idx}
                  id="team"
                  className={compactSpacing ? `${theme.section} py-[56px] max-[767px]:py-[40px]` : `${theme.section} py-[100px] max-[767px]:py-[64px]`}
                  style={getThemeBackgroundStyle(theme, 'section')}
                >
                  <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-0">
                    <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-center mb-[20px]">
                      {block.sectionTitle || teamTitle}
                    </h2>
                    {block.description && (
                      <div className="max-w-[760px] mx-auto text-center text-[#505a5e] prose mb-[50px] max-[1100px]:mb-[36px]">
                        <RichText data={block.description} />
                      </div>
                    )}
                    <div className="relative">
                      {membersToShow.length > 4 ? (
                        <TeamSlider members={membersToShow} />
                      ) : membersToShow.length > 0 ? (
                        <div className="grid grid-cols-4 max-[991px]:grid-cols-3 max-[767px]:grid-cols-2 max-[567px]:grid-cols-1 gap-[30px] max-[1100px]:gap-[20px]">
                          {membersToShow.map((member, memberIndex) => {
                            const photoUrl = mediaUrl(member.photo)
                            return (
                              <div key={member.id || memberIndex} className="rounded-[20px] overflow-hidden flex flex-col">
                                <div className="relative h-[400px] max-[767px]:h-[280px]">
                                  {photoUrl ? (
                                    <img src={photoUrl} alt={member.name} className="absolute inset-0 w-full h-full object-cover rounded-[20px]" />
                                  ) : (
                                    <ImagePlaceholder label={member.name} className="absolute inset-0 w-full h-full rounded-[20px]" />
                                  )}
                                </div>
                                <div className="p-[10px_20px] flex flex-col">
                                  <span className="font-semibold text-[16px] text-[#22282b]">{member.name}</span>
                                  {member.description && (
                                    <div className="text-[14px] text-[#22282b] mt-1 prose max-w-none prose-p:my-0">
                                      {typeof member.description === 'string' ? <p>{member.description}</p> : <RichText data={member.description} />}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center text-[#909da2] py-8">
                          <p className="text-[16px]">
                            {locale === 'uk'
                              ? 'Команда ще не заповнена.'
                              : locale === 'es'
                                ? 'El equipo aun no esta completado.'
                                : 'The team section is not populated yet.'}
                          </p>
                        </div>
                      )}
                    </div>
                    {block.buttonText && (
                      <div className="mt-[40px] text-center">
                        <a href={resolveHref(block.buttonLink)} className={buttonClass}>
                          {block.buttonText}
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )
            }

            case 'reviews': {
              const compactSpacing = isCompactSpacing(block)
              const theme = getBlockTheme(block.theme)
              const buttonClass = getButtonStyle(block.buttonStyle)
              const reviewsBlock = block as typeof block & {
                intro?: unknown
                splitHeaderLayout?: boolean | null
                summaryTitle?: string | null
                reviewsLabel?: string | null
              }
              const splitHeaderLayout = Boolean(reviewsBlock.splitHeaderLayout)
              return (
                <section
                  key={block.id || idx}
                  id="reviews"
                  className={compactSpacing ? `py-[64px] max-[767px]:py-[44px] relative ${theme.section}` : `py-[96px] max-[767px]:py-[64px] relative ${theme.section}`}
                  style={getThemeBackgroundStyle(theme, 'section')}
                >
                  <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px] flex flex-col gap-5">
                    {splitHeaderLayout ? (
                      <div className="grid grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-8 items-start mb-6 max-[767px]:grid-cols-1 max-[767px]:gap-4">
                        <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-left mb-0">
                          {block.sectionTitle || reviewsTitle}
                        </h2>
                        {reviewsBlock.intro ? (
                          <div className="prose max-w-none text-[#505a5e]">
                            <RichText data={reviewsBlock.intro as never} />
                          </div>
                        ) : <div />}
                      </div>
                    ) : (
                      <>
                        <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-center mb-6">
                          {block.sectionTitle || reviewsTitle}
                        </h2>
                        {reviewsBlock.intro && (
                          <div className="prose max-w-[760px] mx-auto text-[#505a5e] text-center mb-6">
                            <RichText data={reviewsBlock.intro as never} />
                          </div>
                        )}
                      </>
                    )}
                    {block.embedCode ? (
                      <div
                        className="bg-white p-[10px] rounded-lg"
                        dangerouslySetInnerHTML={{ __html: block.embedCode }}
                      />
                    ) : (
                      <GoogleReviews
                        locale={locale as 'es' | 'en' | 'uk'}
                        desktopSlides={parseInt(block.desktopSlides || '2')}
                        summaryTitle={reviewsBlock.summaryTitle}
                        reviewsLabel={reviewsBlock.reviewsLabel}
                        writeReviewLabel={block.buttonText}
                        writeReviewLink={block.buttonLink}
                      />
                    )}
                  </div>
                </section>
              )
            }

            case 'gallery': {
              const isSliderLeft = (block.position || 'right') === 'left'
              const compactSpacing = isCompactSpacing(block)
              const theme = getBlockTheme(block.theme)
              const buttonClass = getButtonStyle(block.buttonStyle)

              return (
                <section key={block.id || idx} id="gallery" className={`flex max-[991px]:flex-col ${theme.panel}`} style={getThemeBackgroundStyle(theme, 'panel')}>
                  <div className={`w-1/2 max-[991px]:w-full h-[600px] max-[991px]:h-auto max-[991px]:aspect-[4/3] ${isSliderLeft ? 'order-1' : 'order-2 max-[991px]:order-1'}`}>
                    {block.images.length > 0 ? (
                      <GallerySlider images={block.images} />
                    ) : (
                      <ImagePlaceholder label="Gallery Placeholder" className="w-full h-full" />
                    )}
                  </div>
                  <div className={`w-1/2 max-[991px]:w-full flex flex-col justify-center ${compactSpacing ? 'py-6 max-[1100px]:py-5 max-[991px]:py-4' : 'py-10 max-[1100px]:py-8 max-[991px]:py-6'} ${isSliderLeft ? 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px]' : 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px]'}`}>
                    {block.title && (
                      <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-left mb-[30px]">{block.title}</h2>
                    )}
                    {block.description && (
                      <div className="text-[16px] text-[#909da2] leading-relaxed prose max-w-none">
                        <RichText data={block.description} />
                      </div>
                    )}
                    {block.buttonText && (
                      <div className="mt-6">
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
                    <img src={backgroundImageUrl} alt={block.title || 'Content background'} className="absolute inset-0 w-full h-full object-cover" />
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
                            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{emailLabel}</span>
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
                            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{phoneLabel}</span>
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-3">
                                {contacts.telegram && (
                                  <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:scale-105 transition-transform" title="Telegram">
                                    <img src="/icons/telegram.svg" alt="Telegram" className="w-[18px] h-[18px]" />
                                  </a>
                                )}
                                {contacts.whatsapp && (
                                  <a href={contacts.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:scale-105 transition-transform" title="WhatsApp">
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
                            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{addressLabel}</span>
                            <p style={{ fontFamily: 'var(--second-font)' }} className="text-[16px] leading-relaxed font-medium">{contacts.address}</p>
                          </div>
                        )}
                        {contacts.transport && (
                          <div className="flex flex-col gap-2">
                            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{transportLabel}</span>
                            <p style={{ fontFamily: 'var(--second-font)' }} className="text-[15px] text-[#505a5e] leading-relaxed">{contacts.transport}</p>
                          </div>
                        )}
                        {contacts.socialLinks && contacts.socialLinks.length > 0 && (
                          <div className="flex flex-col gap-2 mt-2">
                            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{socialLabel}</span>
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

            case 'contentImage': {
              const imageUrl = mediaUrl(block.image)
              const isImageLeft = (block.position || 'left') === 'left'
              const isImageContained = (block as { imageWidth?: unknown }).imageWidth === 'contained'
              const buttonLink = block.buttonLink || '#contact_us'
              const theme = getBlockTheme(block.theme)
              const buttonClass = getButtonStyle(block.buttonStyle)

              return (
                <section key={block.id || idx} className="flex items-stretch min-h-[420px] max-[991px]:min-h-0 max-[991px]:flex-col">
                  <div className={`w-1/2 max-[991px]:w-full min-h-[320px] max-[991px]:min-h-0 max-[991px]:aspect-[4/3] ${isImageLeft ? 'order-1' : 'order-2 max-[991px]:order-1'} ${isImageContained ? 'flex items-center justify-center p-[24px] max-[1100px]:p-[20px] max-[767px]:p-[16px]' : ''}`}>
                    <div className={isImageContained ? 'w-full max-w-[520px] h-full max-[991px]:max-w-none max-[991px]:h-full overflow-hidden rounded-[24px] shadow-[0_18px_40px_rgba(34,40,43,0.08)]' : 'w-full h-full'}>
                      {imageUrl ? (
                        <img src={imageUrl} alt={block.title || `Content block ${idx + 1}`} className="w-full h-full object-cover block" />
                      ) : (
                        <ImagePlaceholder label={block.title || `Content block ${idx + 1}`} className="w-full h-full" />
                      )}
                    </div>
                  </div>
                  <div className={`w-1/2 max-[991px]:w-full flex flex-col justify-center gap-5 py-12 max-[1100px]:py-10 ${theme.panel} ${isImageLeft ? 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px]' : 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px]'}`} style={getThemeBackgroundStyle(theme, 'panel')}>
                    {block.title && (
                      <h2 className="text-[24px] max-[767px]:text-[20px] font-semibold text-[#3c5557]">{block.title}</h2>
                    )}
                    <div className="prose max-w-none text-[#22282b]">
                      <RichText data={block.text} />
                    </div>
                    {block.buttonText && (
                      <div className="mt-4">
                        <a
                          href={resolveHref(buttonLink)}
                          className={buttonClass}
                        >
                          {block.buttonText}
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )
            }

            case 'contactSection': {
              const orderedContactRows = block.contactRowsOrder?.length
                ? block.contactRowsOrder.map((item) => item.row)
                : ['email', 'phone', 'address', 'transport', 'social']
              const compactSpacing = isCompactSpacing(block)
              const theme = getBlockTheme(block.theme)
              const formLabels = {
                name: locale === 'uk' ? 'Ваше імʼя' : locale === 'es' ? 'Tu nombre' : 'Your name',
                phone: locale === 'uk' ? 'Ваш телефон' : locale === 'es' ? 'Tu telefono' : 'Your phone',
                email: locale === 'uk' ? 'Ваш email' : locale === 'es' ? 'Tu email' : 'Your email',
                message: locale === 'uk' ? 'Ваше повідомлення' : locale === 'es' ? 'Tu mensaje' : 'Your message',
              }

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
                        {block.sectionTitle || contactTitle}
                      </h2>
                      {(block.sectionDescription || contactDesc) && (
                        <div className="text-[15px] text-[#909da2] leading-relaxed mb-8 prose max-w-none">
                          {block.sectionDescription ? (
                            <RichText data={block.sectionDescription} />
                          ) : typeof contactDesc === 'string' ? (
                            <p>{contactDesc}</p>
                          ) : (
                            <RichText data={contactDesc} />
                          )}
                        </div>
                      )}

                      <div className="flex flex-col gap-6 text-[#22282b]">
                        {orderedContactRows.map((row, rowIndex) => {
                          if (row === 'email' && contacts?.email) {
                            return (
                              <div key={`${row}-${rowIndex}`} className="flex flex-col gap-2">
                                <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{emailLabel}</span>
                                <a
                                  href={`mailto:${contacts.email}`}
                                  style={{ fontFamily: 'var(--second-font)' }}
                                  className="text-[18px] font-medium hover:opacity-80 transition-opacity"
                                >
                                  {contacts.email}
                                </a>
                              </div>
                            )
                          }

                          if (row === 'phone' && contacts?.phone) {
                            return (
                              <div key={`${row}-${rowIndex}`} className="flex flex-col gap-2">
                                <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{phoneLabel}</span>
                                <div className="flex items-center gap-4 flex-wrap">
                                  <div className="flex items-center gap-3">
                                    {contacts.telegram && (
                                      <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:scale-105 transition-transform" title="Telegram">
                                        <img src="/icons/telegram.svg" alt="Telegram" className="w-[18px] h-[18px]" />
                                      </a>
                                    )}
                                    {contacts.whatsapp && (
                                      <a href={contacts.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:scale-105 transition-transform" title="WhatsApp">
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
                            )
                          }

                          if (row === 'address' && contacts?.address) {
                            return (
                              <div key={`${row}-${rowIndex}`} className="flex flex-col gap-2">
                                <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{addressLabel}</span>
                                <p style={{ fontFamily: 'var(--second-font)' }} className="text-[16px] leading-relaxed font-medium">{contacts.address}</p>
                              </div>
                            )
                          }

                          if (row === 'transport' && contacts?.transport) {
                            return (
                              <div key={`${row}-${rowIndex}`} className="flex flex-col gap-2">
                                <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{transportLabel}</span>
                                <p style={{ fontFamily: 'var(--second-font)' }} className="text-[15px] text-[#505a5e] leading-relaxed">{contacts.transport}</p>
                              </div>
                            )
                          }

                          if (row === 'social' && contacts?.socialLinks && contacts.socialLinks.length > 0) {
                            return (
                              <div key={`${row}-${rowIndex}`} className="flex flex-col gap-2 mt-2">
                                <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">{socialLabel}</span>
                                <div className="flex items-center gap-3">
                                  {contacts.socialLinks.map((link, linkIndex) => (
                                    <a
                                      key={linkIndex}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-center hover:scale-105 transition-transform"
                                      title={link.platform}
                                    >
                                      <SocialIcon platform={link.platform} />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )
                          }

                          return null
                        })}
                      </div>
                    </div>

                  <div className={`w-1/2 max-[991px]:w-full ${theme.panelAlt} rounded-[20px] p-8 max-[1100px]:p-6 shadow-md`} style={getThemeBackgroundStyle(theme, 'panelAlt')}>
                      {(block.formTitle || block.formDescription) && (
                        <div className="mb-6">
                          {block.formTitle && (
                            <h3 className="text-[24px] max-[767px]:text-[20px] font-semibold text-[#22282b] mb-3">{block.formTitle}</h3>
                          )}
                          {block.formDescription && (
                            <div className="text-[#909da2] prose max-w-none">
                              <RichText data={block.formDescription} />
                            </div>
                          )}
                        </div>
                      )}
                      <ContactForm
                        locale={locale}
                        fullNamePlaceholder={block.fullNamePlaceholder || (locale === 'uk' ? 'ПІБ' : locale === 'es' ? 'Nombre completo' : 'Full name')}
                        phonePlaceholder={block.phonePlaceholder || formLabels.phone}
                        emailPlaceholder={block.emailPlaceholder || formLabels.email}
                        patientTypePlaceholder={block.patientTypePlaceholder || (locale === 'uk' ? 'Я:' : locale === 'es' ? 'Soy:' : 'I am:')}
                        referralSourcePlaceholder={block.referralSourcePlaceholder || (locale === 'uk' ? 'Дізнався про вас:' : locale === 'es' ? 'Como nos conociste:' : 'How did you hear about us:')}
                        commentPlaceholder={block.commentPlaceholder || formLabels.message}
                        submitButtonLabel={block.submitButtonLabel || (locale === 'uk' ? 'Надіслати' : locale === 'es' ? 'Enviar' : 'Send')}
                        successMessage={
                          block.successMessage ||
                          (locale === 'uk'
                            ? 'Дякуємо! Ваше повідомлення успішно надіслано.'
                            : locale === 'es'
                              ? 'Gracias. Su mensaje ha sido enviado correctamente.'
                              : 'Thank you. Your message has been sent successfully.')
                        }
                        errorMessage={
                          block.errorMessage ||
                          (locale === 'uk'
                            ? 'Не вдалося надіслати форму. Спробуйте ще раз.'
                            : locale === 'es'
                              ? 'No se pudo enviar el formulario. Inténtelo de nuevo.'
                              : 'The form could not be submitted. Please try again.')
                        }
                        patientTypeOptions={
                          block.patientTypeOptions?.length
                            ? block.patientTypeOptions.map((option) => ({ id: option.id, label: option.label }))
                            : getDefaultPatientTypeOptions(locale)
                        }
                        referralSourceOptions={
                          block.referralSourceOptions?.length
                            ? block.referralSourceOptions.map((option) => ({ id: option.id, label: option.label }))
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
      </>
    )
  }

  // ─── Default Section Order if not set in DB ───
  const defaultSectionOrder = [
    { section: 'hero', enabled: true },
    { section: 'advantages', enabled: true },
    { section: 'aboutUs', enabled: true },
    { section: 'philosophy', enabled: true },
    { section: 'promotions', enabled: true },
    { section: 'team', enabled: true },
    { section: 'reviews', enabled: true },
    { section: 'gallery', enabled: true },
    { section: 'whyUs', enabled: true },
    { section: 'contacts', enabled: true },
  ]

  const sectionOrder = (homeData.sectionOrder && homeData.sectionOrder.length > 0)
    ? homeData.sectionOrder
    : defaultSectionOrder

  return (
    <>
      {sectionOrder.map(({ section, enabled }, idx) => {
        if (!enabled) return null

        switch (section) {
          case 'hero':
            return (
              <section key={`sec-${idx}`} id="main-block" className="pt-[10px]">
                <div className="flex items-stretch min-h-[400px] max-[991px]:flex-col">
                  {/* Left: Text */}
                  <div className="w-1/2 max-[991px]:w-full flex flex-col justify-center pl-[max(30px,calc((100vw-1200px)/2))] pr-[30px] py-16">
                    <h1 className="text-[32px] leading-[50px] font-semibold mb-5 text-[#22282b]">
                      {heroTitle}
                    </h1>
                    {heroSubtitle && (
                      <p className="text-[18px] text-[#909da2] mb-8 leading-relaxed">{heroSubtitle}</p>
                    )}
                    <div>
                      <a
                        href={resolveHref(heroButtonLink)}
                        className={primaryButtonClass}
                      >
                        {heroButtonText}
                      </a>
                    </div>
                  </div>
                  {/* Right: Image */}
                  <div className="w-1/2 max-[991px]:w-full relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 left-0 w-[10%] h-full bg-gradient-to-r from-[#fafafa] to-transparent z-[1] pointer-events-none max-[991px]:hidden" />
                    {heroImageUrl ? (
                      <img
                        src={heroImageUrl}
                        alt="Hero"
                        className="w-full h-full object-cover block"
                      />
                    ) : (
                      <ImagePlaceholder label="Hero Image" className="w-full h-full min-h-[400px]" />
                    )}
                  </div>
                </div>
              </section>
            )

          case 'advantages':
            return (
              <section key={`sec-${idx}`} id="advantages" className={`${legacyPrimaryTheme.section} py-[100px]`}>
                <div className={`px-[max(30px,calc((100vw-1200px)/2))] flex flex-wrap gap-[50px] ${getIncompleteRowJustifyClass(homeData.advantages)} max-[767px]:flex-col max-[767px]:items-center`}>
                  {advantages.length > 0 ? (
                    advantages.map((adv, i) => {
                      const iconUrl = mediaUrl(adv.icon)
                      return (
                        <div
                          key={adv.id || i}
                          className="flex flex-col items-center text-center gap-5 w-full max-w-[320px] max-[767px]:max-w-full"
                        >
                          {iconUrl ? (
                            <img src={iconUrl} alt={adv.title} className="w-auto h-[50px]" />
                          ) : (
                            <div className="w-[50px] h-[50px] rounded-full bg-[#3c5557]/10 flex items-center justify-center">
                              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#3c5557]">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="currentColor"/>
                              </svg>
                            </div>
                          )}
                          <h3 className="text-[20px] font-medium text-[#22282b]">{adv.title}</h3>
                          <div className="text-[15px] text-[#909da2] leading-relaxed prose max-w-none prose-p:my-0">
                            {typeof adv.description === 'string' ? <p>{adv.description}</p> : <RichText data={adv.description} />}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center text-center gap-5 w-full max-w-[320px]"
                      >
                        <div className="w-[50px] h-[50px] rounded-full bg-[#3c5557]/10 flex items-center justify-center">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#3c5557]">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="currentColor"/>
                          </svg>
                        </div>
                        <h3 className="text-[20px] font-medium text-[#22282b]">
                          {['Diagnóstico honesto', 'Tecnología avanzada', 'Atención personalizada'][i]}
                        </h3>
                        <p className="text-[15px] text-[#909da2] leading-relaxed">
                          Placeholder description. Edit from admin panel.
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )

          case 'aboutUs':
            return (
              <section key={`sec-${idx}`} id="about_us" className="flex flex-col">
                {aboutBlocks.length > 0 ? (
                  aboutBlocks.map((block, i) => {
                    const imgUrl = mediaUrl(block.image)
                    const isReversed = i % 2 === 1
                    const bgClass = aboutBgColors[i % aboutBgColors.length]

                    return (
                      <div
                        key={block.id || i}
                        className="flex items-stretch min-h-[500px] max-[991px]:h-auto max-[991px]:flex-col"
                      >
                        {/* Photo side */}
                        <div
                          className={`w-1/2 max-[991px]:w-full h-full min-h-[500px] max-[991px]:min-h-[300px] flex ${
                            isReversed ? 'order-2 max-[991px]:order-1' : 'order-1'
                          }`}
                        >
                          {imgUrl ? (
                            <img src={imgUrl} alt={block.title || `About ${i + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <ImagePlaceholder label={block.title || aboutLabels[i % aboutLabels.length]} className="w-full h-full" />
                          )}
                        </div>
                        {/* Text side */}
                        <div
                          className={`w-1/2 max-[991px]:w-full h-full min-h-[500px] max-[991px]:min-h-0 flex flex-col justify-center gap-5 ${bgClass} ${
                            isReversed
                              ? 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[991px]:px-[30px]'
                              : 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[991px]:px-[30px]'
                          } py-12`}
                        >
                          {block.title && (
                            <h3 className="text-[24px] font-semibold text-[#3c5557] mb-2">{block.title}</h3>
                          )}
                          <div className="text-[16px] leading-relaxed text-[#22282b] prose max-w-none">
                            {block.text && <p>{block.text}</p>}
                          </div>
                          {block.buttonText && block.buttonLink && (
                            <div className="mt-4">
                              <a
                                href={resolveHref(block.buttonLink)}
                                className={primaryButtonClass}
                              >
                                {block.buttonText}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  Array.from({ length: 3 }).map((_, i) => {
                    const isReversed = i % 2 === 1
                    const bgClass = aboutBgColors[i]
                    return (
                      <div
                        key={i}
                        className="flex items-center h-[500px] max-[991px]:h-auto max-[991px]:flex-col"
                      >
                        <div
                          className={`w-1/2 max-[991px]:w-full h-full flex max-[991px]:min-h-[300px] ${
                            isReversed ? 'order-2 max-[991px]:order-1' : 'order-1'
                          }`}
                        >
                          <ImagePlaceholder label={aboutLabels[i]} className="w-full h-full" />
                        </div>
                        <div
                          className={`w-1/2 max-[991px]:w-full h-full flex flex-col justify-center gap-5 ${bgClass} ${
                            isReversed
                              ? 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[991px]:px-[30px]'
                              : 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[991px]:px-[30px]'
                          } py-10`}
                        >
                          <p className="text-[16px] leading-relaxed text-[#22282b]">{aboutFallbacks[i]}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </section>
            )

          case 'philosophy':
            return (
              <section key={`sec-${idx}`} id="filosofia" className={`py-[100px] ${legacySecondaryTheme.sectionAlt}`}>
                <div className="max-w-[1200px] mx-auto px-[30px]">
                  {philTitle && (
                    <h2 className="text-[32px] font-semibold text-center mb-[60px] text-[#3c5557]">{philTitle}</h2>
                  )}
                  <div className={`flex flex-wrap gap-[50px] ${getIncompleteRowJustifyClass(homeData.philosophy)} max-[767px]:flex-col max-[767px]:items-center`}>
                    {homeData.philosophy?.cards && homeData.philosophy.cards.length > 0 ? (
                      homeData.philosophy.cards.map((card, i) => {
                        const iconUrl = mediaUrl(card.icon)
                        return (
                          <div
                            key={card.id || i}
                            className="flex flex-col items-center text-center gap-5 w-full max-w-[320px] max-[767px]:max-w-full max-[767px]:items-start max-[767px]:text-left"
                          >
                            {iconUrl ? (
                              <img src={iconUrl} alt={card.title} className="w-auto h-[50px]" />
                            ) : (
                              <div className="w-[50px] h-[50px] rounded-full bg-[#3c5557]/10 flex items-center justify-center">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#3c5557]">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="currentColor"/>
                                </svg>
                              </div>
                            )}
                            <h3 className="text-[20px] font-medium text-[#22282b]">{card.title}</h3>
                            <div className="mobile-richtext-left text-[15px] text-[#909da2] leading-relaxed prose max-w-none prose-p:my-0 max-[767px]:text-left max-[767px]:[&_p]:text-left max-[767px]:[&_li]:text-left">
                              {typeof card.description === 'string' ? <p>{card.description}</p> : <RichText data={card.description} />}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="max-w-[800px] mx-auto text-center">
                        <p className="text-[18px] text-[#22282b] leading-relaxed mb-10">{philText}</p>
                        <a
                          href={resolveHref(philLink)}
                          className={primaryButtonClass}
                        >
                          {philButton}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )

          case 'promotions':
            return (
              <section key={`sec-${idx}`} id="offers" className={`py-[100px] ${legacyPrimaryTheme.panel}`}>
                <div className="max-w-[1200px] mx-auto px-[30px]">
                  <h2 className="text-[32px] font-semibold text-center mb-[50px] text-[#22282b]">
                    {locale === 'uk' ? 'Акції та спеціальні пропозиції' : locale === 'es' ? 'Promociones especiales' : 'Special Promotions'}
                  </h2>
                  {activePromos.length > 0 ? (
                    <div className="grid grid-cols-2 max-[767px]:grid-cols-1 gap-[30px]">
                      {activePromos.map((promo, idx) => (
                        <div key={promo.id || idx} className={`${legacyPrimaryTheme.card} rounded-[20px] p-8 shadow-sm flex flex-col justify-between border border-[#22282b]/[0.03] min-h-[220px]`}>
                          <div>
                            <h3 className="text-[20px] font-semibold text-[#3c5557] mb-3">{promo.title}</h3>
                            <div className="text-[15px] text-[#505a5e] leading-relaxed mb-6 prose max-w-none prose-p:my-0">
                              {typeof promo.description === 'string' ? (
                                <p>{promo.description}</p>
                              ) : promo.description ? (
                                <RichText data={promo.description} />
                              ) : null}
                            </div>
                          </div>
                          <div
                            style={{ fontFamily: 'var(--second-font)' }}
                            className="text-[13px] text-[#909da2] font-medium tracking-wide uppercase mt-4"
                          >
                            {locale === 'uk' ? 'Діє до' : locale === 'es' ? 'Válido hasta' : 'Valid until'}:{' '}
                            {new Date(promo.validUntil).toLocaleDateString(locale === 'uk' ? 'uk-UA' : locale === 'es' ? 'es-ES' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-[#909da2] py-8">
                      <p className="text-[16px]">
                        {locale === 'uk'
                          ? 'Наразі немає активних акцій. Слідкуйте за оновленнями!'
                          : locale === 'es'
                          ? 'No hay promociones activas en este momento. ¡Mantente informado!'
                          : 'There are no active promotions at the moment. Stay tuned!'}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )

          case 'team':
            return (
              <section key={`sec-${idx}`} id="team" className={`${legacyPrimaryTheme.section} py-[100px]`}>
                <h2 className="text-[32px] font-semibold text-center mb-[50px]">{teamTitle}</h2>
                <div className="max-w-[1200px] mx-auto relative px-[30px] max-[1230px]:px-[30px]">
                  {team.length > 0 ? (
                    <TeamSlider members={team} />
                  ) : (
                    <div className="grid grid-cols-4 max-[991px]:grid-cols-3 max-[767px]:grid-cols-2 max-[567px]:grid-cols-1 gap-[30px]">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-[20px] overflow-hidden">
                          <ImagePlaceholder label={`Team Member ${i + 1}`} className="w-full h-[400px]" />
                          <div className="p-[10px_20px]">
                            <span className="font-semibold text-[16px]">Name Placeholder</span>
                            <p className="text-[14px] text-[#909da2] mt-1">Position placeholder</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )

          case 'reviews':
            return (
              <section key={`sec-${idx}`} id="reviews" className={`py-[120px] relative ${legacyPrimaryTheme.section}`}>
                <div className="max-w-[1200px] mx-auto px-[30px] flex flex-col gap-5">
                  <h2 className="text-[32px] font-semibold text-center mb-6">{reviewsTitle}</h2>
                  {homeData.reviews?.subtitle && (
                    <p className="text-[16px] text-[#909da2] text-center mb-8 max-w-[600px] mx-auto leading-relaxed">
                      {homeData.reviews.subtitle}
                    </p>
                  )}
                  {reviewsEmbed ? (
                    <div
                      className="bg-white p-[10px] rounded-lg"
                      dangerouslySetInnerHTML={{ __html: reviewsEmbed }}
                    />
                  ) : (
                    <div className="bg-white p-10 rounded-lg text-center text-[#909da2]">
                      <p className="text-[16px]">
                        {locale === 'uk'
                          ? 'Відгуки з\'являться тут. Вставте HTML-код віджету через адмін-панель.'
                          : locale === 'en'
                          ? 'Reviews will appear here. Insert an HTML widget code from the admin panel.'
                          : 'Las reseñas aparecerán aquí. Inserte un código de widget HTML desde el panel de administración.'}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )

          case 'gallery':
            return (
              <section key={`sec-${idx}`} id="gallery" className={`flex max-[991px]:flex-col ${legacyPrimaryTheme.panel}`}>
                {/* Left: Info */}
                <div className="w-1/2 max-[991px]:w-full flex flex-col justify-center py-10 max-[1100px]:py-8 max-[991px]:py-6 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[1200px]:px-[40px] max-[1100px]:px-[28px] max-[991px]:px-[30px] max-[767px]:px-[20px]">
                  <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-left mb-[30px]">{galleryTitle}</h2>
                  <div className="text-[16px] text-[#909da2] leading-relaxed prose max-w-none prose-p:my-0">
                    {typeof galleryDesc === 'string' ? <p>{galleryDesc}</p> : <RichText data={galleryDesc} />}
                  </div>
                </div>
                {/* Right: Slider */}
                <div className="w-1/2 max-[991px]:w-full h-[600px] max-[991px]:h-[400px]">
                  {galleryImages.length > 0 ? (
                    <GallerySlider images={galleryImages} />
                  ) : (
                    <ImagePlaceholder label="Gallery Placeholder" className="w-full h-full" />
                  )}
                </div>
              </section>
            )

          case 'whyUs':
            return (
              <section key={`sec-${idx}`} id="whyus" className={`py-[100px] flex flex-col items-center text-center px-[30px] ${legacyPrimaryTheme.section}`}>
                <div className="max-w-[800px]">
                  <h2 className="text-[32px] font-semibold text-[#3c5557] mb-8">{whyUsTitle}</h2>
                  <p className="text-[18px] text-[#22282b] leading-relaxed">{whyUsText}</p>
                </div>
              </section>
            )

          case 'contacts':
            return (
              <section key={`sec-${idx}`} id="contact_us" className={`${legacyPrimaryTheme.panel} py-[100px] contact_us`}>
                <div className="max-w-[1200px] mx-auto px-[30px] flex gap-[80px] max-[991px]:flex-col max-[991px]:gap-[50px] items-start">
                  {/* Left: Info */}
                  <div className="w-1/2 max-[991px]:w-full flex flex-col contact_us-info">
                    <h2 className="text-[32px] font-semibold text-left mb-6 text-[#22282b]">
                      {contactTitle || (locale === 'uk' ? 'Контакти' : locale === 'es' ? 'Contacto' : 'Contact')}
                    </h2>
                    {contactDesc && (
                      <div className="text-[15px] text-[#909da2] leading-relaxed mb-8 prose max-w-none">
                        {typeof contactDesc === 'string' ? <p>{contactDesc}</p> : <RichText data={contactDesc} />}
                      </div>
                    )}

                    <div className="flex flex-col gap-6 text-[#22282b]">
                      {/* Phone with WhatsApp and Telegram icons */}
                      {contacts?.phone && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">
                            {phoneLabel}
                          </span>
                          <div className="flex items-center gap-4 flex-wrap">
                            <a
                              href={`tel:${contacts.phone.replace(/\s+/g, '')}`}
                              className="text-[18px] font-medium hover:opacity-80 transition-opacity"
                            >
                              {contacts.phone}
                            </a>
                            <div className="flex items-center gap-3">
                              {contacts.whatsapp && (
                                <a
                                  href={contacts.whatsapp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                                  title="WhatsApp"
                                >
                                  <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-[18px] h-[18px]" />
                                </a>
                              )}
                              {contacts.telegram && (
                                <a
                                  href={contacts.telegram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                                  title="Telegram"
                                >
                                  <img src="/icons/telegram.svg" alt="Telegram" className="w-[18px] h-[18px]" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      {contacts?.email && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">
                            {emailLabel}
                          </span>
                          <a
                            href={`mailto:${contacts.email}`}
                            className="text-[18px] font-medium hover:opacity-80 transition-opacity"
                          >
                            {contacts.email}
                          </a>
                        </div>
                      )}

                      {/* Address */}
                      {contacts?.address && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">
                            {addressLabel}
                          </span>
                          <p className="text-[16px] leading-relaxed font-medium">
                            {contacts.address}
                          </p>
                        </div>
                      )}

                      {/* Transport */}
                      {contacts?.transport && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">
                            {transportLabel}
                          </span>
                          <p className="text-[15px] text-[#505a5e] leading-relaxed">
                            {contacts.transport}
                          </p>
                        </div>
                      )}

                      {/* Social Media Links */}
                      {contacts?.socialLinks && contacts.socialLinks.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#909da2]">
                            {socialLabel}
                          </span>
                          <div className="flex items-center gap-3">
                            {contacts.socialLinks.map((link, idx) => {
                              const iconMap: Record<string, string> = {
                                instagram: '/icons/instagram.svg',
                                facebook: '/icons/facebook.svg',
                                twitter: '/icons/twitter.svg',
                              }
                              const iconSrc = iconMap[link.platform]
                              return (
                                <a
                                  key={idx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                                  title={link.platform}
                                >
                                  {iconSrc ? (
                                    <img src={iconSrc} alt={link.platform} className="w-[20px] h-[20px]" />
                                  ) : link.platform === 'youtube' ? (
                                    <svg className="w-[20px] h-[20px] fill-[#22282b]" viewBox="0 0 24 24">
                                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555a3.003 3.003 0 0 0-2.11 2.108C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                  ) : link.platform === 'tiktok' ? (
                                    <svg className="w-[20px] h-[20px] fill-[#22282b]" viewBox="0 0 24 24">
                                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.58 4.22.95 1.1 2.27 1.83 3.73 2.05v3.83c-1.39-.03-2.74-.51-3.87-1.37a8.09 8.09 0 0 1-2.22-2.58v9.42c.04 1.48-.3 2.96-1.01 4.26-.71 1.29-1.78 2.37-3.08 3.08a8.312 8.312 0 0 1-8.52 0A8.09 8.09 0 0 1 .74 19.86a8.21 8.21 0 0 1 0-8.52c.71-1.29 1.78-2.37 3.08-3.08a8.32 8.32 0 0 1 7.21-.49c.03.65.01 1.31.02 1.97-.68-.2-1.4-.23-2.1-.08a4.11 4.11 0 0 0-3.13 3.13c-.22.94-.12 1.93.28 2.8.39.87 1.09 1.58 1.96 1.97a4.17 4.17 0 0 0 4.14 0 4.2 4.2 0 0 0 1.97-1.97 4.131 4.131 0 0 0-.01-4.14V.02z" />
                                    </svg>
                                  ) : (
                                    <span className="text-[12px] uppercase font-semibold">{link.platform}</span>
                                  )}
                                </a>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Map */}
                  <div className="w-1/2 max-[991px]:w-full h-[450px] rounded-[20px] overflow-hidden shadow-md relative bg-white">
                    {contacts?.googleMapsUrl ? (
                      <iframe
                        src={contacts.googleMapsUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-[#909da2] bg-[#efefef]">
                        <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="opacity-40 mb-4">
                          <path d="M24 4C15.7 4 9 10.7 9 19c0 9.7 13.6 23.9 14.2 24.5a1.1 1.1 0 0 0 1.6 0C25.4 42.9 39 28.7 39 19c0-8.3-6.7-15-15-15zm0 22a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" fill="currentColor"/>
                        </svg>
                        <span className="text-[15px] font-medium text-center">
                          {locale === 'uk'
                            ? 'Мапа не налаштована. Вкажіть посилання на мапу в адмін-панелі.'
                            : locale === 'es'
                            ? 'Mapa no configurado. Especifique un enlace de mapa en el panel de administración.'
                            : 'Map not configured. Specify a map link in the admin panel.'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return PageContent({ locale, slug: 'home' })
}
