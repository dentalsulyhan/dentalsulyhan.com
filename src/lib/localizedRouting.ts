export const SUPPORTED_LOCALES = ['es', 'en', 'uk'] as const
export const DEFAULT_LOCALE = 'es' as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale)
}

export function detectLocaleFromPathname(pathname: string): SupportedLocale {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  return firstSegment && isSupportedLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length > 0 && isSupportedLocale(segments[0])) {
    const remaining = segments.slice(1).join('/')
    return remaining ? `/${remaining}` : '/'
  }

  return pathname || '/'
}

export function normalizePath(path: string): string {
  if (!path || path === '/') return '/'

  const trimmed = path.trim()
  if (!trimmed) return '/'

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return normalized.replace(/\/+$/, '') || '/'
}

export function buildLocalizedPath(locale: string, path: string): string {
  if (!path) return '#'
  if (path.startsWith('#')) return path
  if (/^https?:\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('tel:')) return path

  const normalized = normalizePath(path)

  if (normalized === '/') {
    return locale === DEFAULT_LOCALE ? '/' : `/${locale}`
  }

  return locale === DEFAULT_LOCALE ? normalized : `/${locale}${normalized}`
}

export function getPathSegments(pathname: string): string[] {
  return stripLocalePrefix(pathname)
    .split('/')
    .filter(Boolean)
}
