'use client'

import type { ReactNode } from 'react'
import type { UploadCollectionSlug } from 'payload'

type Props = {
  children: ReactNode
  collectionSlug: UploadCollectionSlug
  enabled?: boolean
  extra: Record<string, unknown>
  prefix?: string
  serverHandlerPath: `/${string}`
}

export function S3ClientUploadHandler({ children }: Props) {
  return <>{children}</>
}

export { S3ClientUploadHandler as DisabledS3ClientUploadHandler }
