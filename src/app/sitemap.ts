import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Page, Service } from '@/payload-types'
import { SUPPORTED_LOCALES } from '@/lib/localizedRouting'
import { getSiteUrl, buildLocalizedAbsoluteUrl } from '@/lib/seo'

type SitemapEntry = MetadataRoute.Sitemap[number]

function toDate(value?: string | null) {
  return value ? new Date(value) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const now = new Date()
  const payload = await getPayload({ config: configPromise })

  const entries: SitemapEntry[] = [
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
      if (!page.path || page.slug === '404') continue
      const path = page.slug === 'home' ? '/' : `/${page.path}`
      entries.push({
        url: buildLocalizedAbsoluteUrl(locale, path),
        lastModified: toDate(page.updatedAt) || now,
      })
    }

    const servicesPage = pages.find((page) => page.slug === 'services')
    const servicesBasePath = servicesPage?.path ? `/${servicesPage.path}` : '/services'

    for (const service of services) {
      if (!service.path) continue
      entries.push({
        url: buildLocalizedAbsoluteUrl(locale, `${servicesBasePath}/${service.path}`),
        lastModified: toDate(service.updatedAt) || now,
      })
    }
  }

  return entries
}
