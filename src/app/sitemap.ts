import type { MetadataRoute } from 'next'
import { getSiteUrl, buildLocalizedAbsoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const now = new Date()

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
    },
    {
      url: buildLocalizedAbsoluteUrl('en', '/'),
      lastModified: now,
    },
    {
      url: buildLocalizedAbsoluteUrl('uk', '/'),
      lastModified: now,
    },
  ]
}

