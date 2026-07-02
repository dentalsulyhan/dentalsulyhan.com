import { revalidateTag } from 'next/cache'

const SUPPORTED_LOCALES = ['es', 'en', 'uk'] as const

function revalidateTags(tags: string[]) {
  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }
}

export function revalidatePageContent() {
  revalidateTags(
    SUPPORTED_LOCALES.flatMap((locale) => [
      `public-pages:${locale}`,
      `public-page-path-entries:${locale}`,
      `not-found-page-block:${locale}`,
      `public-services-page:${locale}`,
    ]),
  )
}

export function revalidateServiceContent() {
  revalidateTags(
    SUPPORTED_LOCALES.flatMap((locale) => [
      `public-services:${locale}`,
      `public-service-path-entries:${locale}`,
    ]),
  )
}

export function revalidateSiteChrome() {
  revalidateTags(
    SUPPORTED_LOCALES.flatMap((locale) => [
      `public-site-settings:${locale}`,
      `public-header-footer:${locale}`,
      `public-site-contacts:${locale}`,
      `public-design-settings:${locale}`,
    ]),
  )
}

export function revalidateSeoContent() {
  revalidateTags(
    SUPPORTED_LOCALES.flatMap((locale) => [`public-seo-settings:${locale}`]).concat(['configured-site-url']),
  )
}

export function revalidateHomePageContent() {
  revalidateTags(
    SUPPORTED_LOCALES.flatMap((locale) => [
      `public-home-page:${locale}`,
      `public-pages:${locale}`,
      `public-page-path-entries:${locale}`,
    ]),
  )
}

export function revalidateTeamContent() {
  revalidateTags(SUPPORTED_LOCALES.map((locale) => `public-team-members:${locale}`))
}

export function revalidatePromotionContent() {
  revalidateTags(SUPPORTED_LOCALES.map((locale) => `public-promotions:${locale}`))
}
