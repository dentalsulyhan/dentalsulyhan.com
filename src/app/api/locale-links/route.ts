import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { buildLocalizedPath, DEFAULT_LOCALE, detectLocaleFromPathname, stripLocalePrefix, SUPPORTED_LOCALES } from '@/lib/localizedRouting'

function getDefaultLinks() {
  return {
    es: '/',
    en: '/en',
    uk: '/uk',
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
      return NextResponse.json({ links, defaultLocale: DEFAULT_LOCALE })
    }

    const currentLocale = detectLocaleFromPathname(rawPath)
    const payload = await getPayload({ config: configPromise })

    const pagesResult = await payload.find({
      collection: 'pages',
      locale: currentLocale,
      fallbackLocale: false,
      where: {
        path: {
          equals: segments[0],
        },
      },
      limit: 1,
    })

    const page = pagesResult.docs[0]
    if (!page) {
      return NextResponse.json({ links, defaultLocale: DEFAULT_LOCALE })
    }

    if (page.slug === 'services') {
      let currentServiceSlug: string | null = null

      if (segments.length > 1) {
        const currentServiceResult = await payload.find({
          collection: 'services',
          locale: currentLocale,
          fallbackLocale: false,
          where: {
            path: {
              equals: segments[1],
            },
          },
          limit: 1,
        })

        currentServiceSlug = currentServiceResult.docs[0]?.slug || null
      }

      for (const locale of SUPPORTED_LOCALES) {
        const localizedPage = await payload.find({
          collection: 'pages',
          locale,
          fallbackLocale: false,
          where: {
            slug: {
              equals: 'services',
            },
          },
          limit: 1,
        })

        const servicesPage = localizedPage.docs[0]
        const servicesPath = `/${servicesPage?.path || 'services'}`

        if (segments.length === 1) {
          links[locale] = buildLocalizedPath(locale, servicesPath)
          continue
        }

        if (!currentServiceSlug) {
          continue
        }

        const serviceResult = await payload.find({
          collection: 'services',
          locale,
          fallbackLocale: false,
          where: {
            slug: {
              equals: currentServiceSlug,
            },
          },
          limit: 1,
        })

        const service = serviceResult.docs[0]
        if (service?.path) {
          links[locale] = buildLocalizedPath(locale, `${servicesPath}/${service.path}`)
        }
      }

      return NextResponse.json({ links, defaultLocale: DEFAULT_LOCALE })
    }

    if (page.slug === 'home') {
      return NextResponse.json({ links, defaultLocale: DEFAULT_LOCALE })
    }

    for (const locale of SUPPORTED_LOCALES) {
      const localizedPage = await payload.find({
        collection: 'pages',
        locale,
        fallbackLocale: false,
        where: {
          slug: {
            equals: page.slug,
          },
        },
        limit: 1,
      })

      const translatedPage = localizedPage.docs[0]
      if (translatedPage?.path) {
        links[locale] = buildLocalizedPath(locale, `/${translatedPage.path}`)
      }
    }

    return NextResponse.json({ links, defaultLocale: DEFAULT_LOCALE })
  } catch (error) {
    console.error('Error building locale links:', error)
    return NextResponse.json({ links: getDefaultLinks(), defaultLocale: DEFAULT_LOCALE })
  }
}
