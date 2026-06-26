import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { buildLocalizedPath, DEFAULT_LOCALE, detectLocaleFromPathname, stripLocalePrefix, SUPPORTED_LOCALES } from '@/lib/localizedRouting'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawPath = searchParams.get('path') || '/'
  const currentLocale = detectLocaleFromPathname(rawPath)
  const strippedPath = stripLocalePrefix(rawPath)
  const segments = strippedPath.split('/').filter(Boolean)
  const payload = await getPayload({ config: configPromise })

  const links: Record<string, string> = {
    es: '/',
    en: '/en',
    uk: '/uk',
  }

  if (segments.length === 0) {
    return NextResponse.json({ links })
  }

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
    return NextResponse.json({ links })
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

    return NextResponse.json({ links })
  }

  if (page.slug === 'home') {
    return NextResponse.json({ links })
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
}
