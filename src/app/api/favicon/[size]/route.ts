import { readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { getCachedSiteSettings } from '@/lib/publicData'

const ALLOWED_SIZES = new Set([16, 32, 180, 192, 512])

type BrandingMedia = {
  filename?: string | null
  mimeType?: string | null
  url?: string | null
}

function getRoundedMask(size: number) {
  const radius = Math.max(2, Math.round(size * 0.22))

  return Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>
  `)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: rawSize } = await params
  const size = Number.parseInt(rawSize, 10)

  if (!ALLOWED_SIZES.has(size)) {
    return new Response('Invalid favicon size', { status: 400 })
  }

  try {
    const siteSettings = (await getCachedSiteSettings('es').catch(() => null)) as { branding?: { favicon?: number | BrandingMedia | null } } | null

    const favicon = siteSettings?.branding?.favicon

    if (!favicon || typeof favicon !== 'object' || !favicon.filename) {
      return new Response('Favicon not configured', { status: 404 })
    }

    let source: Buffer

    if (favicon.url && /^https?:\/\//.test(favicon.url)) {
      const remoteResponse = await fetch(favicon.url, { cache: 'force-cache' })

      if (!remoteResponse.ok) {
        return new Response('Failed to fetch favicon source', { status: 502 })
      }

      source = Buffer.from(await remoteResponse.arrayBuffer())
    } else {
      const sourcePath = path.join(process.cwd(), 'public', 'media', favicon.filename)
      source = await readFile(sourcePath)
    }

    const resized = await sharp(source)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()

    const png = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        { input: resized },
        { input: getRoundedMask(size), blend: 'dest-in' },
      ])
      .png()
      .toBuffer()

    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error generating favicon:', error)
    return new Response('Failed to generate favicon', { status: 500 })
  }
}
