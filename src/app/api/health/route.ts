export const dynamic = 'force-dynamic'

// Lightweight liveness probe for Docker / Caddy / uptime monitors.
// Intentionally does not touch the database, so a DB outage does not
// cause the container to be restarted in a loop.
export function GET() {
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
