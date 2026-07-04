import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

const SUPPORTED_LOCALES = ['es', 'en', 'uk'] as const

function resolveRevalidationBaseUrl() {
  const raw =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    'http://localhost:3000'

  if (/^https?:\/\//i.test(raw)) {
    return raw.replace(/\/+$/, '')
  }

  if (raw.includes('localhost') || raw.startsWith('127.0.0.1')) {
    return `http://${raw}`.replace(/\/+$/, '')
  }

  return `https://${raw}`.replace(/\/+$/, '')
}

function getRevalidationSecret() {
  return process.env.REVALIDATE_SECRET?.trim() || process.env.PAYLOAD_SECRET?.trim() || ''
}

async function triggerRevalidation(tags: string[]) {
  const secret = getRevalidationSecret()

  if (!secret) {
    console.warn('Skipping cache revalidation: missing REVALIDATE_SECRET/PAYLOAD_SECRET')
    return
  }

  try {
    const response = await fetch(`${resolveRevalidationBaseUrl()}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({ tags }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      console.error(`Cache revalidation failed with status ${response.status}: ${body}`)
    }
  } catch (error) {
    console.error('Cache revalidation request failed:', error)
  }
}

function getLocalizedTags(prefix: string) {
  return SUPPORTED_LOCALES.map((locale) => `${prefix}:${locale}`)
}

export function createPageRevalidationHooks() {
  const tags = [
    ...getLocalizedTags('public-pages'),
    ...getLocalizedTags('public-page-path-entries'),
    ...getLocalizedTags('public-services-page'),
    ...getLocalizedTags('not-found-page-block'),
  ]

  const afterChange: CollectionAfterChangeHook = async () => {
    await triggerRevalidation(tags)
  }

  const afterDelete: CollectionAfterDeleteHook = async () => {
    await triggerRevalidation(tags)
  }

  return { afterChange, afterDelete }
}

export function createServiceRevalidationHooks() {
  const tags = [
    ...getLocalizedTags('public-services'),
    ...getLocalizedTags('public-service-path-entries'),
    ...getLocalizedTags('public-services-page'),
  ]

  const afterChange: CollectionAfterChangeHook = async () => {
    await triggerRevalidation(tags)
  }

  const afterDelete: CollectionAfterDeleteHook = async () => {
    await triggerRevalidation(tags)
  }

  return { afterChange, afterDelete }
}

export function createGlobalRevalidationHook(tags: string[]): GlobalAfterChangeHook {
  return async () => {
    await triggerRevalidation(tags)
  }
}
