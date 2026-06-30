import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_reviews"
      ADD COLUMN IF NOT EXISTS "intro" jsonb,
      ADD COLUMN IF NOT EXISTS "split_header_layout" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "summary_title" varchar,
      ADD COLUMN IF NOT EXISTS "reviews_label" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_reviews"
      DROP COLUMN IF EXISTS "intro",
      DROP COLUMN IF EXISTS "split_header_layout",
      DROP COLUMN IF EXISTS "summary_title",
      DROP COLUMN IF EXISTS "reviews_label";
  `)
}
