'use client'

import dynamic from 'next/dynamic'

const GoogleReviews = dynamic(() => import('./GoogleReviews'), {
  ssr: false,
  loading: () => <div className="min-h-[280px] w-full rounded-[28px] border border-[#22282b]/10 bg-white" aria-hidden="true" />,
})

export default function LazyGoogleReviews({
  desktopSlides,
  locale,
  summaryTitle,
  reviewsLabel,
  writeReviewLabel,
  writeReviewLink,
}: {
  desktopSlides?: number
  locale?: 'es' | 'en' | 'uk'
  summaryTitle?: string | null
  reviewsLabel?: string | null
  writeReviewLabel?: string | null
  writeReviewLink?: string | null
}) {
  return (
    <GoogleReviews
      desktopSlides={desktopSlides}
      locale={locale}
      summaryTitle={summaryTitle}
      reviewsLabel={reviewsLabel}
      writeReviewLabel={writeReviewLabel}
      writeReviewLink={writeReviewLink}
    />
  )
}
