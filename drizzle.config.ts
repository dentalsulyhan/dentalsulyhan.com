import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/payload-generated-schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://postgres@127.0.0.1:5432/sulyhan-backend',
  },
})
