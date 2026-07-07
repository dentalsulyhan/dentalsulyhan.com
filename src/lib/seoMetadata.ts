import type { Metadata } from 'next'
import type { Media, SeoSetting } from '@/payload-types'
import { DEFAULT_LOCALE, type SupportedLocale } from '@/lib/localizedRouting'
import { buildAbsoluteUrlWithBase, buildLocalizedAbsoluteUrlWithBase } from '@/lib/seo'

export type SeoTarget = {
  title?: string | null
  appendSiteNameToTitle?: boolean
  description?: string | null
  content?: unknown
  image?: number | Media | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
  noFollow?: boolean | null
  twitterCard?: SeoSetting['defaultTwitterCard']
}

export type SeoAlternates = Partial<Record<SupportedLocale, string | null | undefined>>

function getMediaUrl(field: SeoTarget['image'] | SeoSetting['defaultOgImage']): string | null {
  if (field && typeof field === 'object' && 'url' in field) {
    return field.url ?? null
  }

  return null
}

function resolveTitle(
  title: string | null | undefined,
  settings: SeoSetting | null | undefined,
  appendSiteName = true,
) {
  const siteName = settings?.siteName?.trim() || 'Dental Clinic Sulyhan'
  const template = settings?.titleTemplate?.trim() || '%s | Dental Clinic Sulyhan'
  const cleanTitle = title?.trim()

  if (!cleanTitle) return siteName

  if (!appendSiteName) return cleanTitle

  if (template.includes('%s')) {
    return template.replace('%s', cleanTitle)
  }

  return `${cleanTitle} | ${siteName}`
}

function cleanDescription(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function truncateDescription(value: string, limit = 160) {
  const cleaned = cleanDescription(value)

  if (cleaned.length <= limit) return cleaned

  return `${cleaned.slice(0, limit).trimEnd()}...`
}

function extractLexicalText(value: unknown): string {
  if (!isPlainObject(value)) return ''

  const root = value.root
  if (!isPlainObject(root) || !Array.isArray(root.children)) return ''

  const parts: string[] = []

  const walk = (node: unknown) => {
    if (typeof node === 'string') {
      if (node.trim()) parts.push(node.trim())
      return
    }

    if (!isPlainObject(node)) return

    if (typeof node.text === 'string' && node.text.trim()) {
      parts.push(node.text.trim())
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(walk)
    }
  }

  root.children.forEach(walk)
  return parts.join(' ')
}

function extractTextFromValue(value: unknown, seen = new Set<unknown>()): string {
  if (!value || seen.has(value)) return ''

  if (typeof value === 'string') return value

  if (Array.isArray(value)) {
    const nested = value
      .map((entry) => extractTextFromValue(entry, seen))
      .filter(Boolean)
      .join(' ')

    return nested
  }

  if (!isPlainObject(value)) return ''
  seen.add(value)

  const lexicalText = extractLexicalText(value)
  if (lexicalText) return lexicalText

  const priorityKeys = [
    'metaDescription',
    'description',
    'subtitle',
    'intro',
    'text',
    'content',
    'sectionDescription',
    'bottomText',
    'conclusion',
    'body',
    'title',
    'label',
    'name',
  ]

  for (const key of priorityKeys) {
    const nested = extractTextFromValue(value[key], seen)
    if (nested) return nested
  }

  for (const nestedValue of Object.values(value)) {
    const nested = extractTextFromValue(nestedValue, seen)
    if (nested) return nested
  }

  return ''
}

function resolveDescription(
  description: string | null | undefined,
  settings: SeoSetting | null | undefined,
  content?: unknown,
) {
  const explicitDescription = description?.trim()
  if (explicitDescription) return explicitDescription

  const contentDescription = extractTextFromValue(content)
  if (contentDescription) return truncateDescription(contentDescription)

  return settings?.defaultDescription?.trim() || undefined
}

function resolveCanonicalUrl(
  locale: SupportedLocale,
  path: string | null | undefined,
  canonicalUrl: string | null | undefined,
  siteUrl?: string,
) {
  const trimmedCanonical = canonicalUrl?.trim()

  if (trimmedCanonical) {
    return /^https?:\/\//i.test(trimmedCanonical)
      ? trimmedCanonical
      : buildAbsoluteUrlWithBase(trimmedCanonical, siteUrl)
  }

  if (!path) return undefined
  return buildLocalizedAbsoluteUrlWithBase(locale, path, siteUrl)
}

function resolveRobots(
  settings: SeoSetting | null | undefined,
  noIndex: boolean | null | undefined,
  noFollow: boolean | null | undefined,
) {
  const index = settings?.indexSite ?? true
  const follow = settings?.followLinks ?? true

  return {
    index: noIndex ? false : index,
    follow: noFollow ? false : follow,
  }
}

export function buildSeoMetadata({
  locale,
  settings,
  target,
  path,
  alternates,
  siteUrl,
}: {
  locale: SupportedLocale
  settings: SeoSetting | null | undefined
  target: SeoTarget
  path?: string | null
  alternates?: SeoAlternates
  siteUrl?: string
}): Metadata {
  const title = resolveTitle(target.title, settings, target.appendSiteNameToTitle ?? true)
  const description = resolveDescription(target.description, settings, target.content)
  const canonical = resolveCanonicalUrl(locale, path, target.canonicalUrl, siteUrl)
  const robots = resolveRobots(settings, target.noIndex, target.noFollow)
  const ogImage = getMediaUrl(target.image) || getMediaUrl(settings?.defaultOgImage)
  const languages = Object.fromEntries(
    Object.entries(alternates || {}).flatMap(([altLocale, altPath]) => {
      if (!altPath) return []
      return [[altLocale, buildLocalizedAbsoluteUrlWithBase(altLocale as SupportedLocale, altPath, siteUrl)]]
    }),
  )

  if (alternates?.es) {
    languages['x-default'] = buildLocalizedAbsoluteUrlWithBase(DEFAULT_LOCALE, alternates.es, siteUrl)
  } else if (canonical) {
    languages['x-default'] = canonical
  }

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: target.twitterCard || settings?.defaultTwitterCard || 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots,
  }
}
