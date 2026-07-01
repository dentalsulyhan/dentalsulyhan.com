import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrackingScripts from '@/components/TrackingScripts'
import AnalyticsListener from '@/components/AnalyticsListener'
import type { HeaderFooter, Page, SeoSetting, SiteContact, SiteSetting } from '@/payload-types'
import { getDesignSettingsVars } from '@/lib/designSettings'
import { isSupportedLocale } from '@/lib/localizedRouting'
import { notFound } from 'next/navigation'
import { buildOrganizationStructuredData, buildWebsiteStructuredData } from '@/lib/structuredData'
import { getConfiguredSiteUrl } from '@/lib/seo'
import {
  getCachedDesignSettings,
  getCachedHeaderFooter,
  getCachedSeoSettings,
  getCachedServicesPage,
  getCachedSiteContacts,
  getCachedSiteSettings,
} from '@/lib/publicData'

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

export const revalidate = 300

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

  const [siteSettings, headerFooter, siteContacts, designSettings, seoSettings, servicesPage] = await Promise.all([
    getCachedSiteSettings(locale as 'es' | 'en' | 'uk').catch((err) => {
      console.error('Error fetching site-settings global:', err)
      return null as SiteSetting | null
    }),
    getCachedHeaderFooter(locale as 'es' | 'en' | 'uk').catch((err) => {
      console.error('Error fetching header-footer global:', err)
      return null as HeaderFooter | null
    }),
    getCachedSiteContacts(locale as 'es' | 'en' | 'uk').catch((err) => {
      console.error('Error fetching site-contacts global:', err)
      return null as SiteContact | null
    }),
    getCachedDesignSettings(locale as 'es' | 'en' | 'uk').catch((err) => {
      console.error('Error fetching design-settings global:', err)
      return null as Record<string, unknown> | null
    }),
    getCachedSeoSettings(locale as 'es' | 'en' | 'uk').catch((err) => {
      console.error('Error fetching seo-settings global:', err)
      return null as SeoSetting | null
    }),
    getCachedServicesPage(locale as 'es' | 'en' | 'uk', 0).catch((err) => {
      console.error('Error fetching services page path:', err)
      return null as Page | null
    }),
  ])

  const sharedMenuItems = siteSettings?.menuItems?.length
    ? siteSettings.menuItems
    : (headerFooter?.menuItems || [])

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
  const siteUrl = await getConfiguredSiteUrl()
  const structuredData = [
    buildOrganizationStructuredData({
      locale: locale as 'es' | 'en' | 'uk',
      siteName: seoSettings?.siteName,
      contacts: contactsData,
      branding,
      organizationName: seoSettings?.organizationName,
      organizationLogo: seoSettings?.organizationLogo,
      organizationPhone: seoSettings?.organizationPhone,
      organizationEmail: seoSettings?.organizationEmail,
      organizationAddress: seoSettings?.organizationAddress,
      siteUrl,
    }),
    buildWebsiteStructuredData(locale as 'es' | 'en' | 'uk', seoSettings?.siteName, siteUrl),
  ]

  return (
    <div style={getDesignSettingsVars(designSettings)}>
      <TrackingScripts tracking={tracking} />
      <AnalyticsListener locale={locale} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
