# syntax=docker/dockerfile:1
#
# Targets:
#   runner   (default) - minimal Next.js standalone server, this is what runs in production
#   migrator           - full node_modules + sources, used to run `payload migrate` as a one-off job
#
# Build (from the repository root):
#   docker build --target runner   -t sulyhan-app .
#   docker build --target migrator -t sulyhan-migrate .

FROM node:22-alpine AS base

# ---------------------------------------------------------------- deps
FROM base AS deps
# libc6-compat: see https://github.com/nodejs/docker-node/tree/main#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# .npmrc is required: the lockfile was generated with `legacy-peer-deps=true`,
# without it `npm ci` fails with "package.json and package-lock.json are not in sync".
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# ---------------------------------------------------------------- builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle at build time,
# so they must be passed as build args (see deploy/docker-compose.yml).
ARG SITE_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_PLERDY_SUID
ARG NEXT_PUBLIC_PLERDY_SITE_HASH
ARG NEXT_PUBLIC_PLERDY_SCRIPT_URL
# Used at build time to allow the media host in next/image `remotePatterns`.
ARG R2_PUBLIC_BASE_URL

ENV SITE_URL=$SITE_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY \
    NEXT_PUBLIC_PLERDY_SUID=$NEXT_PUBLIC_PLERDY_SUID \
    NEXT_PUBLIC_PLERDY_SITE_HASH=$NEXT_PUBLIC_PLERDY_SITE_HASH \
    NEXT_PUBLIC_PLERDY_SCRIPT_URL=$NEXT_PUBLIC_PLERDY_SCRIPT_URL \
    R2_PUBLIC_BASE_URL=$R2_PUBLIC_BASE_URL \
    NEXT_OUTPUT=standalone \
    NEXT_TELEMETRY_DISABLED=1

# payload.config.ts requires PAYLOAD_SECRET and DATABASE_URL to be present when it is imported.
# The values are build-time placeholders passed inline (not ENV), so they are not stored in the
# image metadata. The build does not need a real database: pages that read data are rendered on
# demand, and sitemap.xml / robots.txt are `force-dynamic`. Real values are provided at runtime.
RUN PAYLOAD_SECRET=build-time-placeholder \
    DATABASE_URL=postgres://build:build@127.0.0.1:5432/build \
    npm run build

# ---------------------------------------------------------------- migrator
FROM deps AS migrator
WORKDIR /app
COPY . .
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL / PAYLOAD_SECRET come from the environment at runtime.
CMD ["npm", "run", "migrate"]

# ---------------------------------------------------------------- runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# .next/cache holds the ISR / unstable_cache data and the image optimizer cache.
# It is a mount point for a named volume so the cache survives container restarts.
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1

CMD ["node", "server.js"]
