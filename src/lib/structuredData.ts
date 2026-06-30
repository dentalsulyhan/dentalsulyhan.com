import type { SiteContact } from '@/payload-types'
import { buildAbsoluteUrl } from '@/lib/seo'
import { DEFAULT_LOCALE, type SupportedLocale, buildLocalizedPath } from '@/lib/localizedRouting'

type BrandingData = {
  logo?: number | { url?: string | null; alt?: string | null } | null
  logoDark?: number | { url?: string | null; alt?: string | null } | null
  logoLight?: number | { url?: string | null; alt?: string | null } | null
}

function mediaUrl(field: unknown): string | null {
  if (!field || typeof field !== 'object') return null
  if ('url' in field) return (field as { url?: string | null }).url ?? null
  return null
}

function getLogoUrl(branding?: BrandingData | null) {
  return mediaUrl(branding?.logoDark) || mediaUrl(branding?.logo) || mediaUrl(branding?.logoLight)
}

function toAbsoluteUrl(url: string | null | undefined) {
  if (!url) return undefined
  return /^https?:\/\//i.test(url) ? url : buildAbsoluteUrl(url)
}

function normalizePhone(value?: string | null) {
  return value?.trim() || undefined
}

function normalizeAddress(value?: string | null) {
  return value?.trim() || undefined
}

export function buildOrganizationStructuredData({
  locale,
  siteName,
  contacts,
  branding,
}: {
  locale: SupportedLocale
  siteName?: string | null
  contacts: Partial<SiteContact> | null | undefined
  branding?: BrandingData | null
}) {
  const resolvedSiteName = siteName?.trim() || 'Dental Clinic Sulyhan'
  const siteUrl = buildAbsoluteUrl(locale === DEFAULT_LOCALE ? '/' : `/${locale}`)
  const logoUrl = getLogoUrl(branding)
  const contactPoint = normalizePhone(contacts?.phone)
  const email = contacts?.email?.trim() || undefined
  const address = normalizeAddress(contacts?.address)
  const sameAs = [...(contacts?.socialLinks || [])]
    .map((link) => link.url?.trim())
    .filter((url): url is string => Boolean(url))

  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: resolvedSiteName,
    url: siteUrl,
    logo: toAbsoluteUrl(logoUrl),
    telephone: contactPoint,
    email,
    address: address
      ? {
          '@type': 'PostalAddress',
          streetAddress: address,
        }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  }
}

export function buildWebsiteStructuredData(locale: SupportedLocale, siteName: string | null | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName?.trim() || 'Dental Clinic Sulyhan',
    url: buildAbsoluteUrl(locale === DEFAULT_LOCALE ? '/' : `/${locale}`),
    inLanguage: locale,
  }
}

export function buildBreadcrumbStructuredData(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  }
}
