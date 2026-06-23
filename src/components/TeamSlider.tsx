'use client'

import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { RichText } from '@payloadcms/richtext-lexical/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import type { TeamMember, Media } from '@/payload-types'

function mediaUrl(field: unknown): string | null {
  if (!field) return null
  if (typeof field === 'object' && field !== null && 'url' in field) {
    return (field as Media).url ?? null
  }
  return null
}

interface TeamSliderProps {
  members: TeamMember[]
}

export default function TeamSlider({ members }: TeamSliderProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="grid grid-cols-4 max-[991px]:grid-cols-3 max-[767px]:grid-cols-2 max-[567px]:grid-cols-1 gap-[30px]">
        {members.slice(0, 4).map((member) => {
          const photoUrl = mediaUrl(member.photo)
          return (
            <div key={member.id} className="rounded-[20px] overflow-hidden flex flex-col">
              <div className="relative h-[400px] max-[767px]:h-[280px]">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-[#e8e0d8] rounded-[20px] flex items-center justify-center text-[#909da2]">
                    Photo
                  </div>
                )}
              </div>
              <div className="p-[10px_20px] flex flex-col">
                <span className="font-semibold text-[16px] text-[#22282b]">{member.name}</span>
                {member.description && (
                  <div className="text-[14px] text-[#22282b] mt-1 prose max-w-none prose-p:my-0">
                    {typeof member.description === 'string' ? <p>{member.description}</p> : <RichText data={member.description} />}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      direction="horizontal"
      loop={members.length > 4}
      speed={600}
      slidesPerView={1.5}
      centeredSlides
      spaceBetween={30}
      pagination={{
        el: '.team-pagination-custom',
        clickable: true,
      }}
      navigation={{
        nextEl: '.team-btn-next',
        prevEl: '.team-btn-prev',
      }}
      breakpoints={{
        568: { slidesPerView: 2, centeredSlides: false },
        767: { slidesPerView: 3, centeredSlides: false, spaceBetween: 20 },
        991: { slidesPerView: 4, centeredSlides: false, spaceBetween: 24 },
      }}
    >
      {members.map((member) => {
        const photoUrl = mediaUrl(member.photo)
        const hoverUrl = mediaUrl(member.photoHover)
        return (
          <SwiperSlide key={member.id}>
            <div className="group rounded-[20px] overflow-hidden flex flex-col">
              {/* Photo container */}
              <div className="relative h-[400px] max-[767px]:h-[280px]">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-[#e8e0d8] rounded-[20px] flex items-center justify-center text-[#909da2]">
                    Photo
                  </div>
                )}
                {hoverUrl && (
                  <img
                    src={hoverUrl}
                    alt={`${member.name} hover`}
                    className="absolute inset-0 w-full h-full object-cover rounded-[20px] opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-500 ease-in-out z-[2]"
                  />
                )}
              </div>
              {/* Info */}
              <div className="p-[10px_20px] z-[1] flex flex-col">
                <span className="font-semibold text-[16px] text-[#22282b]">{member.name}</span>
                {member.description && (
                  <div className="text-[14px] text-[#22282b] mt-1 prose max-w-none prose-p:my-0">
                    {typeof member.description === 'string' ? <p>{member.description}</p> : <RichText data={member.description} />}
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        )
      })}

      {/* Custom pagination & navigation */}
      <div className="team-pagination-custom mt-8 flex justify-center" />
      <button className="team-btn-prev absolute left-4 top-1/2 -translate-y-1/2 z-[9] w-[50px] h-[50px] flex items-center justify-center bg-white/60 rounded-full backdrop-blur-sm hover:bg-white/80 transition-colors max-[767px]:w-[40px] max-[767px]:h-[40px] max-[767px]:left-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#22282b]">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="team-btn-next absolute right-4 top-1/2 -translate-y-1/2 z-[9] w-[50px] h-[50px] flex items-center justify-center bg-white/60 rounded-full backdrop-blur-sm hover:bg-white/80 transition-colors max-[767px]:w-[40px] max-[767px]:h-[40px] max-[767px]:right-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#22282b]">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </Swiper>
  )
}
