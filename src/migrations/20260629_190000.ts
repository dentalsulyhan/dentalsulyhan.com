import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "media"
      ADD COLUMN IF NOT EXISTS "media_category" varchar DEFAULT 'general',
      ADD COLUMN IF NOT EXISTS "prefix" varchar;

    UPDATE "media"
    SET "media_category" = 'general'
    WHERE "media_category" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "media"
      DROP COLUMN IF EXISTS "prefix",
      DROP COLUMN IF EXISTS "media_category";
  `)
}
