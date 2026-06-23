import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Наші підтримувані мови
const locales = ['es', 'en', 'uk']
const defaultLocale = 'es'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const headers = new Headers(request.headers)
  
  // Skip static files with extensions and common asset directories
  if (
    pathname.includes('.') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/fonts/')
  ) {
    return
  }
  
  // Перевіряємо, чи є вже мова в URL
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Якщо мови немає і це не адмінка чи API — робимо редирект на /es
  if (pathnameIsMissingLocale && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
  }

  const localeMatch = pathname.match(/^\/(es|en|uk)(?:\/|$)/)
  if (localeMatch) {
    headers.set('x-sulyhan-locale', localeMatch[1])
  }

  return NextResponse.next({
    request: {
      headers,
    },
  })
}

export const config = {
  matcher: [
    // Пропускаємо системні файли Next.js, адмінку Payload та API
    '/((?!_next|admin|api|favicon.ico).*)',
  ],
}
