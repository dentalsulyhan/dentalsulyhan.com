import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/localizedRouting'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const headers = new Headers(request.headers)

  if (
    pathname.includes('.') ||
    pathname.startsWith('/.well-known/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/fonts/')
  ) {
    return
  }

  const matchedLocale = SUPPORTED_LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )

  if (matchedLocale === DEFAULT_LOCALE) {
    const strippedPath = pathname.replace(/^\/es(?=\/|$)/, '') || '/'
    const redirectURL = new URL(strippedPath, request.url)
    redirectURL.search = request.nextUrl.search
    return NextResponse.redirect(redirectURL)
  }

  if (matchedLocale) {
    headers.set('x-sulyhan-locale', matchedLocale)
    return NextResponse.next({
      request: {
        headers,
      },
    })
  }

  headers.set('x-sulyhan-locale', DEFAULT_LOCALE)

  const rewriteURL = request.nextUrl.clone()
  rewriteURL.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`

  return NextResponse.rewrite(rewriteURL, {
    request: {
      headers,
    },
  })
}

export const config = {
  matcher: ['/((?!_next|admin|api|favicon.ico|\\.well-known).*)'],
}
