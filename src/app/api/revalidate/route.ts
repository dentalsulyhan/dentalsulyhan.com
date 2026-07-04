import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

function getExpectedSecret() {
  return process.env.REVALIDATE_SECRET?.trim() || process.env.PAYLOAD_SECRET?.trim() || ''
}

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret')?.trim()
  const expectedSecret = getExpectedSecret()

  if (!secret || !expectedSecret || secret !== expectedSecret) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null
  const tags = Array.isArray(body?.tags) ? body.tags.filter((tag): tag is string => typeof tag === 'string') : []

  if (tags.length === 0) {
    return Response.json({ ok: false, error: 'No tags provided' }, { status: 400 })
  }

  for (const tag of [...new Set(tags)]) {
    revalidateTag(tag, 'max')
  }

  return Response.json({ ok: true, revalidated: tags.length })
}
