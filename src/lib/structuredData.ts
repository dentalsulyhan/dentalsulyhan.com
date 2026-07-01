import type { SiteContact } from '@/payload-types'
import { buildAbsoluteUrlWithBase } from '@/lib/seo'
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

function toAbsoluteUrl(url: string | null | undefined, siteUrl?: string) {
  if (!url) return undefined
  return /^https?:\/\//i.test(url) ? url : buildAbsoluteUrlWithBase(url, siteUrl)
}

function normalizePhone(value?: string | null) {
  return value?.trim() || undefined
}

function normalizeAddress(value?: string | null) {
  return value?.trim() || undefined
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function extractLexicalText(value: unknown): string {
  if (!isPlainObject(value)) return ''

  const root = value.root
  if (!isPlainObject(root) || !Array.isArray(root.children)) return ''

  const parts: string[] = []

  const walk = (node: unknown) => {
    if (typeof node === 'string') {
      const trimmed = node.trim()
      if (trimmed) parts.push(trimmed)
      return
    }

    if (!isPlainObject(node)) return

    if (typeof node.text === 'string') {
      const trimmed = node.text.trim()
      if (trimmed) parts.push(trimmed)
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(walk)
    }
  }

  root.children.forEach(walk)
  return parts.join(' ')
}

function extractPlainText(value: unknown): string {
  if (!value) return ''

  if (typeof value === 'string') return value.trim()

  if (Array.isArray(value)) {
    return value.map((entry) => extractPlainText(entry)).filter(Boolean).join(' ')
  }

  if (!isPlainObject(value)) return ''

  const lexicalText = extractLexicalText(value)
  if (lexicalText) return lexicalText

  if (typeof value.text === 'string') return value.text.trim()
  if (typeof value.heading === 'string') return value.heading.trim()
  if (typeof value.title === 'string') return value.title.trim()

  return Object.values(value).map((entry) => extractPlainText(entry)).filter(Boolean).join(' ')
}

export function buildOrganizationStructuredData({
  locale,
  siteName,
  contacts,
  branding,
  organizationName,
  organizationLogo,
  organizationPhone,
  organizationEmail,
  organizationAddress,
  siteUrl,
}: {
  locale: SupportedLocale
  siteName?: string | null
  contacts: Partial<SiteContact> | null | undefined
  branding?: BrandingData | null
  organizationName?: string | null
  organizationLogo?: unknown
  organizationPhone?: string | null
  organizationEmail?: string | null
  organizationAddress?: string | null
  siteUrl?: string
}) {
  const resolvedSiteName =
    organizationName?.trim() || siteName?.trim() || 'Dental Clinic Sulyhan'
  const localizedSiteUrl = buildAbsoluteUrlWithBase(
    locale === DEFAULT_LOCALE ? '/' : `/${locale}`,
    siteUrl,
  )
  const logoUrl = mediaUrl(organizationLogo) || getLogoUrl(branding)
  const contactPoint = normalizePhone(organizationPhone || contacts?.phone)
  const email = organizationEmail?.trim() || contacts?.email?.trim() || undefined
  const address = normalizeAddress(organizationAddress || contacts?.address)
  const sameAs = [...(contacts?.socialLinks || [])]
    .map((link) => link.url?.trim())
    .filter((url): url is string => Boolean(url))

  return {
    '@context': 'https://schema.org',
    '@type': ['Dentist', 'LocalBusiness'],
    name: resolvedSiteName,
    url: localizedSiteUrl,
    logo: toAbsoluteUrl(logoUrl, siteUrl),
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

export function buildWebsiteStructuredData(
  locale: SupportedLocale,
  siteName: string | null | undefined,
  siteUrl?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName?.trim() || 'Dental Clinic Sulyhan',
    url: buildAbsoluteUrlWithBase(locale === DEFAULT_LOCALE ? '/' : `/${locale}`, siteUrl),
    inLanguage: locale,
  }
}

export function buildWebPageStructuredData({
  name,
  description,
  url,
  locale,
  siteName,
  siteUrl,
}: {
  name: string
  description?: string | null
  url: string
  locale: SupportedLocale
  siteName?: string | null
  siteUrl?: string
}) {
  if (!name || !url) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description: description?.trim() || undefined,
    url: buildAbsoluteUrlWithBase(url, siteUrl),
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName?.trim() || 'Dental Clinic Sulyhan',
      url: buildAbsoluteUrlWithBase(locale === DEFAULT_LOCALE ? '/' : `/${locale}`, siteUrl),
    },
  }
}

export function buildBreadcrumbStructuredData(
  items: Array<{ name: string; path: string }>,
  siteUrl?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrlWithBase(item.path, siteUrl),
    })),
  }
}

export function buildItemListStructuredData(
  items: Array<{ name: string; path: string }>,
  siteUrl?: string,
) {
  const mappedItems = items
    .filter((item) => item.name && item.path)
    .map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: buildAbsoluteUrlWithBase(item.path, siteUrl),
    }))

  if (!mappedItems.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: mappedItems,
  }
}

export function buildServiceStructuredData({
  name,
  description,
  url,
  providerName,
  siteUrl,
}: {
  name: string
  description?: string | null
  url: string
  providerName?: string | null
  siteUrl?: string
}) {
  if (!name || !url) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description: description?.trim() || undefined,
    url: buildAbsoluteUrlWithBase(url, siteUrl),
    provider: providerName?.trim()
      ? {
          '@type': 'Dentist',
          name: providerName.trim(),
        }
      : undefined,
  }
}

export function buildFaqStructuredData(
  items: Array<{ heading?: unknown; content?: unknown }> | null | undefined,
) {
  const questions = (items || [])
    .map((item) => {
      const question = extractPlainText(item.heading)
      const answer = extractPlainText(item.content)

      if (!question || !answer) return null

      return {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      }
    })
    .filter(Boolean)

  if (!questions.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions,
  }
}
