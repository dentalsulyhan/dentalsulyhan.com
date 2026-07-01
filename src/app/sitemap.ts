import type { MetadataRoute } from 'next'
import { SUPPORTED_LOCALES } from '@/lib/localizedRouting'
import { getConfiguredSiteUrl, buildLocalizedAbsoluteUrlWithBase } from '@/lib/seo'
import { getCachedPagePathEntries, getCachedServicePathEntries } from '@/lib/publicData'

type SitemapEntry = MetadataRoute.Sitemap[number]

export const revalidate = 300

function toDate(value?: string | null) {
  return value ? new Date(value) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getConfiguredSiteUrl()
  const now = new Date()
  const entries: SitemapEntry[] = []

  const pageResults = await Promise.all(
    SUPPORTED_LOCALES.map((locale) => getCachedPagePathEntries(locale)),
  )

  const serviceResults = await Promise.all(
    SUPPORTED_LOCALES.map((locale) => getCachedServicePathEntries(locale)),
  )

  for (let localeIndex = 0; localeIndex < SUPPORTED_LOCALES.length; localeIndex++) {
    const locale = SUPPORTED_LOCALES[localeIndex]
    const pages = pageResults[localeIndex]
    const services = serviceResults[localeIndex]

    for (const page of pages) {
      if (page.noIndex || page.slug === '404') continue

      const path = page.slug === 'home' ? '/' : `/${page.path}`
      if (page.slug !== 'home' && !page.path) continue

      entries.push({
        url: buildLocalizedAbsoluteUrlWithBase(locale, path, siteUrl),
        lastModified: toDate(page.updatedAt) || now,
      })
    }

    const servicesPage = pages.find((page) => page.slug === 'services')
    const servicesBasePath = servicesPage?.path ? `/${servicesPage.path}` : '/services'

    for (const service of services) {
      if (!service.path || service.noIndex) continue
      entries.push({
        url: buildLocalizedAbsoluteUrlWithBase(locale, `${servicesBasePath}/${service.path}`, siteUrl),
        lastModified: toDate(service.updatedAt) || now,
      })
    }
  }

  return entries
}
