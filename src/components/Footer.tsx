'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { HeaderFooter, Media, SiteContact } from '@/payload-types'
import { buildLocalizedPath } from '@/lib/localizedRouting'
import SocialIcon from './SocialIcon'

type ContactData = Partial<SiteContact> & {
  socialLinks?: SiteContact['socialLinks']
}

type BrandingData = {
  logo?: number | { url?: string | null; alt?: string | null } | null
  logoDark?: number | { url?: string | null; alt?: string | null } | null
  logoLight?: number | { url?: string | null; alt?: string | null } | null
}

interface FooterProps {
  data: NonNullable<HeaderFooter['footer']> & {
    menuItems?: HeaderFooter['menuItems']
  }
  contacts: ContactData
  headerLogo?: number | Media | null
  currentLocale: string
  servicesPath?: string
  branding?: BrandingData
}

export default function Footer({ data, contacts, headerLogo, currentLocale, servicesPath = '/services', branding }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const copyrightText = (data.copyright || `©${currentYear} - All right reserved`).replace(
    /\b(?:19|20)\d{2}(?:\s*[-–]\s*(?:19|20)\d{2})?\b/,
    String(currentYear),
  )
  const localizedServicesPath = buildLocalizedPath(currentLocale, servicesPath)

  const resolveMenuLink = (link?: string | null) => {
    if (!link) return '#'
    if (link === '/services') return localizedServicesPath
    if (link.startsWith('#')) return link
    return buildLocalizedPath(currentLocale, link)
  }

  // Get active logo URL and alt text
  const activeLogo = branding?.logoDark || branding?.logo || branding?.logoLight || data.logo || headerLogo
  const logoUrl =
    activeLogo && typeof activeLogo === 'object' && activeLogo.url
      ? activeLogo.url
      : '/logo-sulyhan.svg'
  const logoAlt =
    activeLogo && typeof activeLogo === 'object' && activeLogo.alt
      ? activeLogo.alt
      : 'Sulyhan'

  // Define localized menu items based on your exact layout translations
  const fallbackMenus: Record<string, Array<{ label: string; link: string }>> = {
    es: [
      { label: 'Conócenos', link: '/#about_us' },
      { label: 'Tratamientos', link: localizedServicesPath },
      { label: 'Filosofía y valores', link: '/#filosofia' },
      { label: 'Promociones', link: '/#offers' },
      { label: 'Equipo', link: '/#team' },
      { label: 'Blog', link: '/#blog' },
      { label: 'Testimonios', link: '/#reviews' },
      { label: 'Galería de Fotos', link: '/#gallery' },
      { label: 'Contacto', link: '/#contact_us' }
    ],
    en: [
      { label: 'About Us', link: '/#about_us' },
      { label: 'Services', link: localizedServicesPath },
      { label: 'Philosophy and values', link: '/#filosofia' },
      { label: 'Offers', link: '/#offers' },
      { label: 'Team', link: '/#team' },
      { label: 'Blog', link: '/#blog' },
      { label: 'Reviews', link: '/#reviews' },
      { label: 'Photo Gallery', link: '/#gallery' },
      { label: 'Contact', link: '/#contact_us' }
    ],
    uk: [
      { label: 'Про нас', link: '/#about_us' },
      { label: 'Послуги', link: localizedServicesPath },
      { label: 'Філософія та цінності', link: '/#filosofia' },
      { label: 'Пропозиції', link: '/#offers' },
      { label: 'Команда', link: '/#team' },
      { label: 'Блог', link: '/#blog' },
      { label: 'Відгуки', link: '/#reviews' },
      { label: 'Фотогалерея', link: '/#gallery' },
      { label: 'Контакти', link: '/#contact_us' }
    ]
  }

  // Use database menu items if populated, otherwise use localized defaults
  const menuItems = data?.menuItems && data.menuItems.length > 0
    ? data.menuItems
    : (fallbackMenus[currentLocale] || fallbackMenus.es)

  return (
    <footer className="flex flex-col w-full" style={{ backgroundColor: 'var(--footer-bg-color)' }}>
      <div className="w-full py-[40px] px-0 max-[991px]:py-[20px] max-[991px]:px-[30px] border-t border-[#3c5557]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-[24px] max-[1230px]:mx-[30px] max-[1230px]:w-auto max-[1100px]:mx-[20px] max-[1100px]:gap-[18px] max-[991px]:flex-col max-[991px]:gap-[30px]">
          <Link href={buildLocalizedPath(currentLocale, '/')} className="h-[50px] w-auto flex items-center justify-center">
            <Image src={logoUrl} alt={logoAlt} width={200} height={50} className="h-[50px] w-auto object-contain" />
          </Link>
          <nav>
            <ul className="site-menu-list flex flex-wrap gap-[20px] max-[1100px]:gap-[14px] m-[10px] justify-end max-[991px]:justify-center max-[991px]:flex-col max-[991px]:gap-[10px] max-[991px]:text-center list-none p-0">
              {menuItems.map((item, i) => {
                const linkHref = resolveMenuLink(item.link)
                return (
                  <li key={i}>
                    <Link href={linkHref} className="text-[15px] no-underline text-[#22282b] hover:opacity-80 transition-opacity">
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Social Links */}
          {contacts?.socialLinks && contacts.socialLinks.length > 0 && (
            <div className="flex items-center gap-[16px] max-[991px]:justify-center">
              {contacts.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="hover:scale-110 transition-transform duration-200 flex items-center"
                  title={link.platform}
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          )}
          <p
            style={{ fontFamily: 'var(--second-font)' }}
            className="text-[#909da2] text-[14px] text-center w-full hidden max-[991px]:block"
          >
            {copyrightText}
          </p>
        </div>
      </div>
      <div className="w-full py-[40px] px-0 max-[991px]:py-[20px] max-[991px]:px-[30px] border-t border-[#3c5557] flex justify-center max-[991px]:hidden">
        <div className="max-w-[1200px] mx-auto flex justify-center items-center max-[1230px]:mx-[30px] max-[1230px]:w-auto">
          <p
            style={{ fontFamily: 'var(--second-font)' }}
            className="text-[#909da2] text-[14px] text-center w-full max-[991px]:hidden"
          >
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  )
}
