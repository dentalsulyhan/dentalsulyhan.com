import React from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getConfiguredMetadataBase } from '@/lib/seo'
import { isSupportedLocale } from '@/lib/localizedRouting'

type RootLayoutProps = {
  children: React.ReactNode
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: await getConfiguredMetadataBase(),
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/api/favicon/16', sizes: '16x16', type: 'image/png' },
        { url: '/api/favicon/32', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/api/favicon/32',
      apple: [{ url: '/api/favicon/180', sizes: '180x180', type: 'image/png' }],
      other: [
        {
          rel: 'mask-icon',
          url: '/logo-sulyhan.svg',
          color: '#1d1c1c',
        },
      ],
    },
  }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const requestHeaders = await headers()
  const localeHeader = requestHeaders.get('x-sulyhan-locale')
  const lang = localeHeader && isSupportedLocale(localeHeader) ? localeHeader : 'es'

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
