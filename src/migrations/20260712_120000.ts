import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_advantages_items"
      ADD COLUMN IF NOT EXISTS "icon_source" varchar DEFAULT 'upload',
      ADD COLUMN IF NOT EXISTS "font_awesome_icon" varchar;

    ALTER TABLE IF EXISTS "pages_blocks_philosophy_items"
      ADD COLUMN IF NOT EXISTS "icon_source" varchar DEFAULT 'upload',
      ADD COLUMN IF NOT EXISTS "font_awesome_icon" varchar;

    ALTER TABLE IF EXISTS "services_blocks_advantages_items"
      ADD COLUMN IF NOT EXISTS "icon_source" varchar DEFAULT 'upload',
      ADD COLUMN IF NOT EXISTS "font_awesome_icon" varchar;

    ALTER TABLE IF EXISTS "services_blocks_cards_items"
      ADD COLUMN IF NOT EXISTS "icon_source" varchar DEFAULT 'upload',
      ADD COLUMN IF NOT EXISTS "font_awesome_icon" varchar;

    ALTER TABLE IF EXISTS "home_page_advantages"
      ADD COLUMN IF NOT EXISTS "icon_source" varchar DEFAULT 'upload',
      ADD COLUMN IF NOT EXISTS "font_awesome_icon" varchar;

    ALTER TABLE IF EXISTS "home_page_philosophy_cards"
      ADD COLUMN IF NOT EXISTS "icon_source" varchar DEFAULT 'upload',
      ADD COLUMN IF NOT EXISTS "font_awesome_icon" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "home_page_philosophy_cards"
      DROP COLUMN IF EXISTS "font_awesome_icon",
      DROP COLUMN IF EXISTS "icon_source";

    ALTER TABLE IF EXISTS "home_page_advantages"
      DROP COLUMN IF EXISTS "font_awesome_icon",
      DROP COLUMN IF EXISTS "icon_source";

    ALTER TABLE IF EXISTS "services_blocks_cards_items"
      DROP COLUMN IF EXISTS "font_awesome_icon",
      DROP COLUMN IF EXISTS "icon_source";

    ALTER TABLE IF EXISTS "services_blocks_advantages_items"
      DROP COLUMN IF EXISTS "font_awesome_icon",
      DROP COLUMN IF EXISTS "icon_source";

    ALTER TABLE IF EXISTS "pages_blocks_philosophy_items"
      DROP COLUMN IF EXISTS "font_awesome_icon",
      DROP COLUMN IF EXISTS "icon_source";

    ALTER TABLE IF EXISTS "pages_blocks_advantages_items"
      DROP COLUMN IF EXISTS "font_awesome_icon",
      DROP COLUMN IF EXISTS "icon_source";
  `)
}
