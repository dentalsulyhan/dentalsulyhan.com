'use client'

import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import type { Media } from '@/payload-types'

function mediaUrl(field: unknown): string | null {
  if (!field) return null
  if (typeof field === 'object' && field !== null && 'url' in field) {
    return (field as Media).url ?? null
  }
  return null
}

interface GallerySliderProps {
  images: Array<{
    image: number | Media
    id?: string | null
  }>
}

export default function GallerySlider({ images }: GallerySliderProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    const firstImg = images[0]
    const url = firstImg ? mediaUrl(firstImg.image) : null
    return (
      <div className="w-full h-full">
        {url ? (
          <img src={url} alt="Gallery fallback" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#e8e0d8] flex items-center justify-center text-[#909da2]">
            Photo 1
          </div>
        )}
      </div>
    )
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      direction="horizontal"
      loop={images.length > 1}
      speed={600}
      slidesPerView={1}
      pagination={{
        el: '.gallery-pagination-custom',
        clickable: true,
      }}
      navigation={{
        nextEl: '.gallery-btn-next',
        prevEl: '.gallery-btn-prev',
      }}
      className="h-full w-full"
    >
      {images.map((item, i) => {
        const url = mediaUrl(item.image)
        return (
          <SwiperSlide key={item.id || i}>
            {url ? (
              <img
                src={url}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#e8e0d8] flex items-center justify-center text-[#909da2]">
                Photo {i + 1}
              </div>
            )}
          </SwiperSlide>
        )
      })}

      {/* Custom pagination & navigation */}
      <div className="gallery-pagination-custom absolute bottom-4 left-0 right-0 flex justify-center z-[9]" />
      <button className="gallery-btn-prev absolute left-4 top-1/2 -translate-y-1/2 z-[9] w-[50px] h-[50px] flex items-center justify-center bg-white/60 rounded-full backdrop-blur-sm hover:bg-white/80 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#22282b]">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="gallery-btn-next absolute right-4 top-1/2 -translate-y-1/2 z-[9] w-[50px] h-[50px] flex items-center justify-center bg-white/60 rounded-full backdrop-blur-sm hover:bg-white/80 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#22282b]">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </Swiper>
  )
}
