import type { MetadataRoute } from 'next'
import { getConfiguredSiteUrl } from '@/lib/seo'

// Rendered per request, never baked at build time (see sitemap.ts).
export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = await getConfiguredSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/_next', '/.well-known'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
