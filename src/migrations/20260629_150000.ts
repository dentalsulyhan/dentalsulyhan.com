import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "design_settings_typography"
      ADD COLUMN IF NOT EXISTS "main_font_family" varchar DEFAULT '"Raleway", sans-serif',
      ADD COLUMN IF NOT EXISTS "second_font_family" varchar DEFAULT '"AvenirNextLTPro", sans-serif';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "design_settings_typography"
      DROP COLUMN IF EXISTS "main_font_family",
      DROP COLUMN IF EXISTS "second_font_family";
  `)
}
