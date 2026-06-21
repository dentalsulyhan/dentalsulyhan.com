import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pricing } from './collections/Pricing'
import { Promotions } from './collections/Promotions'
import { HomePage } from './globals/HomePage'
import { HeaderFooter } from './globals/HeaderFooter'
import { Services } from './collections/Services'
import { TeamMembers } from './collections/TeamMembers'

// Trigger HMR cache clear for global settings
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Додаємо конфігурацію локалізації
  localization: {
    locales: ['es', 'en', 'uk'],
    defaultLocale: 'es', // Іспанська як основна
    fallback: true,      // Якщо перекладу немає, показуватиметься es
  },
  collections: [Users, Media, Pricing, Promotions, Services, TeamMembers],
  globals: [HomePage, HeaderFooter],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
