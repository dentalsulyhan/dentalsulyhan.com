import './null.css'
import './style.css'
import './adaptive.css'
import './globals.css'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  const headerFooter = await payload.findGlobal({
    slug: 'header-footer',
    locale: locale as 'es' | 'en' | 'uk', 
  })

  // Extract shared menu items and inject them into header and footer data
  const sharedMenuItems = headerFooter.menuItems || []
  const headerData = { ...(headerFooter.header || {}), menuItems: sharedMenuItems }
  const footerData = { ...(headerFooter.footer || {}), menuItems: sharedMenuItems }

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen bg-[#fafafa] text-[#22282b]">
        {/* Render Header with parsed settings */}
        <Header data={headerData} currentLocale={locale} />

        {/* Content area with 70px offset matching the header height */}
        <main className="flex-grow pt-[70px]">
          {children}
        </main>

        {/* Render Footer with parsed settings and fallback logo */}
        <Footer 
          data={footerData} 
          headerLogo={headerData.logo} 
          currentLocale={locale} 
        />
      </body>
    </html>
  )
}