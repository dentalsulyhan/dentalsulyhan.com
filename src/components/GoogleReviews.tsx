'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type Locale = 'es' | 'en' | 'uk'

type ReviewItem = {
  id: string
  author?: {
    name?: string | null
    avatarUrl?: string | null
    profileUrl?: string | null
  } | null
  text?: string | null
  originalText?: string | null
  languageCode?: string | null
  rating?: {
    value?: number | null
    max?: number | null
  } | null
  publishedAt?: string | null
  updatedAt?: string | null
}

type WidgetResponse = {
  success: boolean
  widget?: {
    config?: {
      title?: string | null
    }
    reviews?: ReviewItem[]
    gbpLocationSummary?: {
      reviewsCount?: number
      rating?: number
      writeAReviewUri?: string | null
    }
  }
}

const FEATURABLE_ID = '085c3d78-9394-4d4f-8aa3-c9488d6086c7'

const copy: Record<
  Locale,
  {
    writeReview: string
    googleReviews: string
    loading: string
    error: string
    anonymous: string
    noText: string
  }
> = {
  es: {
    writeReview: 'Escribir reseña',
    googleReviews: 'reseñas en Google',
    loading: 'Cargando reseñas...',
    error: 'No se pudieron cargar las reseñas.',
    anonymous: 'Anónimo',
    noText: 'Sin texto',
  },
  en: {
    writeReview: 'Write a review',
    googleReviews: 'Google reviews',
    loading: 'Loading reviews...',
    error: 'Failed to load reviews.',
    anonymous: 'Anonymous',
    noText: 'No text provided',
  },
  uk: {
    writeReview: 'Залишити відгук',
    googleReviews: 'відгуків у Google',
    loading: 'Завантаження відгуків...',
    error: 'Не вдалося завантажити відгуки.',
    anonymous: 'Анонімно',
    noText: 'Без тексту',
  },
}

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 shrink-0">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.238-2.657-.611-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.238-2.657-.611-3.917z" />
  </svg>
)

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-[#f5b545]' : 'text-[#d6dadd]'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function formatRelativeDate(dateString: string | null | undefined, locale: Locale) {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const day = 1000 * 60 * 60 * 24
  const days = Math.floor(diffMs / day)

  if (days <= 0) {
    return locale === 'uk' ? 'сьогодні' : locale === 'es' ? 'hoy' : 'today'
  }

  if (days < 30) {
    if (locale === 'uk') return `${days} дн. тому`
    if (locale === 'es') return `hace ${days} d`
    return `${days}d ago`
  }

  const months = Math.floor(days / 30)
  if (months < 12) {
    if (locale === 'uk') return `${months} міс. тому`
    if (locale === 'es') return `hace ${months} мес.`
    return `${months}mo ago`
  }

  const years = Math.floor(months / 12)
  if (locale === 'uk') return `${years} р. тому`
  if (locale === 'es') return `hace ${years} a`
  return `${years}y ago`
}

