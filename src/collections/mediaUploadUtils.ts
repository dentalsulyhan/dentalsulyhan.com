const MEDIA_CATEGORIES = [
  'general',
  'site',
  'services',
  'team',
  'promotions',
  'blog',
  'branding',
] as const

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number]

export const DEFAULT_MEDIA_CATEGORY: MediaCategory = 'general'

export function isMediaCategory(value: unknown): value is MediaCategory {
  return typeof value === 'string' && MEDIA_CATEGORIES.includes(value as MediaCategory)
}

export function buildMediaPrefix(category: MediaCategory, date = new Date()) {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${category}/${year}/${month}`
}

export function normalizeMediaFilename(filename: string, category: MediaCategory) {
  const dotIndex = filename.lastIndexOf('.')
  const rawBase = dotIndex > 0 ? filename.slice(0, dotIndex) : filename
  const rawExtension = dotIndex > 0 ? filename.slice(dotIndex + 1) : ''

  const base = slugify(rawBase) || category
  const extension = slugify(rawExtension).toLowerCase()

  return extension
    ? `${base.slice(0, 60)}.${extension}`
    : `${base.slice(0, 60)}`
}

export function withNumericFilenameSuffix(filename: string, suffix: number) {
  if (suffix < 1) return filename

  const dotIndex = filename.lastIndexOf('.')

  if (dotIndex <= 0) {
    return `${filename}-${suffix}`
  }

  const base = filename.slice(0, dotIndex)
  const extension = filename.slice(dotIndex)

  return `${base}-${suffix}${extension}`
}

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
