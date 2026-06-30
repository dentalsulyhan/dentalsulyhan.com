import type { Metadata } from 'next'
import type { Media, SeoSetting } from '@/payload-types'
import { DEFAULT_LOCALE, type SupportedLocale, buildLocalizedPath } from '@/lib/localizedRouting'
import { buildAbsoluteUrl, buildLocalizedAbsoluteUrl } from '@/lib/seo'

export type SeoTarget = {
  title?: string | null
  description?: string | null
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

function resolveTitle(title: string | null | undefined, settings: SeoSetting | null | undefined) {
  const siteName = settings?.siteName?.trim() || 'Dental Clinic Sulyhan'
  const template = settings?.titleTemplate?.trim() || '%s | Dental Clinic Sulyhan'
  const cleanTitle = title?.trim()

  if (!cleanTitle) return siteName

  if (template.includes('%s')) {
    return template.replace('%s', cleanTitle)
  }

  return `${cleanTitle} | ${siteName}`
}

function resolveDescription(description: string | null | undefined, settings: SeoSetting | null | undefined) {
  return description?.trim() || settings?.defaultDescription?.trim() || undefined
}

function resolveCanonicalUrl(
  locale: SupportedLocale,
  path: string | null | undefined,
  canonicalUrl: string | null | undefined,
) {
  const trimmedCanonical = canonicalUrl?.trim()

  if (trimmedCanonical) {
    return /^https?:\/\//i.test(trimmedCanonical)
      ? trimmedCanonical
      : buildAbsoluteUrl(trimmedCanonical)
  }

  if (!path) return undefined
  return buildLocalizedAbsoluteUrl(locale, path)
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
}: {
  locale: SupportedLocale
  settings: SeoSetting | null | undefined
  target: SeoTarget
  path?: string | null
  alternates?: SeoAlternates
}): Metadata {
  const title = resolveTitle(target.title, settings)
  const description = resolveDescription(target.description, settings)
  const canonical = resolveCanonicalUrl(locale, path, target.canonicalUrl)
  const robots = resolveRobots(settings, target.noIndex, target.noFollow)
  const ogImage = getMediaUrl(target.image) || getMediaUrl(settings?.defaultOgImage)

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        Object.entries(alternates || {}).flatMap(([altLocale, altPath]) => {
          if (!altPath) return []
          return [[altLocale, buildLocalizedPath(altLocale, altPath)]]
        }),
      ),
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

