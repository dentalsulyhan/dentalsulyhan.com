import Image from 'next/image'
import type { Media } from '@/payload-types'
import { getSizedFontAwesomeIconMarkup } from '@/lib/fontAwesomeIcons'

function mediaUrl(field: unknown): string | null {
  if (!field) return null
  if (typeof field === 'object' && field !== null && 'url' in field) {
    return (field as Media).url ?? null
  }
  return null
}

export default function ContentIcon({
  icon,
  fontAwesomeIcon,
  alt = '',
  size = 50,
  imageClassName,
  iconClassName,
}: {
  icon?: unknown
  fontAwesomeIcon?: string | null
  alt?: string
  size?: number
  imageClassName?: string
  iconClassName?: string
}) {
  const iconUrl = mediaUrl(icon)
  const fontAwesomeMarkup = getSizedFontAwesomeIconMarkup(fontAwesomeIcon, size)

  if (iconUrl) {
    return (
      <Image
        src={iconUrl}
        alt={alt}
        width={size}
        height={size}
        className={imageClassName}
      />
    )
  }

  if (fontAwesomeMarkup) {
    return (
      <span
        aria-hidden="true"
        className={iconClassName}
        style={{
          color: 'currentColor',
          display: 'inline-flex',
          lineHeight: 1,
        }}
        dangerouslySetInnerHTML={{ __html: fontAwesomeMarkup }}
      />
    )
  }

  return null
}
