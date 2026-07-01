import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageContent } from '../page-content'
import { ServiceDetailPageContent } from '../services/[slug]/page-content'
import { ServicesListingPageContent } from '../services/page-content'
import type { HomePage as HomePageType, Page, SeoSetting, Service } from '@/payload-types'
import { isSupportedLocale, SUPPORTED_LOCALES } from '@/lib/localizedRouting'
import { buildSeoMetadata, type SeoAlternates } from '@/lib/seoMetadata'
import { getConfiguredSiteUrl } from '@/lib/seo'

type RouteDoc = Pick<
  Page,
  | 'slug'
  | 'path'
  | 'metaTitle'
  | 'metaDescription'
  | 'metaImage'
  | 'canonicalUrl'
  | 'noIndex'
  | 'noFollow'
  | 'twitterCard'
  | 'title'
> &
  Partial<
    Pick<
      Service,
      | 'slug'
      | 'path'
      | 'metaTitle'
      | 'metaDescription'
      | 'metaImage'
      | 'canonicalUrl'
      | 'noIndex'
      | 'noFollow'
      | 'twitterCard'
      | 'title'
    >
  > & {
    layout?: unknown[] | null
  }

async function fetchSeoSettings(locale: 'es' | 'en' | 'uk') {
  const payload = await getPayload({ config: configPromise })

  try {
    return (await payload.findGlobal({
      slug: 'seo-settings',
      locale,
    })) as SeoSetting
  } catch (error) {
    console.error('Error fetching seo-settings global:', error)
    return null
  }
}

async function fetchLocalizedDocPaths(
  collection: 'pages' | 'services',
  slug: string,
): Promise<SeoAlternates> {
  if (collection === 'pages' && slug === 'home') {
    return {
      es: '/',
      en: '/',
      uk: '/',
    }
  }

  const payload = await getPayload({ config: configPromise })

  const entries = await Promise.all(
    SUPPORTED_LOCALES.map(async (locale) => {
      const result = await payload.find({
        collection,
        locale,
        fallbackLocale: false,
        depth: 0,
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
      })

      const doc = result.docs[0] as { path?: string | null } | undefined
      if (!doc?.path) {
        return [locale, null] as const
      }

      if (collection === 'services') {
        const servicesPageResult = await payload.find({
          collection: 'pages',
          locale,
          fallbackLocale: false,
          depth: 0,
          where: {
            slug: {
              equals: 'services',
            },
          },
          limit: 1,
        })

        const servicesPage = servicesPageResult.docs[0] as { path?: string | null } | undefined
        const servicesBasePath = servicesPage?.path ? `/${servicesPage.path}` : '/services'

        return [locale, `${servicesBasePath}/${doc.path}`] as const
      }

      return [locale, doc.path] as const
    }),
  )

  return Object.fromEntries(entries.filter(([, path]) => Boolean(path))) as SeoAlternates
}

function resolveSeoPath(kind: 'page' | 'service', slug: string, path: string | null | undefined) {
  if (kind === 'page' && slug === 'home') {
    return '/'
  }

  return path
}

async function resolveMetadataPath({
  kind,
  locale,
  slug,
  path,
}: {
  kind: 'page' | 'service'
  locale: 'es' | 'en' | 'uk'
  slug: string
  path: string | null | undefined
}) {
  if (kind === 'page') {
    return resolveSeoPath(kind, slug, path)
  }

  if (!path) {
    return path
  }

  const payload = await getPayload({ config: configPromise })
  const servicesPageResult = await payload.find({
    collection: 'pages',
    locale,
    fallbackLocale: false,
    depth: 0,
    where: {
      slug: {
        equals: 'services',
      },
    },
    limit: 1,
  })

  const servicesPage = servicesPageResult.docs[0] as { path?: string | null } | undefined
  const servicesBasePath = servicesPage?.path ? `/${servicesPage.path}` : '/services'

  return `${servicesBasePath}/${path}`
}

