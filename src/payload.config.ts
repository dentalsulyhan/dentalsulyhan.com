import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import { uk } from '@payloadcms/translations/languages/uk'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Pricing } from './collections/Pricing'
import { Promotions } from './collections/Promotions'
import { HomePage } from './globals/HomePage'
import { HeaderFooter } from './globals/HeaderFooter'
import { SiteContacts } from './globals/SiteContacts'
import { Services } from './collections/Services'
import { TeamMembers } from './collections/TeamMembers'
import { SiteSettings } from './globals/SiteSettings'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { DesignSettings } from './globals/DesignSettings'

// Trigger HMR cache clear for global settings
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isMigrateCommand = process.argv.some((arg) => arg.includes('migrate'))
const editor = lexicalEditor({
  features: ({ defaultFeatures }) =>
    isMigrateCommand ? defaultFeatures.filter((feature) => feature.key !== 'upload') : defaultFeatures,
})

const email =
  process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS
    ? await nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        defaultFromName: process.env.SMTP_FROM_NAME || 'Dental Sulyhan',
        transportOptions: {
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: process.env.SMTP_SECURE === 'true',
        },
      })
    : undefined

const r2Bucket = process.env.R2_BUCKET
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const r2PublicBaseURL = process.env.R2_PUBLIC_BASE_URL

function normalizeR2Endpoint(value?: string) {
  if (!value) return undefined

  try {
    const url = new URL(value)
    return `${url.protocol}//${url.host}`
  } catch {
    return value.replace(/\/+$/, '')
  }
}

const r2Endpoint = normalizeR2Endpoint(
  process.env.R2_ENDPOINT ||
    (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined),
)

const isR2Enabled = Boolean(
  r2Bucket && r2AccessKeyId && r2SecretAccessKey && r2Endpoint && r2PublicBaseURL,
)

const buildR2FileURL = ({
  filename,
  prefix,
}: {
  filename: string
  prefix?: string
}) => {
  const base = (r2PublicBaseURL || '').replace(/\/+$/, '')
  const normalizedPrefix = prefix?.replace(/^\/+|\/+$/g, '')

  return normalizedPrefix ? `${base}/${normalizedPrefix}/${filename}` : `${base}/${filename}`
}

export default buildConfig({
  admin: {
    user: Users.slug,
    ...(isMigrateCommand
      ? {}
      : {
          importMap: {
            baseDir: path.resolve(dirname),
          },
        }),
  },
  // Додаємо конфігурацію локалізації
  localization: {
    locales: ['es', 'en', 'uk'],
    defaultLocale: 'es', // Іспанська як основна
    fallback: true,      // Якщо перекладу немає, показуватиметься es
  },
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: {
      en,
      es,
      uk,
    },
  },
  collections: [Users, Media, Pages, Pricing, Promotions, Services, TeamMembers, ContactSubmissions],
  globals: [DesignSettings, SiteSettings, HomePage, HeaderFooter, SiteContacts],
  editor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  email,
  sharp,
  plugins: [
    s3Storage({
      enabled: isR2Enabled,
      alwaysInsertFields: true,
      clientUploads: false,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix, size }) =>
            buildR2FileURL({
              filename: (size as { filename?: string | null } | undefined)?.filename || filename,
              prefix,
            }),
        },
      },
      bucket: r2Bucket || 'disabled',
      config: {
        credentials: {
          accessKeyId: r2AccessKeyId || 'disabled',
          secretAccessKey: r2SecretAccessKey || 'disabled',
        },
        endpoint: r2Endpoint,
        forcePathStyle: true,
        region: process.env.R2_REGION || 'auto',
      },
    }),
  ],
})
