import type { Metadata } from 'next'
import FrontendNotFound from '@/components/FrontendNotFound'
import { getNotFoundPageBlock } from '@/lib/not-found-page'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale: string }>
}) {
  const resolvedParams = params ? await params : null
  const locale =
    resolvedParams?.locale === 'en' || resolvedParams?.locale === 'uk' || resolvedParams?.locale === 'es'
      ? resolvedParams.locale
      : 'es'

  const { contentImageBlock } = await getNotFoundPageBlock(locale)

  if (contentImageBlock) {
    return (
      <FrontendNotFound
        locale={locale as 'es' | 'en' | 'uk'}
        splitContent={{
          title: contentImageBlock.title || null,
          content: contentImageBlock.text,
          image: contentImageBlock.image,
          position: contentImageBlock.position,
          imageWidth: contentImageBlock.imageWidth,
          buttonText: contentImageBlock.buttonText,
          buttonLink: contentImageBlock.buttonLink,
        }}
      />
    )
  }

  return <FrontendNotFound locale={locale as 'es' | 'en' | 'uk'} />
}
