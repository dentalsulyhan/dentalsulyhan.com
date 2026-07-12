import iconFamilies from '@fortawesome/fontawesome-free/metadata/icon-families.json'
import type { Field } from 'payload'

type LocalizedLabel = {
  en: string
  es: string
  uk: string
}

type FontAwesomeStyle = 'brands' | 'regular' | 'solid'

type FontAwesomeMetadataEntry = {
  familyStylesByLicense?: {
    free?: Array<{
      family: string
      style: string
    }>
  }
  label?: string
  search?: {
    terms?: string[]
  }
  svgs?: Record<
    string,
    Record<
      string,
      {
        raw: string
        viewBox: number[]
      }
    >
  >
}

export type FontAwesomeIconOption = {
  label: string
  searchText: string
  style: FontAwesomeStyle
  title: string
  value: string
}

type FontAwesomeSvgEntry = { raw: string }

const STYLE_LABELS: Record<FontAwesomeStyle, LocalizedLabel> = {
  brands: {
    en: 'Brands',
    es: 'Marcas',
    uk: 'Бренди',
  },
  regular: {
    en: 'Regular',
    es: 'Regular',
    uk: 'Regular',
  },
  solid: {
    en: 'Solid',
    es: 'Solid',
    uk: 'Solid',
  },
}

const STYLE_ORDER: FontAwesomeStyle[] = ['solid', 'regular', 'brands']

const iconMetadata = iconFamilies as unknown as Record<string, FontAwesomeMetadataEntry>

function titleCaseFromSlug(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildFreeIconData() {
  const options: FontAwesomeIconOption[] = []
  const svgMap: Record<string, FontAwesomeSvgEntry> = {}

  for (const [iconName, iconEntry] of Object.entries(iconMetadata)) {
    const freeVariants = iconEntry.familyStylesByLicense?.free || []

    for (const variant of freeVariants) {
      if (variant.family !== 'classic') {
        continue
      }

      if (!STYLE_ORDER.includes(variant.style as FontAwesomeStyle)) {
        continue
      }

      const style = variant.style as FontAwesomeStyle
      const svg = iconEntry.svgs?.[variant.family]?.[variant.style]

      if (!svg?.raw) {
        continue
      }

      const value = `${style}:${iconName}`
      const title = iconEntry.label?.trim() || titleCaseFromSlug(iconName)
      const searchTerms = iconEntry.search?.terms?.join(' ') || ''

      options.push({
        label: `${title} (${style})`,
        searchText: `${title} ${iconName.replaceAll('-', ' ')} ${style} ${searchTerms}`.toLowerCase(),
        style,
        title,
        value,
      })

      svgMap[value] = {
        raw: svg.raw,
      }
    }
  }

  options.sort((a, b) => {
    const styleOrderDifference = STYLE_ORDER.indexOf(a.style) - STYLE_ORDER.indexOf(b.style)

    if (styleOrderDifference !== 0) {
      return styleOrderDifference
    }

    return a.title.localeCompare(b.title)
  })

  return { options, svgMap }
}

const { options: freeIconOptions, svgMap: freeIconSvgMap } = buildFreeIconData()

export const FONT_AWESOME_ICON_OPTIONS = freeIconOptions

export const FONT_AWESOME_STYLE_OPTIONS = STYLE_ORDER.map((style) => ({
  label: STYLE_LABELS[style],
  value: style,
}))

export function normalizeFontAwesomeIconValue(icon: string | null | undefined) {
  const normalized = icon?.trim()

  if (!normalized) {
    return null
  }

  if (normalized.includes(':')) {
    return normalized
  }

  const fallback = `solid:${normalized}`
  return freeIconSvgMap[fallback] ? fallback : normalized
}

export function getFontAwesomeIconSvg(icon: string | null | undefined) {
  const normalized = normalizeFontAwesomeIconValue(icon)
  return normalized ? freeIconSvgMap[normalized] || null : null
}

export function getSizedFontAwesomeIconMarkup(icon: string | null | undefined, size: number) {
  const svg = getFontAwesomeIconSvg(icon)

  if (!svg) {
    return null
  }

  return svg.raw.replace(
    '<svg ',
    `<svg width="${size}" height="${size}" style="display:block" `,
  )
}

export function buildIconChoiceFields({
  localized,
}: {
  localized?: boolean
} = {}): Field[] {
  const sharedLocalized = localized === undefined ? {} : { localized }

  return [
    {
      name: 'iconSource',
      type: 'select',
      hidden: true,
      defaultValue: 'upload',
      options: [
        {
          value: 'upload',
          label: {
            en: 'Upload icon',
            uk: 'Завантажити іконку',
            es: 'Subir icono',
          },
        },
        {
          value: 'fontAwesome',
          label: {
            en: 'Font Awesome',
            uk: 'Font Awesome',
            es: 'Font Awesome',
          },
        },
      ],
      label: {
        en: 'Icon Source',
        uk: 'Джерело іконки',
        es: 'Fuente del icono',
      },
      ...sharedLocalized,
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Icon',
        uk: 'Іконка',
        es: 'Icono',
      },
      ...sharedLocalized,
    },
    {
      name: 'fontAwesomeIcon',
      type: 'text',
      label: {
        en: 'Font Awesome Icon',
        uk: 'Іконка Font Awesome',
        es: 'Icono de Font Awesome',
      },
      admin: {
        components: {
          Field: '/components/admin/FontAwesomeIconPicker#FontAwesomeIconPicker',
        },
      },
      ...sharedLocalized,
    },
  ]
}
