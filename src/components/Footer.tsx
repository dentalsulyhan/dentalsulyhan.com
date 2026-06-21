'use client'

import Link from 'next/link'
import type { HeaderFooter, Media } from '@/payload-types'

interface FooterProps {
  data: NonNullable<HeaderFooter['footer']> & {
    menuItems?: HeaderFooter['menuItems']
  }
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
    <footer className="bg-[#f4ede7] flex flex-col w-full">
      <div className="w-full py-[40px] px-0 max-[991px]:py-[20px] max-[991px]:px-[30px] border-t border-[#3c5557]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center max-[1230px]:mx-[30px] max-[1230px]:w-auto max-[991px]:flex-col max-[991px]:gap-[30px]">
          <Link href={`/${currentLocale}`} className="h-[50px] w-auto flex items-center justify-center">
            <img src={logoUrl} alt={logoAlt} className="h-[50px] w-auto object-contain" />
          </Link>
          <nav>
            <ul className="flex flex-wrap gap-[20px] m-[10px] justify-end max-[991px]:justify-center max-[991px]:flex-col max-[991px]:gap-[10px] max-[991px]:text-center list-none p-0">
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