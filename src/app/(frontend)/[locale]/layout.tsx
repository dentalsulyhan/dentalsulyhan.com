import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { HeaderFooter, SiteContact, SiteSetting } from '@/payload-types'

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

  return (
    <>
      <Header data={headerData} contacts={contactsData} currentLocale={locale} />

      <main className="flex-grow pt-[70px]">
        {children}
      </main>

      <Footer 
        data={footerData} 
        contacts={contactsData}
        headerLogo={headerData.logo} 
        currentLocale={locale} 
      />
    </>
  )
}
