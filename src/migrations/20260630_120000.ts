import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "site_settings"
      ADD COLUMN IF NOT EXISTS "tracking_google_tag_manager_id" varchar,
      ADD COLUMN IF NOT EXISTS "tracking_ga4_measurement_id" varchar,
      ADD COLUMN IF NOT EXISTS "tracking_meta_pixel_id" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "site_settings"
      DROP COLUMN IF EXISTS "tracking_meta_pixel_id",
      DROP COLUMN IF EXISTS "tracking_ga4_measurement_id",
      DROP COLUMN IF EXISTS "tracking_google_tag_manager_id";
  `)
}
