'use client'

import Link from 'next/link'
import type { HeaderFooter, Media, SiteContact } from '@/payload-types'

type ContactData = Partial<SiteContact> & {
  socialLinks?: SiteContact['socialLinks']
}

interface FooterProps {
  data: NonNullable<HeaderFooter['footer']> & {
    menuItems?: HeaderFooter['menuItems']
  }
  contacts: ContactData
  headerLogo?: number | Media | null
  currentLocale: string
}

export default function Footer({ data, contacts, headerLogo, currentLocale }: FooterProps) {
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
    <footer className="bg-[#f4ede7] flex flex-col w-full">
      <div className="w-full py-[40px] px-0 max-[991px]:py-[20px] max-[991px]:px-[30px] border-t border-[#3c5557]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-[24px] max-[1230px]:mx-[30px] max-[1230px]:w-auto max-[1100px]:mx-[20px] max-[1100px]:gap-[18px] max-[991px]:flex-col max-[991px]:gap-[30px]">
          <Link href={`/${currentLocale}`} className="h-[50px] w-auto flex items-center justify-center">
            <img src={logoUrl} alt={logoAlt} className="h-[50px] w-auto object-contain" />
          </Link>
          <nav>
            <ul className="flex flex-wrap gap-[20px] max-[1100px]:gap-[14px] m-[10px] justify-end max-[991px]:justify-center max-[991px]:flex-col max-[991px]:gap-[10px] max-[991px]:text-center list-none p-0">
              {menuItems.map((item, i) => {
                const isAnchor = item.link?.startsWith('#')
                const linkHref = isAnchor ? item.link : `/${currentLocale}${item.link}`
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
              {contacts.socialLinks.map((link, i) => {
                const iconMap: Record<string, string> = {
                  instagram: '/icons/instagram.svg',
                  facebook: '/icons/facebook.svg',
                  twitter: '/icons/twitter.svg',
                }
                const iconSrc = iconMap[link.platform]

                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200 flex items-center"
                    title={link.platform}
                  >
                    {iconSrc ? (
                      <img
                        src={iconSrc}
                        alt={link.platform}
                        className="h-[20px] w-auto opacity-75 hover:opacity-100 transition-opacity duration-200"
                      />
                    ) : link.platform === 'youtube' ? (
                      <svg
                        className="h-[20px] w-auto fill-[#22282b]/75 hover:fill-[#22282b] transition-colors duration-200"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                      >
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555a3.003 3.003 0 0 0-2.11 2.108C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    ) : link.platform === 'tiktok' ? (
                      <svg
                        className="h-[20px] w-auto fill-[#22282b]/75 hover:fill-[#22282b] transition-colors duration-200"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.58 4.22.95 1.1 2.27 1.83 3.73 2.05v3.83c-1.39-.03-2.74-.51-3.87-1.37a8.09 8.09 0 0 1-2.22-2.58v9.42c.04 1.48-.3 2.96-1.01 4.26-.71 1.29-1.78 2.37-3.08 3.08a8.312 8.312 0 0 1-8.52 0A8.09 8.09 0 0 1 .74 19.86a8.21 8.21 0 0 1 0-8.52c.71-1.29 1.78-2.37 3.08-3.08a8.32 8.32 0 0 1 7.21-.49c.03.65.01 1.31.02 1.97-.68-.2-1.4-.23-2.1-.08a4.11 4.11 0 0 0-3.13 3.13c-.22.94-.12 1.93.28 2.8.39.87 1.09 1.58 1.96 1.97a4.17 4.17 0 0 0 4.14 0 4.2 4.2 0 0 0 1.97-1.97 4.131 4.131 0 0 0-.01-4.14V.02z" />
                      </svg>
                    ) : (
                      <span className="text-[14px] uppercase font-medium text-[#22282b]/75 hover:text-[#22282b] transition-colors duration-200">
                        {link.platform}
                      </span>
                    )}
                  </a>
                )
              })}
            </div>
          )}
          <p className="text-[#909da2] text-[14px] text-center w-full hidden max-[991px]:block">
            {data.copyright || `©2024-${currentYear} All right reserved`}
          </p>
        </div>
      </div>
      <div className="w-full py-[40px] px-0 max-[991px]:py-[20px] max-[991px]:px-[30px] border-t border-[#3c5557] flex justify-center max-[991px]:hidden">
        <div className="max-w-[1200px] mx-auto flex justify-center items-center max-[1230px]:mx-[30px] max-[1230px]:w-auto">
          <p className="text-[#909da2] text-[14px] text-center w-full max-[991px]:hidden">
            {data.copyright || `©2024-${currentYear} All right reserved`}
          </p>
        </div>
      </div>
    </footer>
  )
}
