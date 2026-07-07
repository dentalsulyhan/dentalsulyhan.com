import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_content"
      ADD COLUMN IF NOT EXISTS "use_as_page_title" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "pages_blocks_content_image"
      ADD COLUMN IF NOT EXISTS "use_as_page_title" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "services_blocks_content"
      ADD COLUMN IF NOT EXISTS "use_as_page_title" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "services_blocks_content_image"
      ADD COLUMN IF NOT EXISTS "use_as_page_title" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "services_blocks_content_image"
      DROP COLUMN IF EXISTS "use_as_page_title";

    ALTER TABLE IF EXISTS "services_blocks_content"
      DROP COLUMN IF EXISTS "use_as_page_title";

    ALTER TABLE IF EXISTS "pages_blocks_content_image"
      DROP COLUMN IF EXISTS "use_as_page_title";

    ALTER TABLE IF EXISTS "pages_blocks_content"
      DROP COLUMN IF EXISTS "use_as_page_title";
  `)
}
