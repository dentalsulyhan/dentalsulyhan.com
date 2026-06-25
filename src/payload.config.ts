import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import { uk } from '@payloadcms/translations/languages/uk'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
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
  globals: [SiteSettings, HomePage, HeaderFooter, SiteContacts],
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
  plugins: [],
})
