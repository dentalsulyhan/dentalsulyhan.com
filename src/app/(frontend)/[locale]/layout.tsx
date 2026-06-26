import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { HeaderFooter, Page, SiteContact, SiteSetting } from '@/payload-types'
import { getDesignSettingsVars } from '@/lib/designSettings'

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
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

  return (
    <div style={getDesignSettingsVars(designSettings)}>
      <Header data={headerData} contacts={contactsData} currentLocale={locale} servicesPath={servicesPath} />

      <main className="flex-grow pt-[70px]">
        {children}
      </main>

      <Footer 
        data={footerData} 
        contacts={contactsData}
        headerLogo={headerData.logo} 
        currentLocale={locale} 
        servicesPath={servicesPath}
      />
    </div>
  )
}
