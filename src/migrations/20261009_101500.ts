import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_hero_image_layout" AS ENUM ('split', 'overlap');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE IF EXISTS "pages_blocks_hero"
      ADD COLUMN IF NOT EXISTS "image_layout" "public"."enum_pages_blocks_hero_image_layout" DEFAULT 'split';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_hero"
      DROP COLUMN IF EXISTS "image_layout";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_image_layout";
  `)
}
