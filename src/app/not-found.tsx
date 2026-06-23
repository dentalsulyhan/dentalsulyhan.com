import './(frontend)/[locale]/null.css'
import './(frontend)/[locale]/style.css'
import './(frontend)/[locale]/adaptive.css'
import './(frontend)/[locale]/globals.css'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FrontendNotFound from '@/components/FrontendNotFound'
import { getNotFoundPageBlock } from '@/lib/not-found-page'
import type { HeaderFooter, SiteContact, SiteSetting } from '@/payload-types'

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
  const payload = await getPayload({ config: configPromise })

  let siteSettings: SiteSetting | null = null
  let headerFooter: HeaderFooter | null = null
  let siteContacts: SiteContact | null = null

  try {
    siteSettings = (await payload.findGlobal({ slug: 'site-settings', locale })) as SiteSetting
  } catch (error) {
    console.error('Error fetching site-settings global for 404:', error)
  }

  try {
    headerFooter = (await payload.findGlobal({ slug: 'header-footer', locale })) as HeaderFooter
  } catch (error) {
    console.error('Error fetching header-footer global for 404:', error)
  }

  try {
    siteContacts = (await payload.findGlobal({ slug: 'site-contacts', locale })) as SiteContact
  } catch (error) {
    console.error('Error fetching site-contacts global for 404:', error)
  }

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

  const { contentImageBlock } = await getNotFoundPageBlock(locale)

  return (
    <>
      <Header data={headerData} contacts={contactsData} currentLocale={locale} />

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
      />
    </>
  )
}
