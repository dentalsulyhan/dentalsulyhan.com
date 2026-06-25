'use client'

import { useRowLabel } from '@payloadcms/ui'

export function TitleRowLabel() {
  const { data, rowNumber } = useRowLabel() as { data?: { title?: string }; rowNumber?: number }
  const title = typeof data?.title === 'string' ? data.title.trim() : ''

  if (title) {
    return <span>{title}</span>
  }

  return <span>{`Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
