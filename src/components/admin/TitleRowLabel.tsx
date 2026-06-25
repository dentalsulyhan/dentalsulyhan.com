'use client'

import { useRowLabel } from '@payloadcms/ui'

type RowLabelData = {
  label?: string | Record<string, unknown>
  name?: string | Record<string, unknown>
  platform?: string | Record<string, unknown>
  serviceName?: string | Record<string, unknown>
  sectionTitle?: string | Record<string, unknown>
  heading?: string | Record<string, unknown>
  title?: string | Record<string, unknown>
  link?: string
  text?: string | Record<string, unknown>
  leftColumnTitle?: string | Record<string, unknown>
  rightColumnTitle?: string | Record<string, unknown>
}

function extractLabel(value: unknown): string {
  if (typeof value === 'string') return value.trim()

  if (value && typeof value === 'object') {
    const firstString = Object.values(value).find((item) => typeof item === 'string' && item.trim())
    if (typeof firstString === 'string') return firstString.trim()
  }

  return ''
}

export function TitleRowLabel() {
  const { data, rowNumber } = useRowLabel<RowLabelData>()
  const label = extractLabel(data?.label)
  const name = extractLabel(data?.name)
  const serviceName = extractLabel(data?.serviceName)
  const sectionTitle = extractLabel(data?.sectionTitle)
  const title = extractLabel(data?.title)
  const text = extractLabel(data?.text)
  const heading = extractLabel(data?.heading)
  const platform = extractLabel(data?.platform)
  const leftColumnTitle = extractLabel(data?.leftColumnTitle)
  const rightColumnTitle = extractLabel(data?.rightColumnTitle)
  const link = typeof data?.link === 'string' ? data.link.trim() : ''

  if (label) {
    return <span>{label}</span>
  }

  if (name) {
    return <span>{name}</span>
  }

  if (serviceName) {
    return <span>{serviceName}</span>
  }

  if (sectionTitle) {
    return <span>{sectionTitle}</span>
  }

  if (title) {
    return <span>{title}</span>
  }

  if (text) {
    return <span>{text.slice(0, 48)}{text.length > 48 ? '…' : ''}</span>
  }

  if (heading) {
    return <span>{heading}</span>
  }

  if (platform) {
    return <span>{platform}</span>
  }

  if (leftColumnTitle) {
    return <span>{leftColumnTitle}</span>
  }

  if (rightColumnTitle) {
    return <span>{rightColumnTitle}</span>
  }

  if (link) {
    return <span>{link}</span>
  }

  return <span>{`Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}

export default TitleRowLabel
