import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "services_blocks_content_accordion"
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "services_blocks_content_accordion"
      DROP COLUMN IF EXISTS "bottom_text";
  `)
}
