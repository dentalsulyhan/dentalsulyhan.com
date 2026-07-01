import { unstable_cache } from 'next/cache'
import type { Media, Page } from '@/payload-types'
import { getCachedPageBySlug } from '@/lib/publicData'

export type NotFoundPageBlock = {
  title?: string | null
  content?: unknown
  buttonText?: string | null
  buttonLink?: string | null
  image?: Media | number | null
  position?: 'left' | 'right' | null
  imageWidth?: 'full' | 'contained' | null
}

function isContentImageBlock(
  block: NonNullable<Page['layout']>[number] | undefined,
): block is Extract<NonNullable<Page['layout']>[number], { blockType: 'contentImage' }> {
  return Boolean(block && block.blockType === 'contentImage')
}

export async function getNotFoundPageBlock(locale?: 'es' | 'en' | 'uk') {
  const resolvedLocale = locale || 'es'

  return unstable_cache(
    async () => {
      const pageData = (await getCachedPageBySlug(resolvedLocale, '404', 1).catch(() => null)) as Page | null
      const contentImageBlock = pageData?.layout?.find(isContentImageBlock) || null

      return {
        locale: resolvedLocale,
        pageData,
        contentImageBlock,
      }
    },
    ['not-found-page-block', resolvedLocale],
    {
      revalidate: 300,
      tags: [`not-found-page-block:${resolvedLocale}`],
    },
  )()
}
