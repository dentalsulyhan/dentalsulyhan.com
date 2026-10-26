import { LinkJSXConverter, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { buildLocalizedPath } from '@/lib/localizedRouting'

type RichTextLinkOptions = {
  locale: string
  servicesPagePath?: string
}

type InternalLinkDocument = {
  path?: string | null
  slug?: string | null
}

type InternalLinkNode = {
  fields?: {
    doc?: {
      relationTo?: string | null
      value?: InternalLinkDocument | number | string | null
    }
  }
}

/**
 * Resolves Payload Lexical Internal Link documents to the public, localized URL.
 * The linked document is populated by Payload when Rich Text is fetched with depth.
 */
export function createRichTextLinkConverters({
  locale,
  servicesPagePath = '/services',
}: RichTextLinkOptions): JSXConvertersFunction {
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => {
        const internalLink = linkNode as InternalLinkNode
        const document = internalLink.fields?.doc?.value
        const relationTo = internalLink.fields?.doc?.relationTo

        if (!document || typeof document !== 'object') return '#'

        const path = document.path || document.slug
        if (!path) return '#'

        if (relationTo === 'pages') {
          return buildLocalizedPath(locale, document.slug === 'home' ? '/' : `/${path}`)
        }

        if (relationTo === 'services') {
          return buildLocalizedPath(locale, `${servicesPagePath}/${path}`)
        }

        return buildLocalizedPath(locale, `/${path}`)
      },
    }),
  })
}