export default function GoogleReviews({
  desktopSlides = 2,
  locale = 'en',
}: {
  desktopSlides?: number
  locale?: Locale
}) {
  const [data, setData] = useState<WidgetResponse['widget'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const t = copy[locale]

  useEffect(() => {
    let cancelled = false

    const loadReviews = async () => {
      try {
        setIsLoading(true)
        setHasError(false)

        const response = await fetch(`https://api.featurable.com/v2/widgets/${FEATURABLE_ID}`, {
          method: 'GET',
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }

        const result = (await response.json()) as WidgetResponse
        if (!cancelled) {
          setData(result.widget || null)
        }
      } catch (error) {
        console.error('Google reviews fetch error:', error)
        if (!cancelled) {
          setHasError(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadReviews()

    return () => {
      cancelled = true
    }
  }, [])

  const reviews = useMemo(() => data?.reviews || [], [data])
  const summary = data?.gbpLocationSummary

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-[#22282b]/10 bg-white px-6 py-10 text-center text-[#6b7478]">
        {t.loading}
      </div>
    )
  }

  if (hasError || !summary || reviews.length === 0) {
    return (
      <div className="rounded-[28px] border border-[#22282b]/10 bg-white px-6 py-10 text-center text-[#6b7478]">
        {t.error}
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="rounded-[24px] border border-[#22282b]/8 bg-[#fbf7f2] px-5 py-5 md:px-7 md:py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[18px] bg-white shadow-[0_8px_20px_rgba(34,40,43,0.05)]">
              <GoogleLogo />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="text-[26px] font-semibold leading-none text-[#22282b]">
                  {summary.rating?.toFixed(1)}
                </span>
                <StarRating rating={Math.round(summary.rating || 5)} />
              </div>
              <p className="text-[14px] leading-relaxed text-[#727c80]">
                {summary.reviewsCount} {t.googleReviews}
              </p>
            </div>
          </div>

          {summary.writeAReviewUri && (
            <a
              href={summary.writeAReviewUri}
              target="_blank"
              rel="noopener noreferrer"
              className="site-button site-button--primary text-center"
            >
              {t.writeReview}
            </a>
          )}
        </div>
      </div>

      <div className="relative px-0 md:px-10">
        <Swiper
          modules={[Navigation, Pagination]}
          direction="horizontal"
          loop={reviews.length > desktopSlides}
          speed={600}
          slidesPerView={1}
          spaceBetween={20}
          pagination={{
            el: '.reviews-pagination',
            clickable: true,
          }}
          navigation={{
            nextEl: '.reviews-btn-next',
            prevEl: '.reviews-btn-prev',
          }}
          breakpoints={{
            640: { slidesPerView: Math.min(2, desktopSlides), spaceBetween: 20 },
            1024: { slidesPerView: Math.min(3, desktopSlides), spaceBetween: 24 },
            1280: { slidesPerView: desktopSlides, spaceBetween: 24 },
          }}
          className="pb-8"
        >
          {reviews.map((review, index) => {
            const authorName = review.author?.name?.trim() || t.anonymous
            const photoUrl = review.author?.avatarUrl || null
            const rating = review.rating?.value || 5
            const comment = review.text?.trim() || review.originalText?.trim() || t.noText
            const publishedAt = formatRelativeDate(review.publishedAt, locale)

            return (
              <SwiperSlide key={review.id || index} className="h-auto">
                <article className="flex h-full flex-col gap-4 rounded-[22px] border border-[#22282b]/8 bg-[#fffdfb] p-5 shadow-[0_10px_24px_rgba(34,40,43,0.04)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={authorName}
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8e0d8] text-[14px] font-semibold text-[#3c5557]">
                          {getInitials(authorName)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-semibold leading-tight text-[#22282b]">
                          {authorName}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <StarRating rating={rating} />
                          {publishedAt && (
                            <span className="text-[12px] text-[#8a9397]">{publishedAt}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <GoogleLogo />
                  </div>

                  <p
                    className="flex-grow whitespace-pre-line text-[14px] leading-[1.68] text-[#586265] overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 7,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {comment}
                  </p>
                </article>
              </SwiperSlide>
            )
          })}
        </Swiper>

        <div className="reviews-pagination flex justify-center mt-1" />

        <button className="reviews-btn-prev absolute left-[-4px] top-[42%] z-[9] flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full border border-[#22282b]/10 bg-white shadow-[0_8px_18px_rgba(34,40,43,0.06)] transition-colors hover:bg-[#f3ece4] max-[767px]:left-[-8px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#5f696d]">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button className="reviews-btn-next absolute right-[-4px] top-[42%] z-[9] flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full border border-[#22282b]/10 bg-white shadow-[0_8px_18px_rgba(34,40,43,0.06)] transition-colors hover:bg-[#f3ece4] max-[767px]:right-[-8px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#5f696d]">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
