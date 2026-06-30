import React from 'react'

type RootLayoutProps = {
  children: React.ReactNode
}

export const metadata = {
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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
