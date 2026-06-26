import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { PageContent } from '../page-content'
import { ServiceDetailPageContent } from '../services/[slug]/page-content'
import { ServicesListingPageContent } from '../services/page-content'

export default async function LocalizedPageRouter({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}) {
  const { locale, slug = [] } = await params

  if (slug.length === 0) {
    return PageContent({ locale, slug: 'home' })
  }

  const payload = await getPayload({ config: configPromise })
  const pageResult = await payload.find({
    collection: 'pages',
    locale: locale as 'es' | 'en' | 'uk',
    fallbackLocale: false,
    depth: 1,
    where: {
      path: {
        equals: slug[0],
      },
    },
    limit: 1,
  })

  const page = pageResult.docs[0]
  if (!page) {
    return notFound()
  }

  if (page.slug === 'services') {
    if (slug.length === 1) {
      return ServicesListingPageContent({ locale })
    }

    if (slug.length === 2) {
      return ServiceDetailPageContent({ locale, slug: slug[1] })
    }

    return notFound()
  }

  if (slug.length > 1) {
    return notFound()
  }

  return PageContent({ locale, path: slug[0] })
}
