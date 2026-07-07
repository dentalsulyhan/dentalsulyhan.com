import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageContent } from '../page-content'
import { ServiceDetailPageContent } from '../services/[slug]/page-content'
import { ServicesListingPageContent } from '../services/page-content'
import type { HomePage as HomePageType, Page, SeoSetting, Service } from '@/payload-types'
import { isSupportedLocale, SUPPORTED_LOCALES } from '@/lib/localizedRouting'
import { buildSeoMetadata, type SeoAlternates } from '@/lib/seoMetadata'
import { getConfiguredSiteUrl } from '@/lib/seo'
import {
  getCachedHomePage,
  getCachedPageByPath,
  getCachedPageBySlug,
  getCachedSeoSettings,
  getCachedServiceByPath,
  getCachedServicesPage,
} from '@/lib/publicData'

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

export const revalidate = 300

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

  const entries = await Promise.all(
    SUPPORTED_LOCALES.map(async (locale) => {
      const doc =
        collection === 'services'
          ? ((await getCachedServiceByPath(locale, slug, 0).catch(() => null)) as { path?: string | null } | null)
          : ((await getCachedPageBySlug(locale, slug, 0).catch(() => null)) as { path?: string | null } | null)
      if (!doc?.path) {
        return [locale, null] as const
      }

      if (collection === 'services') {
        const servicesPage = (await getCachedServicesPage(locale, 0).catch(() => null)) as { path?: string | null } | null
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

  const servicesPage = (await getCachedServicesPage(locale, 0).catch(() => null)) as { path?: string | null } | null
  const servicesBasePath = servicesPage?.path ? `/${servicesPage.path}` : '/services'

  return `${servicesBasePath}/${path}`
}

async function resolveRouteDocument(locale: 'es' | 'en' | 'uk', slug: string[]) {
  if (slug.length === 0) {
    const homePage = (await getCachedPageBySlug(locale, 'home', 1).catch(() => null)) as RouteDoc | null
    return { kind: 'page' as const, doc: homePage || undefined, slug: 'home' }
  }

  const page = (await getCachedPageByPath(locale, slug[0], 1).catch(() => null)) as RouteDoc | null

  if (!page) return null

  if (page.slug === 'services') {
    if (slug.length === 1) {
      return { kind: 'page' as const, doc: page, slug: page.slug }
    }

    if (slug.length === 2) {
      const service = (await getCachedServiceByPath(locale, slug[1], 1).catch(() => null)) as RouteDoc | null
      return service ? { kind: 'service' as const, doc: service, slug: service.slug || slug[1] } : null
    }

    return null
  }

  if (slug.length > 1) return null

  return { kind: 'page' as const, doc: page, slug: page.slug }
}

async function fetchHomePageContent(locale: 'es' | 'en' | 'uk') {
  try {
    return (await getCachedHomePage(locale)) as HomePageType
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

  const seoSettings = await getCachedSeoSettings(locale as 'es' | 'en' | 'uk').catch((error) => {
    console.error('Error fetching seo-settings global:', error)
    return null as SeoSetting | null
  })
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
      appendSiteNameToTitle: !resolved.doc.metaTitle,
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

  const page = await getCachedPageByPath(locale as 'es' | 'en' | 'uk', slug[0], 1)
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