async function resolveRouteDocument(locale: 'es' | 'en' | 'uk', slug: string[]) {
  const payload = await getPayload({ config: configPromise })

  if (slug.length === 0) {
    const homeResult = await payload.find({
      collection: 'pages',
      locale,
      fallbackLocale: false,
      depth: 1,
      where: {
        slug: {
          equals: 'home',
        },
      },
      limit: 1,
    })

    return { kind: 'page' as const, doc: homeResult.docs[0] as RouteDoc | undefined, slug: 'home' }
  }

  const pageResult = await payload.find({
    collection: 'pages',
    locale,
    fallbackLocale: false,
    depth: 1,
    where: {
      path: {
        equals: slug[0],
      },
    },
    limit: 1,
  })

  const page = pageResult.docs[0] as RouteDoc | undefined

  if (!page) return null

  if (page.slug === 'services') {
    if (slug.length === 1) {
      return { kind: 'page' as const, doc: page, slug: page.slug }
    }

    if (slug.length === 2) {
      const serviceResult = await payload.find({
        collection: 'services',
        locale,
        fallbackLocale: false,
        depth: 1,
        where: {
          path: {
            equals: slug[1],
          },
        },
        limit: 1,
      })

      const service = serviceResult.docs[0] as RouteDoc | undefined
      return service ? { kind: 'service' as const, doc: service, slug: service.slug || slug[1] } : null
    }

    return null
  }

  if (slug.length > 1) return null

  return { kind: 'page' as const, doc: page, slug: page.slug }
}

async function fetchHomePageContent(locale: 'es' | 'en' | 'uk') {
  const payload = await getPayload({ config: configPromise })

  try {
    return (await payload.findGlobal({
      slug: 'home-page',
      locale,
    })) as HomePageType
  } catch (error) {
    console.error('Error fetching home-page global for metadata:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}): Promise<Metadata> {
  const { locale, slug = [] } = await params

  if (!isSupportedLocale(locale)) {
    return {}
  }

  const resolved = await resolveRouteDocument(locale as 'es' | 'en' | 'uk', slug)
  if (!resolved?.doc) {
    return {}
  }

  const seoSettings = await fetchSeoSettings(locale as 'es' | 'en' | 'uk')
  const homePageContent = slug.length === 0 ? await fetchHomePageContent(locale as 'es' | 'en' | 'uk') : null
  const siteUrl = await getConfiguredSiteUrl()
  const metadataPath = await resolveMetadataPath({
    kind: resolved.kind,
    locale: locale as 'es' | 'en' | 'uk',
    slug: resolved.slug,
    path: resolved.doc.path,
  })
  const alternates =
    resolved.kind === 'service'
      ? await fetchLocalizedDocPaths('services', resolved.slug)
      : await fetchLocalizedDocPaths('pages', resolved.slug)

  return buildSeoMetadata({
    locale: locale as 'es' | 'en' | 'uk',
    settings: seoSettings,
    target: {
      title: resolved.doc.metaTitle || resolved.doc.title,
      description: resolved.doc.metaDescription,
      content: homePageContent || resolved.doc.layout,
      image: resolved.doc.metaImage,
      canonicalUrl: resolved.doc.canonicalUrl,
      noIndex: resolved.doc.noIndex,
      noFollow: resolved.doc.noFollow,
      twitterCard: resolved.doc.twitterCard,
    },
    path: metadataPath,
    alternates,
    siteUrl,
  })
}

export default async function LocalizedPageRouter({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}) {
  const { locale, slug = [] } = await params

  if (!isSupportedLocale(locale)) {
    return notFound()
  }

  if (slug.length === 0) {
    return PageContent({ locale, slug: 'home' })
  }

  const payload = await getPayload({ config: configPromise })
  const pageResult = await payload.find({
    collection: 'pages',
    locale: locale as 'es' | 'en' | 'uk',
    fallbackLocale: false,
    depth: 1,
    where: {
      path: {
        equals: slug[0],
      },
    },
    limit: 1,
  })

  const page = pageResult.docs[0]
  if (!page) {
    return notFound()
  }

  if (page.slug === 'services') {
    if (slug.length === 1) {
      return ServicesListingPageContent({ locale })
    }

    if (slug.length === 2) {
      return ServiceDetailPageContent({ locale, slug: slug[1] })
    }

    return notFound()
  }

  if (slug.length > 1) {
    return notFound()
  }

  return PageContent({ locale, path: slug[0] })
}
