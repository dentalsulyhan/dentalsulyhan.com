import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media, Page } from '@/payload-types'

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
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    ...(locale ? { locale } : {}),
    fallbackLocale: ['es', 'en', 'uk'],
    depth: 1,
    where: {
      slug: {
        equals: '404',
      },
    },
    limit: 1,
  })

  const pageData = (result.docs[0] as Page | undefined) || null
  const contentImageBlock = pageData?.layout?.find(isContentImageBlock) || null

  return {
    locale: locale || 'es',
    pageData,
    contentImageBlock,
  }
}
