import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { buildLocalizedPath, DEFAULT_LOCALE, detectLocaleFromPathname, stripLocalePrefix, SUPPORTED_LOCALES } from '@/lib/localizedRouting'

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
    const payload = await getPayload({ config: configPromise })

    const pagesResult = await payload.find({
      collection: 'pages',
      locale: currentLocale,
      fallbackLocale: false,
      select: {
        slug: true,
        path: true,
      },
      where: {
        path: {
          equals: segments[0],
        },
      },
      limit: 1,
    })

    const page = pagesResult.docs[0]
    if (!page) {
      return buildResponse(links)
    }

    if (page.slug === 'services') {
      let currentServiceSlug: string | null = null

      if (segments.length > 1) {
        const currentServiceResult = await payload.find({
          collection: 'services',
          locale: currentLocale,
          fallbackLocale: false,
          select: {
            slug: true,
          },
          where: {
            path: {
              equals: segments[1],
            },
          },
          limit: 1,
        })

        currentServiceSlug = currentServiceResult.docs[0]?.slug || null
      }

      const localizedPages = await Promise.all(
        SUPPORTED_LOCALES.map((locale) =>
          payload.find({
          collection: 'pages',
          locale,
          fallbackLocale: false,
          select: {
            path: true,
          },
          where: {
            slug: {
              equals: 'services',
            },
          },
          limit: 1,
          }),
        ),
      )

      for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
        const servicesPage = localizedPages[index]?.docs[0]
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
          SUPPORTED_LOCALES.map((locale) =>
            payload.find({
              collection: 'services',
              locale,
              fallbackLocale: false,
              select: {
                path: true,
              },
              where: {
                slug: {
                  equals: currentServiceSlug,
                },
              },
              limit: 1,
            }),
          ),
        )

        for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
          const servicesPage = localizedPages[index]?.docs[0]
          const service = localizedServices[index]?.docs[0]
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
      SUPPORTED_LOCALES.map((locale) =>
        payload.find({
        collection: 'pages',
        locale,
        fallbackLocale: false,
        select: {
          path: true,
        },
        where: {
          slug: {
            equals: page.slug,
          },
        },
        limit: 1,
        }),
      ),
    )

    for (const [index, locale] of SUPPORTED_LOCALES.entries()) {
      const translatedPage = localizedPages[index]?.docs[0]
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
