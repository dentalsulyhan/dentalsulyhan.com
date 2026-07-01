import './frontend.css'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FrontendNotFound from '@/components/FrontendNotFound'
import { getNotFoundPageBlock } from '@/lib/not-found-page'
import { getDesignSettingsVars } from '@/lib/designSettings'
import type { HeaderFooter, SiteContact, SiteSetting } from '@/payload-types'
import {
  getCachedDesignSettings,
  getCachedHeaderFooter,
  getCachedSiteContacts,
  getCachedSiteSettings,
} from '@/lib/publicData'

export const revalidate = 300

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

type BrandingData = {
  favicon?: number | { url?: string | null; alt?: string | null } | null
  logo?: number | { url?: string | null; alt?: string | null } | null
  logoLight?: number | { url?: string | null; alt?: string | null } | null
  logoDark?: number | { url?: string | null; alt?: string | null } | null
}

async function detectLocaleFromHeaders() {
  const requestHeaders = await headers()
  const explicitLocale = requestHeaders.get('x-sulyhan-locale')
  if (explicitLocale === 'es' || explicitLocale === 'en' || explicitLocale === 'uk') {
    return explicitLocale
  }

  const directHints = [
    requestHeaders.get('x-next-url'),
    requestHeaders.get('next-url'),
    requestHeaders.get('referer'),
    requestHeaders.get('x-matched-path'),
  ].filter(Boolean) as string[]

  for (const hint of directHints) {
    const match = hint.match(/\/(es|en|uk)(?:\/|$)/)
    if (match) return match[1] as 'es' | 'en' | 'uk'
  }

  const acceptLanguage = requestHeaders.get('accept-language') || ''
  const lower = acceptLanguage.toLowerCase()
  if (lower.includes('uk')) return 'uk' as const
  if (lower.includes('en')) return 'en' as const
  return 'es' as const
}

export default async function NotFound() {
  const locale = await detectLocaleFromHeaders()
  const [siteSettings, headerFooter, siteContacts, designSettings] = await Promise.all([
    getCachedSiteSettings(locale).catch((error) => {
      console.error('Error fetching site-settings global for 404:', error)
      return null as SiteSetting | null
    }),
    getCachedHeaderFooter(locale).catch((error) => {
      console.error('Error fetching header-footer global for 404:', error)
      return null as HeaderFooter | null
    }),
    getCachedSiteContacts(locale).catch((error) => {
      console.error('Error fetching site-contacts global for 404:', error)
      return null as SiteContact | null
    }),
    getCachedDesignSettings(locale).catch((error) => {
      console.error('Error fetching design-settings global for 404:', error)
      return null as Record<string, unknown> | null
    }),
  ])

  const sharedMenuItems = siteSettings?.menuItems?.length
    ? siteSettings.menuItems
    : (headerFooter?.menuItems || [])
  const headerData = {
    ...(headerFooter?.header || {}),
    ...(siteSettings?.header || {}),
    menuItems: sharedMenuItems,
  }
  const footerData = {
    ...(headerFooter?.footer || {}),
    ...(siteSettings?.footer || {}),
    menuItems: sharedMenuItems,
  }
  const contactsData = {
    ...(siteContacts || {}),
    ...(siteSettings?.contacts || {}),
    socialLinks: siteSettings?.socialLinks || siteContacts?.socialLinks || [],
  }
  const branding = (siteSettings as SiteSetting & { branding?: BrandingData } | null)?.branding

  const { contentImageBlock } = await getNotFoundPageBlock(locale)

  return (
    <div style={getDesignSettingsVars(designSettings)}>
      <Header data={headerData} contacts={contactsData} currentLocale={locale} branding={branding} />

      {contentImageBlock ? (
        <FrontendNotFound
          locale={locale}
          splitContent={{
            title: contentImageBlock.title || null,
            content: contentImageBlock.text,
            image: contentImageBlock.image,
            position: contentImageBlock.position,
            imageWidth: contentImageBlock.imageWidth,
            buttonText: contentImageBlock.buttonText,
            buttonLink: contentImageBlock.buttonLink,
          }}
        />
      ) : (
        <FrontendNotFound locale={locale} />
      )}

      <Footer
        data={footerData}
        contacts={contactsData}
        headerLogo={headerData.logo}
        currentLocale={locale}
        branding={branding}
      />
    </div>
  )
}
