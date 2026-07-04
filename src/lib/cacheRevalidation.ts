import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

const SUPPORTED_LOCALES = ['es', 'en', 'uk'] as const

async function triggerRevalidation(tags: string[], paths: string[] = []) {
  try {
    for (const tag of [...new Set(tags)]) {
      revalidateTag(tag, 'max')
    }

    for (const path of [...new Set(paths)]) {
      revalidatePath(path, 'layout')
    }
  } catch (error) {
    console.error('Cache revalidation failed:', error)
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
  const paths = ['/', '/en', '/uk']

  const afterChange: CollectionAfterChangeHook = async () => {
    await triggerRevalidation(tags, paths)
  }

  const afterDelete: CollectionAfterDeleteHook = async () => {
    await triggerRevalidation(tags, paths)
  }

  return { afterChange, afterDelete }
}

export function createServiceRevalidationHooks() {
  const tags = [
    ...getLocalizedTags('public-services'),
    ...getLocalizedTags('public-service-path-entries'),
    ...getLocalizedTags('public-services-page'),
  ]
  const paths = ['/', '/en', '/uk']

  const afterChange: CollectionAfterChangeHook = async () => {
    await triggerRevalidation(tags, paths)
  }

  const afterDelete: CollectionAfterDeleteHook = async () => {
    await triggerRevalidation(tags, paths)
  }

  return { afterChange, afterDelete }
}

export function createGlobalRevalidationHook(tags: string[], paths: string[] = []): GlobalAfterChangeHook {
  return async () => {
    await triggerRevalidation(tags, paths)
  }
}
