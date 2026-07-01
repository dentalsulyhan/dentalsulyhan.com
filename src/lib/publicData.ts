import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type {
  DesignSetting,
  HeaderFooter,
  HomePage,
  Page,
  Promotion,
  SeoSetting,
  Service,
  SiteContact,
  SiteSetting,
  TeamMember,
} from '@/payload-types'
import type { SupportedLocale } from '@/lib/localizedRouting'

export const PUBLIC_REVALIDATE = 300

const getPayloadClient = cache(async () => getPayload({ config: configPromise }))

type PagePathEntry = Pick<Page, 'slug' | 'path' | 'title' | 'noIndex' | 'updatedAt'>
type ServicePathEntry = Pick<Service, 'slug' | 'path' | 'title' | 'noIndex' | 'updatedAt'>

function cached<T>(
  keyParts: string[],
  loader: () => Promise<T>,
  tags: string[] = [],
) {
  return unstable_cache(loader, keyParts, {
    revalidate: PUBLIC_REVALIDATE,
    tags,
  })()
}

export async function getCachedSiteSettings(locale: SupportedLocale) {
  return cached(
    ['public-site-settings', locale],
    async () => {
      const payload = await getPayloadClient()
      return (await payload.findGlobal({
        slug: 'site-settings',
        locale,
      })) as SiteSetting
    },
    [`public-site-settings:${locale}`],
  )
}

export async function getCachedHeaderFooter(locale: SupportedLocale) {
  return cached(
    ['public-header-footer', locale],
    async () => {
      const payload = await getPayloadClient()
      return (await payload.findGlobal({
        slug: 'header-footer',
        locale,
      })) as HeaderFooter
    },
    [`public-header-footer:${locale}`],
  )
}

export async function getCachedSiteContacts(locale: SupportedLocale) {
  return cached(
    ['public-site-contacts', locale],
    async () => {
      const payload = await getPayloadClient()
      return (await payload.findGlobal({
        slug: 'site-contacts',
        locale,
      })) as SiteContact
    },
    [`public-site-contacts:${locale}`],
  )
}

export async function getCachedDesignSettings(locale: SupportedLocale) {
  return cached(
    ['public-design-settings', locale],
    async () => {
      const payload = await getPayloadClient()
      return (await payload.findGlobal({
        slug: 'design-settings',
        locale,
      })) as unknown as Record<string, unknown> & DesignSetting
    },
    [`public-design-settings:${locale}`],
  )
}

export async function getCachedSeoSettings(locale: SupportedLocale) {
  return cached(
    ['public-seo-settings', locale],
    async () => {
      const payload = await getPayloadClient()
      return (await payload.findGlobal({
        slug: 'seo-settings',
        locale,
      })) as SeoSetting
    },
    [`public-seo-settings:${locale}`],
  )
}

export async function getCachedHomePage(locale: SupportedLocale) {
  return cached(
    ['public-home-page', locale],
    async () => {
      const payload = await getPayloadClient()
      return (await payload.findGlobal({
        slug: 'home-page',
        locale,
      })) as HomePage
    },
    [`public-home-page:${locale}`],
  )
}

export async function getCachedTeamMembers(locale: SupportedLocale) {
  return cached(
    ['public-team-members', locale],
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'team-members',
        locale,
        sort: 'order',
        limit: 20,
      })

      return result.docs as TeamMember[]
    },
    [`public-team-members:${locale}`],
  )
}

export async function getCachedActivePromotions(locale: SupportedLocale) {
  return cached(
    ['public-promotions', locale],
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'promotions',
        locale,
        where: {
          isActive: {
            equals: true,
          },
        },
        limit: 10,
      })

      return result.docs as Promotion[]
    },
    [`public-promotions:${locale}`],
  )
}

export async function getCachedPagePathEntries(locale: SupportedLocale) {
  return cached(
    ['public-page-path-entries', locale],
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        locale,
        fallbackLocale: false,
        depth: 0,
        limit: 200,
        select: {
          slug: true,
          path: true,
          title: true,
          noIndex: true,
          updatedAt: true,
        },
      })

      return result.docs as PagePathEntry[]
    },
    [`public-page-path-entries:${locale}`],
  )
}

export async function getCachedServicePathEntries(locale: SupportedLocale) {
  return cached(
    ['public-service-path-entries', locale],
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'services',
        locale,
        fallbackLocale: false,
        depth: 0,
        limit: 200,
        select: {
          slug: true,
          path: true,
          title: true,
          noIndex: true,
          updatedAt: true,
        },
      })

      return result.docs as ServicePathEntry[]
    },
    [`public-service-path-entries:${locale}`],
  )
}

export async function getCachedServicesPage(locale: SupportedLocale, depth: 0 | 1 | 2 | 3 = 1) {
  return cached(
    ['public-services-page', locale, String(depth)],
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        locale,
        fallbackLocale: false,
        depth,
        where: {
          slug: {
            equals: 'services',
          },
        },
        limit: 1,
      })

      return (result.docs[0] as Page | undefined) || null
    },
    [`public-services-page:${locale}`],
  )
}

export async function getCachedPageBySlug(
  locale: SupportedLocale,
  slug: string,
  depth: 0 | 1 | 2 | 3 = 1,
) {
  return cached(
    ['public-page-by-slug', locale, slug, String(depth)],
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        locale,
        fallbackLocale: false,
        depth,
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
      })

      return (result.docs[0] as Page | undefined) || null
    },
    [`public-page:${locale}:${slug}`],
  )
}

export async function getCachedPageByPath(
  locale: SupportedLocale,
  path: string,
  depth: 0 | 1 | 2 | 3 = 1,
) {
  return cached(
    ['public-page-by-path', locale, path, String(depth)],
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        locale,
        fallbackLocale: false,
        depth,
        where: {
          path: {
            equals: path,
          },
        },
        limit: 1,
      })

      return (result.docs[0] as Page | undefined) || null
    },
    [`public-page-path:${locale}:${path}`],
  )
}

export async function getCachedServiceByPath(
  locale: SupportedLocale,
  path: string,
  depth: 0 | 1 | 2 | 3 = 1,
) {
  return cached(
    ['public-service-by-path', locale, path, String(depth)],
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'services',
        locale,
        fallbackLocale: false,
        depth,
        where: {
          path: {
            equals: path,
          },
        },
        limit: 1,
      })

      return (result.docs[0] as Service | undefined) || null
    },
    [`public-service-path:${locale}:${path}`],
  )
}
