import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrackingScripts from '@/components/TrackingScripts'
import AnalyticsListener from '@/components/AnalyticsListener'
import type { HeaderFooter, Page, SiteContact, SiteSetting } from '@/payload-types'
import { getDesignSettingsVars } from '@/lib/designSettings'
import { isSupportedLocale } from '@/lib/localizedRouting'
import { notFound } from 'next/navigation'

type BrandingData = {
  favicon?: number | { url?: string | null; alt?: string | null } | null
  logo?: number | { url?: string | null; alt?: string | null } | null
  logoLight?: number | { url?: string | null; alt?: string | null } | null
  logoDark?: number | { url?: string | null; alt?: string | null } | null
}

type TrackingData = {
  googleTagManagerId?: string | null
  ga4MeasurementId?: string | null
  metaPixelId?: string | null
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isSupportedLocale(locale)) {
    notFound()
  }

  const payload = await getPayload({ config: configPromise })

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

  let headerFooter: HeaderFooter | null = null
  try {
    const fetchedHeaderFooter = await payload.findGlobal({
      slug: 'header-footer',
      locale: locale as 'es' | 'en' | 'uk',
    })
    if (fetchedHeaderFooter) {
      headerFooter = fetchedHeaderFooter as HeaderFooter
    }
  } catch (err) {
    console.error('Error fetching header-footer global:', err)
  }

  let siteContacts: SiteContact | null = null
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

  let designSettings: Record<string, unknown> | null = null
  try {
    designSettings = (await payload.findGlobal({
      slug: 'design-settings',
      locale: locale as 'es' | 'en' | 'uk',
    })) as unknown as Record<string, unknown>
  } catch (err) {
    console.error('Error fetching design-settings global:', err)
  }

  const sharedMenuItems = siteSettings?.menuItems?.length
    ? siteSettings.menuItems
    : (headerFooter?.menuItems || [])

  let servicesPage: Page | null = null
  try {
    const servicesPageResult = await payload.find({
      collection: 'pages',
      locale: locale as 'es' | 'en' | 'uk',
      fallbackLocale: false,
      where: {
        slug: {
          equals: 'services',
        },
      },
      limit: 1,
    })
    servicesPage = (servicesPageResult.docs[0] as Page | undefined) || null
  } catch (err) {
    console.error('Error fetching services page path:', err)
  }

  const servicesPath = `/${servicesPage?.path || 'services'}`
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
  const tracking = (siteSettings as SiteSetting & { tracking?: TrackingData } | null)?.tracking

  return (
    <div style={getDesignSettingsVars(designSettings)}>
      <TrackingScripts tracking={tracking} />
      <AnalyticsListener locale={locale} />
      <Header data={headerData} contacts={contactsData} currentLocale={locale} servicesPath={servicesPath} branding={branding} />

      <main className="flex-grow pt-[70px]">
        {children}
      </main>

      <Footer 
        data={footerData} 
        contacts={contactsData}
        headerLogo={headerData.logo} 
        currentLocale={locale} 
        servicesPath={servicesPath}
        branding={branding}
      />
    </div>
  )
}
