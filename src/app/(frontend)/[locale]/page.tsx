import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { HomePage as HomePageType, TeamMember, Media } from '@/payload-types'
import TeamSlider from '@/components/TeamSlider'
import GallerySlider from '@/components/GallerySlider'

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  const homeData = await payload.findGlobal({
    slug: 'home-page',
    locale: locale as 'es' | 'en' | 'uk',
  })

  const teamMembers = await payload.find({
    collection: 'team-members',
    locale: locale as 'es' | 'en' | 'uk',
    sort: 'order',
    limit: 20,
  })

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

  const philTitle = homeData.philosophy?.title || loc.philosophyTitle
  const philText = homeData.philosophy?.text || loc.philosophyText
  const philButton = homeData.philosophy?.buttonText || loc.philosophyButton
  const philLink = homeData.philosophy?.buttonLink || '#contact_us'

  const offersText = homeData.offers?.text || loc.offersText
  const offersImageUrl = mediaUrl(homeData.offers?.image)

  const teamTitle = homeData.teamSection?.title || loc.teamTitle
  const team = teamMembers.docs as TeamMember[]

  const reviewsTitle = homeData.reviews?.title || loc.reviewsTitle
  const reviewsEmbed = homeData.reviews?.embedCode || ''

  const galleryTitle = homeData.gallery?.title || loc.galleryTitle
  const galleryDesc = homeData.gallery?.description || loc.galleryDesc
  const galleryImages = homeData.gallery?.images || []

  const whyUsTitle = homeData.whyUs?.title || loc.whyUsTitle
  const whyUsText = homeData.whyUs?.text || loc.whyUsText

  const contactTitle = homeData.contactsSection?.title || loc.contactTitle
  const contactDesc = homeData.contactsSection?.description || loc.contactDesc

  // ─── Helper arrays for about-us alternating layout ───
  const aboutFallbacks = [
    loc.aboutPlaceholder,
    loc.aboutPlaceholder,
    loc.aboutPlaceholder,
  ]
  const aboutBgColors = ['bg-[#fbf6f3]', 'bg-[#f4ede7]', 'bg-[#fbf6f3]']
  const aboutLabels = ['About Us — 1', 'About Us — 2', 'About Us — 3']

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          1. HERO / FIRST SECTION
      ═══════════════════════════════════════════════════ */}
      <section id="main-block" className="pt-[10px]">
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
                href={`/${locale}${heroButtonLink}`}
                className="inline-block px-10 py-3 bg-[#3c5557] text-[#fafafa] rounded-[10px] text-lg tracking-[0.09em] font-normal transition-colors duration-300 hover:bg-[#34494a] no-underline"
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
                alt={heroTitle}
                className="w-full h-full object-cover block"
              />
            ) : (
              <ImagePlaceholder label="Hero Image" className="w-full h-full min-h-[400px]" />
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. ADVANTAGES
      ═══════════════════════════════════════════════════ */}
      <section id="filosofia" className="bg-white py-[100px]">
        <div className="px-[max(30px,calc((100vw-1200px)/2))] flex flex-wrap gap-[50px] justify-center max-[767px]:flex-col max-[767px]:items-center">
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
                  <p className="text-[15px] text-[#909da2] leading-relaxed">{adv.description}</p>
                </div>
              )
            })
          ) : (
            /* Placeholder advantages */
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

      {/* ═══════════════════════════════════════════════════
          3. ABOUT US (alternating image-text blocks)
      ═══════════════════════════════════════════════════ */}
      <section id="about_us" className="flex flex-col">
        {Array.from({ length: 3 }).map((_, i) => {
          const block = aboutBlocks[i]
          const text = block?.text || aboutFallbacks[i]
          const imgUrl = block ? mediaUrl(block.image) : null
          const isReversed = i % 2 === 1 // blocks 0,2 = photo-left, blocks 1 = photo-right

          return (
            <div
              key={i}
              className={`flex items-center h-[500px] max-[991px]:h-auto max-[991px]:flex-col ${
                isReversed ? 'flex-row' : 'flex-row'
              }`}
            >
              {/* Photo side */}
              <div
                className={`w-1/2 max-[991px]:w-full h-full flex max-[991px]:min-h-[300px] ${
                  isReversed ? 'order-2 max-[991px]:order-1' : 'order-1'
                }`}
              >
                {imgUrl ? (
                  <img src={imgUrl} alt={`About ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <ImagePlaceholder label={aboutLabels[i]} className="w-full h-full" />
                )}
              </div>
              {/* Text side */}
              <div
                className={`w-1/2 max-[991px]:w-full h-full flex flex-col justify-center gap-5 ${aboutBgColors[i]} ${
                  isReversed
                    ? 'order-1 max-[991px]:order-2 pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[991px]:px-[30px]'
                    : 'order-2 pr-[max(30px,calc((100vw-1200px)/2))] pl-[100px] max-[991px]:px-[30px]'
                } py-10`}
              >
                <p className="text-[16px] leading-relaxed text-[#22282b]">{text}</p>
              </div>
            </div>
          )
        })}
      </section>

      {/* ═══════════════════════════════════════════════════
          4. PHILOSOPHY
      ═══════════════════════════════════════════════════ */}
      <section id="filosofia-philosophy" className="py-[100px] flex flex-col items-center text-center px-[30px]">
        <div className="max-w-[800px]">
          <h2 className="text-[32px] font-semibold text-[#3c5557] mb-8">{philTitle}</h2>
          <p className="text-[18px] text-[#22282b] leading-relaxed mb-10">{philText}</p>
          <a
            href={`/${locale}${philLink}`}
            className="inline-block px-10 py-3 bg-[#3c5557] text-[#fafafa] rounded-[10px] text-lg tracking-[0.09em] font-normal transition-colors duration-300 hover:bg-[#34494a] no-underline"
          >
            {philButton}
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. OFFERS
      ═══════════════════════════════════════════════════ */}
      <section id="offers" className="flex flex-col">
        <div className="flex items-center h-[500px] max-[991px]:h-auto max-[991px]:flex-col">
          {/* Text */}
          <div className="w-1/2 max-[991px]:w-full h-full flex flex-col justify-center gap-5 bg-[#f4ede7] pl-[max(30px,calc((100vw-1200px)/2))] pr-[100px] max-[991px]:px-[30px] py-10">
            <p className="text-[16px] leading-relaxed text-[#22282b]">{offersText}</p>
          </div>
          {/* Image */}
          <div className="w-1/2 max-[991px]:w-full h-full flex max-[991px]:min-h-[300px]">
            {offersImageUrl ? (
              <img src={offersImageUrl} alt="Offers" className="w-full h-full object-cover" />
            ) : (
              <ImagePlaceholder label="Offers Image" className="w-full h-full" />
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. TEAM
      ═══════════════════════════════════════════════════ */}
      <section id="team" className="my-[100px]">
        <h2 className="text-[32px] font-semibold text-center mb-[50px]">{teamTitle}</h2>
        <div className="max-w-[1200px] mx-auto relative px-[30px] max-[1230px]:px-[30px]">
          {team.length > 0 ? (
            <TeamSlider members={team} />
          ) : (
            /* Placeholder team cards */
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

      {/* ═══════════════════════════════════════════════════
          7. REVIEWS
      ═══════════════════════════════════════════════════ */}
      <section id="reviews" className="py-[120px] relative">
        <div className="max-w-[1200px] mx-auto px-[30px] flex flex-col gap-5">
          <h2 className="text-[32px] font-semibold text-center mb-6">{reviewsTitle}</h2>
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

      {/* ═══════════════════════════════════════════════════
          8. GALLERY
      ═══════════════════════════════════════════════════ */}
      <section id="gallery" className="flex max-[991px]:flex-col bg-[#fbf6f3]">
        {/* Left: Info */}
        <div className="w-1/2 max-[991px]:w-full flex flex-col justify-center px-[30px] py-10 max-[991px]:py-6">
          <h2 className="text-[32px] font-semibold text-left mb-[30px]">{galleryTitle}</h2>
          <p className="text-[16px] text-[#909da2] leading-relaxed">{galleryDesc}</p>
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

      {/* ═══════════════════════════════════════════════════
          9. WHY US
      ═══════════════════════════════════════════════════ */}
      <section id="whyus" className="py-[100px] flex flex-col items-center text-center px-[30px]">
        <div className="max-w-[800px]">
          <h2 className="text-[32px] font-semibold text-[#3c5557] mb-8">{whyUsTitle}</h2>
          <p className="text-[18px] text-[#22282b] leading-relaxed">{whyUsText}</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          10. CONTACTS
      ═══════════════════════════════════════════════════ */}
      <section id="contact_us" className="bg-[#fbf6f3] py-[100px]">
        <div className="max-w-[1200px] mx-auto px-[30px] flex gap-[100px] max-[991px]:flex-col max-[991px]:gap-10 items-start">
          <div className="w-1/2 max-[991px]:w-full flex flex-col">
            <h2 className="text-[32px] font-semibold text-left mb-10">{contactTitle}</h2>
            <p className="text-[14px] text-[#909da2] leading-relaxed">{contactDesc}</p>
          </div>
          <div className="w-1/2 max-[991px]:w-full bg-[#efefef] rounded-[10px] p-10 flex flex-col gap-5 text-center text-[#909da2]">
            <p className="text-[16px]">
              {locale === 'uk'
                ? 'Форма зворотного зв\'язку буде додана тут.'
                : locale === 'en'
                ? 'Contact form will be added here.'
                : 'El formulario de contacto se agregará aquí.'}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}