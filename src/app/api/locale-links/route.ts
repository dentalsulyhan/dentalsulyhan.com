import { NextResponse } from 'next/server'
import { buildLocalizedPath, DEFAULT_LOCALE, detectLocaleFromPathname, stripLocalePrefix, SUPPORTED_LOCALES } from '@/lib/localizedRouting'
import { getCachedPagePathEntries, getCachedServicePathEntries } from '@/lib/publicData'

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
    const currentLocalePages = await getCachedPagePathEntries(currentLocale)
    const page = currentLocalePages.find((entry) => entry.path === segments[0])
    if (!page) {
      return buildResponse(links)
    }

    if (page.slug === 'services') {
      let currentServiceSlug: string | null = null

      if (segments.length > 1) {
        const currentLocaleServices = await getCachedServicePathEntries(currentLocale)
        currentServiceSlug = currentLocaleServices.find((entry) => entry.path === segments[1])?.slug || null
      }

      const localizedPages = await Promise.all(
        SUPPORTED_LOCALES.map((locale) => getCachedPagePathEntries(locale)),
      )

      for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
        const servicesPage = localizedPages[index]?.find((entry) => entry.slug === 'services')
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

        for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
          const servicesPage = localizedPages[index]?.find((entry) => entry.slug === 'services')
          const service = localizedServices[index]?.find((entry) => entry.slug === currentServiceSlug)
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

    const localizedPages = await Promise.all(
      SUPPORTED_LOCALES.map((locale) => getCachedPagePathEntries(locale)),
    )

    for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
      const translatedPage = localizedPages[index]?.find((entry) => entry.slug === page.slug)
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
