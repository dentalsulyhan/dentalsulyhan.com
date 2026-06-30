'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getTrackedHrefType, pushAnalyticsEvent } from '@/lib/analytics'

type AnalyticsListenerProps = {
  locale: string
}

function getElementText(element: HTMLElement) {
  return (
    element.getAttribute('aria-label') ||
    element.getAttribute('title') ||
    element.textContent ||
    ''
  ).trim()
}

function shouldIgnoreElement(element: HTMLElement) {
  return Boolean(element.closest('[data-analytics-ignore="true"]'))
}

export default function AnalyticsListener({ locale }: AnalyticsListenerProps) {
  const pathname = usePathname()

  useEffect(() => {
    pushAnalyticsEvent({
      event: 'page_view',
      locale,
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href,
    })
  }, [locale, pathname])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return

      const element = target.closest('a,button')
      if (!(element instanceof HTMLElement)) return
      if (shouldIgnoreElement(element)) return

      const tagName = element.tagName.toLowerCase()
      const href = element instanceof HTMLAnchorElement ? element.getAttribute('href') : null
      const type = getTrackedHrefType(href)

      if (tagName === 'button') {
        const buttonType = element.getAttribute('type') || 'button'
        if (buttonType === 'submit' && element.closest('form')) {
          return
        }
      }

      if (type === 'phone') {
        pushAnalyticsEvent({
          event: 'click_phone',
          locale,
          phone_number: href?.replace(/^tel:/i, '') || undefined,
          link_text: getElementText(element),
          page_path: window.location.pathname,
        })
        return
      }

      if (type === 'email') {
        pushAnalyticsEvent({
          event: 'click_email',
          locale,
          email_address: href?.replace(/^mailto:/i, '') || undefined,
          link_text: getElementText(element),
          page_path: window.location.pathname,
        })
        return
      }

      if (type === 'whatsapp') {
        pushAnalyticsEvent({
          event: 'click_whatsapp',
          locale,
          link_text: getElementText(element),
          link_url: href || undefined,
          page_path: window.location.pathname,
        })
        return
      }

      if (type === 'telegram') {
        pushAnalyticsEvent({
          event: 'click_telegram',
          locale,
          link_text: getElementText(element),
          link_url: href || undefined,
          page_path: window.location.pathname,
        })
        return
      }

      pushAnalyticsEvent({
        event: 'site_click',
        locale,
        link_type: type,
        link_text: getElementText(element),
        link_url: href || undefined,
        page_path: window.location.pathname,
      })
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [locale])

  return null
}
