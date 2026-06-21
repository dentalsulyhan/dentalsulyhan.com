'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { HeaderFooter } from '@/payload-types'

interface HeaderProps {
  data: NonNullable<HeaderFooter['header']> & {
    menuItems?: HeaderFooter['menuItems']
  }
  currentLocale: string
}

export default function Header({ data, currentLocale }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const locales = ['es', 'en', 'uk']
  const langNames: Record<string, string> = { es: 'ESP', en: 'ENG', uk: 'УКР' }

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split('/')
    // Index 1 is always the locale since we're in [locale] dynamic route group
    segments[1] = newLocale
    return segments.join('/')
  }

  // Scroll listener to toggle header background styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    // Run once initially
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('_lock')
    } else {
      document.body.classList.remove('_lock')
    }
    return () => {
      document.body.classList.remove('_lock')
    }
  }, [isMenuOpen])

  // Get active logo URL and alt text
  const logoUrl =
    data?.logo && typeof data.logo === 'object' && data.logo.url
      ? data.logo.url
      : '/logo-sulyhan.svg'
  const logoAlt =
    data?.logo && typeof data.logo === 'object' && data.logo.alt
      ? data.logo.alt
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

  const contacts = data?.contacts || {}
  const phone = contacts.phone || '+34 665-399-280'
  const whatsapp = contacts.whatsapp || 'https://wa.me/+34665399280'
  const telegram = contacts.telegram || 'https://t.me/+34665399280'

  return (
    <header className={`header ${isScrolled ? 'header--fixed' : ''}`}>
      <div className="header__container">
        
        {/* LEFT: Hamburger Menu trigger and Sidebar Drawer */}
        <div className="header__menu menu">
          <button 
            className="menu__icon" 
            onClick={() => setIsMenuOpen(true)}
          >
            {data?.menuButtonLabel || (currentLocale === 'uk' ? 'Меню' : currentLocale === 'es' ? 'Menú' : 'Menu')}
          </button>

          {/* Mobile slide-out drawer (menuBody) */}
          <div className={`menu__body ${isMenuOpen ? '_active' : ''}`}>
            <div className="menu_header">
              <button 
                className="menu__close-button"
                onClick={() => setIsMenuOpen(false)}
              >
                <img src="/icons/Close.svg" alt="Close" />
              </button>
            </div>
            <div className="menu_lists">
              <nav>
                <h2 className="menu__title">Menu</h2>
                <ul className="menu__list">
                  {menuItems.map((item, i) => {
                    const isAnchor = item.link?.startsWith('#')
                    const linkHref = isAnchor ? item.link : `/${currentLocale}${item.link}`
                    return (
                      <li key={i}>
                        <Link 
                          href={linkHref} 
                          className="menu__link"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>

            {/* Mobile language switcher inside drawer */}
            <div className="drop-block lang switcher header-language header-language-mobi">
              <ul className="switcher_list language-list" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                {locales.map((loc) => (
                  <Link 
                    key={loc} 
                    href={switchLanguage(loc)} 
                    className={`drop-block__link language-item switcher-item link-switcher-item ${currentLocale === loc ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ fontSize: '14px', fontWeight: 'bold' }}
                  >
                    {langNames[loc]}
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CENTER: Logo */}
        <Link href={`/${currentLocale}`} className="custom-logo-link">
          <img src={logoUrl} alt={logoAlt} className="custom-logo" />
        </Link>

        {/* RIGHT: Phones, Socials, and PC Language Switcher */}
        <div className="switchers">
          <div className="header-phones">
            <li className="switcher-item header-telegram">
              <a href={telegram} target="_blank" rel="noopener noreferrer">
                <img src="/icons/telegram.svg" alt="Telegram" />
              </a>
            </li>
            <li className="switcher-item header-whatsapp">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <img src="/icons/whatsapp.svg" alt="WhatsApp" />
              </a>
            </li>
            <li className="switcher-item header-phone">
              <a href={`tel:${phone.replace(/\s+/g, '')}`}>
                <img src="/icons/phone.svg" alt="Phone" />
                <span>{phone}</span>
              </a>
            </li>
          </div>

          {/* PC Language Switcher */}
          <div className="header-language-pc">
            <ul className="language-list" style={{ display: 'flex', gap: '15px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
              {locales.map((loc) => {
                const isActive = currentLocale === loc
                return (
                  <li key={loc}>
                    <Link 
                      href={switchLanguage(loc)} 
                      className={`language-item link-switcher-item ${isActive ? 'active' : ''}`}
                    >
                      {langNames[loc]}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

      </div>
    </header>
  )
}