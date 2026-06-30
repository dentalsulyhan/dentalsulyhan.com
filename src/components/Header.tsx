'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { HeaderFooter, SiteContact } from '@/payload-types'
import { buildLocalizedPath, stripLocalePrefix } from '@/lib/localizedRouting'

type ContactData = Partial<SiteContact> & {
  socialLinks?: SiteContact['socialLinks']
}

type BrandingData = {
  logo?: number | { url?: string | null; alt?: string | null } | null
  logoDark?: number | { url?: string | null; alt?: string | null } | null
  logoLight?: number | { url?: string | null; alt?: string | null } | null
}

interface HeaderProps {
  data: NonNullable<HeaderFooter['header']> & {
    menuItems?: HeaderFooter['menuItems']
  }
  contacts: ContactData
  currentLocale: string
  servicesPath?: string
  branding?: BrandingData
}

export default function Header({ data, contacts, currentLocale, servicesPath = '/services', branding }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [localeLinks, setLocaleLinks] = useState<Record<string, string> | null>(null)
  const pathname = usePathname()

  const locales = ['es', 'en', 'uk']
  const langNames: Record<string, string> = { es: 'ESP', en: 'ENG', uk: 'УКР' }
  const localizedServicesPath = buildLocalizedPath(currentLocale, servicesPath)

  const resolveMenuLink = (link?: string | null) => {
    if (!link) return '#'
    if (link === '/services') return localizedServicesPath
    if (link.startsWith('#')) return link
    return buildLocalizedPath(currentLocale, link)
  }

  const switchLanguage = (newLocale: string) => {
    if (localeLinks?.[newLocale]) {
      return localeLinks[newLocale]
    }

    return buildLocalizedPath(newLocale, stripLocalePrefix(pathname))
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

  useEffect(() => {
    let cancelled = false

    const loadLocaleLinks = async () => {
      try {
        const response = await fetch(`/api/locale-links?path=${encodeURIComponent(pathname)}`)
        if (!response.ok) return

        const data = (await response.json()) as { links?: Record<string, string> }
        if (!cancelled && data.links) {
          setLocaleLinks(data.links)
        }
      } catch {
        if (!cancelled) {
          setLocaleLinks(null)
        }
      }
    }

    void loadLocaleLinks()

    return () => {
      cancelled = true
    }
  }, [pathname])

  // Get active logo URL and alt text
  const headerLogo = branding?.logoDark || branding?.logo || data?.logo
  const logoUrl =
    headerLogo && typeof headerLogo === 'object' && headerLogo.url
      ? headerLogo.url
      : '/logo-sulyhan.svg'
  const logoAlt =
    headerLogo && typeof headerLogo === 'object' && headerLogo.alt
      ? headerLogo.alt
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

  const phone = contacts?.phone || '+34 665-399-280'
  const whatsapp = contacts?.whatsapp || 'https://wa.me/+34665399280'
  const telegram = contacts?.telegram || 'https://t.me/+34665399280'

  return (
    <header
      style={{ fontFamily: 'var(--main-font)' }}
      className={`fixed top-0 left-0 w-full z-[1000] border-b transition-all duration-500 ${
        isScrolled
          ? 'bg-[#fafafa]/95 shadow-[0_4px_20px_rgba(34,40,43,0.05)] border-[#22282b]/[0.08]'
          : 'bg-transparent border-transparent shadow-none'
      }`}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center py-3 max-[1230px]:mx-[24px] max-[1230px]:w-auto max-[1100px]:mx-[18px] max-[767px]:py-[10px] max-[767px]:mx-[16px]">
        
        {/* LEFT: Hamburger Menu trigger and Sidebar Drawer */}
        <div className="flex">
          <button
            className="uppercase font-normal cursor-pointer bg-transparent border-none text-[#22282b] hover:opacity-80 transition-opacity"
            onClick={() => setIsMenuOpen(true)}
          >
            {data?.menuButtonLabel || (currentLocale === 'uk' ? 'Меню' : currentLocale === 'es' ? 'Menú' : 'Menu')}
          </button>

          {/* Mobile slide-out drawer (menuBody) */}
          <div
            className={`fixed top-0 left-0 h-full w-[425px] max-w-full bg-white/90 backdrop-blur-md transition-all duration-300 ease-in-out p-[42px] flex flex-col z-[1010] overflow-y-auto shadow-2xl max-[767px]:w-full max-[767px]:p-[32px_20px] ${
              isMenuOpen ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible'
            }`}
          >
            <div className="w-full flex justify-between">
              <button
                className="flex items-center gap-[5px] text-[#22282b] bg-transparent border-none text-[16px] cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => setIsMenuOpen(false)}
              >
                <img src="/icons/Close.svg" alt="Close" />
              </button>
            </div>
            <div className="flex mt-[36px] gap-[72px] justify-between max-[767px]:mt-[28px] max-[767px]:justify-center max-[767px]:flex-wrap">
              <nav className="flex-[25%]">
                <h2 className="text-[14px] text-left text-[#909da2] uppercase font-medium mb-4">
                  {data?.menuButtonLabel || (currentLocale === 'uk' ? 'Меню' : currentLocale === 'es' ? 'Menú' : 'Menu')}
                </h2>
                <ul className="list-none p-0 m-0 flex flex-col items-start gap-[8px]">
                  {menuItems.map((item, i) => {
                    const linkHref = resolveMenuLink(item.link)
                    return (
                      <li key={i} className="my-[2px] mx-0">
                        <Link
                          href={linkHref}
                          className="text-[17px] no-underline text-[#22282b] opacity-60 hover:opacity-100 hover:text-[18px] transition-all duration-200"
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
            <div className="mt-auto pt-6 border-t border-[#22282b]/10 flex gap-5 max-[767px]:block">
              <ul className="flex flex-row gap-5 list-none p-0 m-0">
                {locales.map((loc) => (
                  <li key={loc} className="flex items-center">
                    <Link
                      href={switchLanguage(loc)}
                      style={{ fontFamily: 'var(--second-font)' }}
                      className={`inline-flex items-center h-[20px] leading-none text-[14px] font-medium uppercase tracking-[0.08em] transition-all duration-200 ${
                        currentLocale === loc ? 'text-[#22282b] opacity-100' : 'text-[#909da2] opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {langNames[loc]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CENTER: Logo */}
        <Link href={buildLocalizedPath(currentLocale, '/')} className="h-[44px] w-auto flex items-center justify-center max-[767px]:h-[38px]">
          <img src={logoUrl} alt={logoAlt} className="h-[44px] w-auto object-contain max-[767px]:h-[38px]" />
        </Link>

        {/* RIGHT: Phones, Socials, and PC Language Switcher */}
        <div className="flex items-center justify-end gap-[16px] max-[1100px]:gap-[12px] max-[767px]:gap-[12px]">
          {/* Social Icons */}
          <div className="flex items-center gap-[12px] max-[1100px]:gap-[10px] max-[767px]:gap-[10px]">
            <a
              href={telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform max-[991px]:hidden flex items-center"
            >
              <img src="/icons/telegram.svg" alt="Telegram" className="h-[15px] max-[991px]:h-[18px] w-auto opacity-85 hover:opacity-100 transition-opacity" />
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform flex items-center"
            >
              <img src="/icons/whatsapp.svg" alt="WhatsApp" className="h-[15px] max-[991px]:h-[18px] w-auto opacity-85 hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Phone */}
          <div className="flex items-center border-[#22282b]/15 min-[992px]:border-l min-[992px]:pl-[12px] h-[20px]">
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-[6px] text-decoration-none text-[#22282b]">
              <img src="/icons/phone.svg" alt="Phone" className="h-[15px] max-[991px]:h-[18px] w-auto opacity-85 hover:opacity-100 transition-opacity" />
              <span
                style={{ fontFamily: 'var(--second-font)' }}
                className="text-[14px] max-[1100px]:hidden font-medium tracking-[0.03em] text-[#22282b] hover:opacity-80 transition-opacity"
              >
                {phone}
              </span>
            </a>
          </div>

          {/* PC Language Switcher */}
          <div className="max-[991px]:hidden flex items-center border-l border-[#22282b]/15 pl-[12px] h-[20px]">
            <ul className="flex gap-[10px] list-none m-0 p-0 items-center">
              {locales.map((loc) => {
                const isActive = currentLocale === loc
                return (
                  <li key={loc} className="flex items-center">
                    <Link
                      href={switchLanguage(loc)}
                      style={{ fontFamily: 'var(--second-font)' }}
                      className={`inline-flex items-center h-[20px] leading-none text-[12px] font-medium uppercase tracking-[0.08em] transition-all duration-200 ${
                        isActive ? 'text-[#22282b] opacity-100' : 'text-[#909da2] opacity-70 hover:text-[#22282b] hover:opacity-100'
                      }`}
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
