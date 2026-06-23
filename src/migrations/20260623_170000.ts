import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_advantages"
      ADD COLUMN IF NOT EXISTS "compact_spacing" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "pages_blocks_philosophy"
      ADD COLUMN IF NOT EXISTS "compact_spacing" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "pages_blocks_team"
      ADD COLUMN IF NOT EXISTS "compact_spacing" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "pages_blocks_reviews"
      ADD COLUMN IF NOT EXISTS "compact_spacing" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "pages_blocks_gallery"
      ADD COLUMN IF NOT EXISTS "compact_spacing" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "pages_blocks_content"
      ADD COLUMN IF NOT EXISTS "compact_spacing" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "pages_blocks_global_contact_section"
      ADD COLUMN IF NOT EXISTS "compact_spacing" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "pages_blocks_contact_section"
      ADD COLUMN IF NOT EXISTS "compact_spacing" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_contact_section"
      DROP COLUMN IF EXISTS "compact_spacing";

    ALTER TABLE IF EXISTS "pages_blocks_global_contact_section"
      DROP COLUMN IF EXISTS "compact_spacing";

    ALTER TABLE IF EXISTS "pages_blocks_content"
      DROP COLUMN IF EXISTS "compact_spacing";

    ALTER TABLE IF EXISTS "pages_blocks_gallery"
      DROP COLUMN IF EXISTS "compact_spacing";

    ALTER TABLE IF EXISTS "pages_blocks_reviews"
      DROP COLUMN IF EXISTS "compact_spacing";

    ALTER TABLE IF EXISTS "pages_blocks_team"
      DROP COLUMN IF EXISTS "compact_spacing";

    ALTER TABLE IF EXISTS "pages_blocks_philosophy"
      DROP COLUMN IF EXISTS "compact_spacing";

    ALTER TABLE IF EXISTS "pages_blocks_advantages"
      DROP COLUMN IF EXISTS "compact_spacing";
  `)
}
