type AnalyticsEvent = Record<string, unknown> & {
  event: string
}

declare global {
  interface Window {
    dataLayer?: AnalyticsEvent[]
  }
}

export function pushAnalyticsEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

export function getTrackedHrefType(href: string | null | undefined) {
  if (!href) return 'button'
  if (href.startsWith('tel:')) return 'phone'
  if (href.startsWith('mailto:')) return 'email'
  if (href.includes('wa.me')) return 'whatsapp'
  if (href.includes('t.me')) return 'telegram'
  if (href.startsWith('#')) return 'anchor'
  if (/^https?:\/\//i.test(href)) return 'external'
  return 'internal'
}

