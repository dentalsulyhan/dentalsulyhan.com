import { NextResponse } from 'next/server'
import { buildLocalizedPath, DEFAULT_LOCALE, detectLocaleFromPathname, stripLocalePrefix, SUPPORTED_LOCALES } from '@/lib/localizedRouting'
import { getCachedPagePathEntries, getCachedServicePathEntries } from '@/lib/publicData'

export const revalidate = 300

const responseHeaders = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
}

function getDefaultLinks() {
  return {
    es: '/',
    en: '/en',
    uk: '/uk',
  }
}

function buildResponse(links: Record<string, string>) {
  return NextResponse.json({ links, defaultLocale: DEFAULT_LOCALE }, { headers: responseHeaders })
}

function createEntryMap<T extends { slug?: string | null; path?: string | null }>(entries: T[]) {
  return {
    byPath: new Map(entries.filter((entry) => entry.path).map((entry) => [entry.path as string, entry])),
    bySlug: new Map(entries.filter((entry) => entry.slug).map((entry) => [entry.slug as string, entry])),
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawPath = searchParams.get('path') || '/'
    const strippedPath = stripLocalePrefix(rawPath)
    const segments = strippedPath.split('/').filter(Boolean)
    const links: Record<string, string> = getDefaultLinks()

    if (
      segments.length === 0 ||
      rawPath.startsWith('/_next') ||
      rawPath.startsWith('/api') ||
      rawPath.startsWith('/admin') ||
      rawPath.startsWith('/.well-known')
    ) {
      return buildResponse(links)
    }

    const currentLocale = detectLocaleFromPathname(rawPath)
    const localizedPages = await Promise.all(
      SUPPORTED_LOCALES.map((locale) => getCachedPagePathEntries(locale)),
    )
    const pageMaps = localizedPages.map((entries) => createEntryMap(entries))
    const currentLocaleIndex = SUPPORTED_LOCALES.indexOf(currentLocale)
    const currentLocalePages = pageMaps[currentLocaleIndex]
    const page = currentLocalePages?.byPath.get(segments[0])
    if (!page) {
      return buildResponse(links)
    }

    if (page.slug === 'services') {
      let currentServiceSlug: string | null = null

      if (segments.length > 1) {
        const currentLocaleServices = await getCachedServicePathEntries(currentLocale)
        currentServiceSlug = createEntryMap(currentLocaleServices).byPath.get(segments[1])?.slug || null
      }

      for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
        const servicesPage = pageMaps[index]?.bySlug.get('services')
        const servicesPath = `/${servicesPage?.path || 'services'}`

        if (segments.length === 1) {
          links[locale] = buildLocalizedPath(locale, servicesPath)
          continue
        }

        if (!currentServiceSlug) {
          continue
        }
      }

      if (currentServiceSlug && segments.length > 1) {
        const localizedServices = await Promise.all(
          SUPPORTED_LOCALES.map((locale) => getCachedServicePathEntries(locale)),
        )
        const serviceMaps = localizedServices.map((entries) => createEntryMap(entries))

        for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
          const servicesPage = pageMaps[index]?.bySlug.get('services')
          const service = serviceMaps[index]?.bySlug.get(currentServiceSlug)
          const servicesPath = `/${servicesPage?.path || 'services'}`

          if (service?.path) {
            links[locale] = buildLocalizedPath(locale, `${servicesPath}/${service.path}`)
          }
        }
      }

      return buildResponse(links)
    }

    if (page.slug === 'home') {
      return buildResponse(links)
    }

    for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
      const translatedPage = pageMaps[index]?.bySlug.get(page.slug)
      if (translatedPage?.path) {
        links[locale] = buildLocalizedPath(locale, `/${translatedPage.path}`)
      }
    }

    return buildResponse(links)
  } catch (error) {
    console.error('Error building locale links:', error)
    return buildResponse(getDefaultLinks())
  }
}
