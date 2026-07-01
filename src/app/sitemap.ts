import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Page, Service } from '@/payload-types'
import { SUPPORTED_LOCALES } from '@/lib/localizedRouting'
import { getConfiguredSiteUrl, buildLocalizedAbsoluteUrlWithBase } from '@/lib/seo'

type SitemapEntry = MetadataRoute.Sitemap[number]

function toDate(value?: string | null) {
  return value ? new Date(value) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getConfiguredSiteUrl()
  const now = new Date()
  const payload = await getPayload({ config: configPromise })
  const entries: SitemapEntry[] = []

  const pageResults = await Promise.all(
    SUPPORTED_LOCALES.map(async (locale) =>
      payload.find({
        collection: 'pages',
        locale,
        fallbackLocale: false,
        depth: 0,
        limit: 200,
      }),
    ),
  )

  const serviceResults = await Promise.all(
    SUPPORTED_LOCALES.map(async (locale) =>
      payload.find({
        collection: 'services',
        locale,
        fallbackLocale: false,
        depth: 0,
        limit: 500,
      }),
    ),
  )

  for (let localeIndex = 0; localeIndex < SUPPORTED_LOCALES.length; localeIndex++) {
    const locale = SUPPORTED_LOCALES[localeIndex]
    const pages = pageResults[localeIndex].docs as Page[]
    const services = serviceResults[localeIndex].docs as Service[]

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
