import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { SeoSetting } from '@/payload-types'
import { DEFAULT_LOCALE, type SupportedLocale, buildLocalizedPath, normalizePath } from '@/lib/localizedRouting'

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

export const getConfiguredSiteUrl = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const seoSettings = (await payload.findGlobal({
      slug: 'seo-settings',
      locale: DEFAULT_LOCALE,
    })) as SeoSetting

    const cmsBaseUrl = seoSettings?.baseUrl?.trim()
    if (cmsBaseUrl) {
      return normalizeSiteUrl(cmsBaseUrl)
    }
  } catch (error) {
    console.error('Error fetching seo-settings baseUrl:', error)
  }

  return getSiteUrl()
})

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
