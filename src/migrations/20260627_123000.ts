import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "services_blocks_faq"
      ADD COLUMN IF NOT EXISTS "full_width_text" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "services_blocks_faq"
      DROP COLUMN IF EXISTS "full_width_text";
  `)
}
