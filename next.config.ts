import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Hostnames allowed for next/image remote sources. The R2 public host comes from
// R2_PUBLIC_BASE_URL (read at build time), so switching to a custom media domain
// does not require a code change. The legacy r2.dev host stays as a fallback.
function getR2ImageHostnames() {
  const hostnames = new Set<string>(['pub-6603280d668d4b1f980c3f5523687105.r2.dev'])
  const base = process.env.R2_PUBLIC_BASE_URL?.trim()

  if (base) {
    try {
      hostnames.add(new URL(base).hostname)
    } catch {
      // ignore malformed value, the fallback host above is still allowed
    }
  }

  return [...hostnames]
}

const nextConfig: NextConfig = {
  // `standalone` is only enabled for the Docker/VPS build (NEXT_OUTPUT=standalone),
  // so the current Vercel deployment is not affected.
  ...(process.env.NEXT_OUTPUT === 'standalone' ? { output: 'standalone' as const } : {}),
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns: getR2ImageHostnames().map((hostname) => ({
      protocol: 'https' as const,
      hostname,
      pathname: '/**',
    })),
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      '@payloadcms/storage-s3/client': path.resolve(
        dirname,
        'src/components/admin/DisabledS3ClientUploadHandler.tsx',
      ),
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
