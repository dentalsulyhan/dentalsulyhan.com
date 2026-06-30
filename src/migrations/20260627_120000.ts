import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_content"
      ADD COLUMN IF NOT EXISTS "full_width_content" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb;

    ALTER TABLE IF EXISTS "services_blocks_content"
      ADD COLUMN IF NOT EXISTS "full_width_content" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb;

    ALTER TABLE IF EXISTS "services_blocks_cards"
      ADD COLUMN IF NOT EXISTS "intro" jsonb,
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "services_blocks_cards"
      DROP COLUMN IF EXISTS "intro",
      DROP COLUMN IF EXISTS "bottom_text";

    ALTER TABLE IF EXISTS "services_blocks_content"
      DROP COLUMN IF EXISTS "full_width_content",
      DROP COLUMN IF EXISTS "bottom_text";

    ALTER TABLE IF EXISTS "pages_blocks_content"
      DROP COLUMN IF EXISTS "full_width_content",
      DROP COLUMN IF EXISTS "bottom_text";
  `)
}
