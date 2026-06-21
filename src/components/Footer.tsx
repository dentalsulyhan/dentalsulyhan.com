'use client'

import Link from 'next/link'
import type { HeaderFooter, Media } from '@/payload-types'

interface FooterProps {
  data: NonNullable<HeaderFooter['footer']>
  headerLogo?: number | Media | null
  currentLocale: string
}

export default function Footer({ data, headerLogo, currentLocale }: FooterProps) {
  const currentYear = new Date().getFullYear()

  // Get active logo URL and alt text
  const activeLogo = data.logo || headerLogo
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
      { label: 'Tratamientos', link: '/services' },
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
      { label: 'Services', link: '/services' },
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
      { label: 'Послуги', link: '/services' },
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
    <footer className="footer">
      <div className="footer_menu">
        <div className="footer__container">
          <Link href={`/${currentLocale}`} className="custom-logo-link">
            <img src={logoUrl} alt={logoAlt} className="custom-logo" />
          </Link>
          <nav>
            <ul className="footer-menu__list">
              {menuItems.map((item, i) => {
                const isAnchor = item.link?.startsWith('#')
                const linkHref = isAnchor ? item.link : `/${currentLocale}${item.link}`
                return (
                  <li key={i}>
                    <Link href={linkHref} className="footer-menu__link">
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <p className="copyright">
            &copy;2024-{currentYear} All right reserved
          </p>
        </div>
      </div>
      <div className="footer_section">
        <div className="footer__container">
          <p className="copyright">
            &copy;2024-{currentYear} All right reserved
          </p>
        </div>
      </div>
    </footer>
  )
}