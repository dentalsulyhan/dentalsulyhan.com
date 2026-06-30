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

export function normalizeMediaFilename(filename: string, category: MediaCategory, date = new Date()) {
  const dotIndex = filename.lastIndexOf('.')
  const rawBase = dotIndex > 0 ? filename.slice(0, dotIndex) : filename
  const rawExtension = dotIndex > 0 ? filename.slice(dotIndex + 1) : ''

  const base = slugify(rawBase) || category
  const extension = slugify(rawExtension).toLowerCase()
  const timestamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0'),
  ].join('')
  const randomSuffix = Math.random().toString(36).slice(2, 8)

  return extension
    ? `${base.slice(0, 60)}-${timestamp}-${randomSuffix}.${extension}`
    : `${base.slice(0, 60)}-${timestamp}-${randomSuffix}`
}

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
