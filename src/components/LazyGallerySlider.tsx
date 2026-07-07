'use client'

import dynamic from 'next/dynamic'
import type { Media } from '@/payload-types'

const GallerySlider = dynamic(() => import('./GallerySlider'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[320px] w-full bg-[#e8e0d8]" aria-hidden="true" />,
})

export default function LazyGallerySlider({
  images,
}: {
  images: Array<{
    image: number | Media
    id?: string | null
  }>
}) {
  return <GallerySlider images={images} />
}
