import { unstable_cache } from 'next/cache'
import { DEFAULT_LOCALE, type SupportedLocale, buildLocalizedPath, normalizePath } from '@/lib/localizedRouting'
import { PUBLIC_REVALIDATE, getCachedSeoSettings } from '@/lib/publicData'

function getRawSiteUrl() {
  return (
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    'http://localhost:3000'
  )
}

function normalizeSiteUrl(raw: string) {
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return normalized.replace(/\/+$/, '')
}

export function getSiteUrl() {
  return normalizeSiteUrl(getRawSiteUrl())
}

export const getConfiguredSiteUrl = unstable_cache(
  async () => {
    try {
      const seoSettings = await getCachedSeoSettings(DEFAULT_LOCALE).catch((error) => {
        console.error('Error fetching seo-settings baseUrl:', error)
        return null
      })

      const cmsBaseUrl = seoSettings?.baseUrl?.trim()
      if (cmsBaseUrl) {
        return normalizeSiteUrl(cmsBaseUrl)
      }
    } catch (error) {
      console.error('Error resolving configured siteUrl:', error)
    }

    return getSiteUrl()
  },
  ['configured-site-url'],
  {
    revalidate: PUBLIC_REVALIDATE,
    tags: ['configured-site-url'],
  },
)

export function getMetadataBase() {
  return new URL(getSiteUrl())
}

export async function getConfiguredMetadataBase() {
  return new URL(await getConfiguredSiteUrl())
}

export function buildAbsoluteUrlWithBase(path: string, siteUrl: string = getSiteUrl()) {
  return new URL(normalizePath(path), new URL(siteUrl)).toString()
}

export function buildAbsoluteUrl(path: string) {
  return buildAbsoluteUrlWithBase(path)
}

export function buildLocalizedAbsoluteUrlWithBase(
  locale: SupportedLocale | string,
  path: string,
  siteUrl: string = getSiteUrl(),
) {
  return buildAbsoluteUrlWithBase(buildLocalizedPath(locale, path), siteUrl)
}

export function buildLocalizedAbsoluteUrl(locale: SupportedLocale | string, path: string) {
  return buildLocalizedAbsoluteUrlWithBase(locale, path)
}

export function buildLocalizedAlternates(paths: Partial<Record<SupportedLocale, string>>) {
  return {
    es: paths.es ? buildLocalizedAbsoluteUrl(DEFAULT_LOCALE, paths.es) : undefined,
    en: paths.en ? buildLocalizedAbsoluteUrl('en', paths.en) : undefined,
    uk: paths.uk ? buildLocalizedAbsoluteUrl('uk', paths.uk) : undefined,
  }
}
