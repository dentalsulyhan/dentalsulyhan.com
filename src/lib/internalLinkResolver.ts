import { buildLocalizedPath } from '@/lib/localizedRouting'

type RouteMapValue = {
  path: string
}

type ResolveInternalHrefArgs = {
  link: string | null | undefined
  locale: string
  pagePaths?: Record<string, RouteMapValue>
  servicePaths?: Record<string, RouteMapValue>
  servicesPagePath?: string
}

export function resolveInternalHref({
  link,
  locale,
  pagePaths = {},
  servicePaths = {},
  servicesPagePath = '/services',
}: ResolveInternalHrefArgs) {
  if (!link) return '#'

  const trimmedLink = link.trim()
  if (!trimmedLink) return '#'

  if (
    trimmedLink.startsWith('#') ||
    trimmedLink.startsWith('http://') ||
    trimmedLink.startsWith('https://') ||
    trimmedLink.startsWith('mailto:') ||
    trimmedLink.startsWith('tel:')
  ) {
    return trimmedLink
  }

  if (trimmedLink === '/services') {
    return buildLocalizedPath(locale, servicesPagePath)
  }

  if (trimmedLink.startsWith('/')) {
    return buildLocalizedPath(locale, trimmedLink)
  }

  if (trimmedLink.startsWith('page:')) {
    const pageKey = trimmedLink.slice(5)
    const pagePath = pagePaths[pageKey]?.path
    return pagePath ? buildLocalizedPath(locale, pagePath) : buildLocalizedPath(locale, `/${pageKey}`)
  }

  if (trimmedLink.startsWith('service:')) {
    const serviceKey = trimmedLink.slice(8)
    const servicePath = servicePaths[serviceKey]?.path
    return servicePath
      ? buildLocalizedPath(locale, `${servicesPagePath}/${servicePath}`)
      : buildLocalizedPath(locale, `${servicesPagePath}/${serviceKey}`)
  }

  const pagePath = pagePaths[trimmedLink]?.path
  if (pagePath) {
    return buildLocalizedPath(locale, pagePath)
  }

  const servicePath = servicePaths[trimmedLink]?.path
  if (servicePath) {
    return buildLocalizedPath(locale, `${servicesPagePath}/${servicePath}`)
  }

  return buildLocalizedPath(locale, `/${trimmedLink}`)
}
