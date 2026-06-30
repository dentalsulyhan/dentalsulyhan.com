import { DEFAULT_LOCALE, type SupportedLocale, buildLocalizedPath, normalizePath } from '@/lib/localizedRouting'

function getRawSiteUrl() {
  return (
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    'http://localhost:3000'
  )
}

export function getSiteUrl() {
  const raw = getRawSiteUrl()
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return normalized.replace(/\/+$/, '')
}

export function getMetadataBase() {
  return new URL(getSiteUrl())
}

export function buildAbsoluteUrl(path: string) {
  return new URL(normalizePath(path), getMetadataBase()).toString()
}

export function buildLocalizedAbsoluteUrl(locale: SupportedLocale | string, path: string) {
  return buildAbsoluteUrl(buildLocalizedPath(locale, path))
}

export function buildLocalizedAlternates(paths: Partial<Record<SupportedLocale, string>>) {
  return {
    es: paths.es ? buildLocalizedAbsoluteUrl(DEFAULT_LOCALE, paths.es) : undefined,
    en: paths.en ? buildLocalizedAbsoluteUrl('en', paths.en) : undefined,
    uk: paths.uk ? buildLocalizedAbsoluteUrl('uk', paths.uk) : undefined,
  }
}

