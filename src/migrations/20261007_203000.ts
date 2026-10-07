import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_gallery_content_alignment" AS ENUM ('left', 'center', 'right');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE IF EXISTS "pages_blocks_gallery"
      ADD COLUMN IF NOT EXISTS "content_alignment" "public"."enum_pages_blocks_gallery_content_alignment" DEFAULT 'left';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_gallery"
      DROP COLUMN IF EXISTS "content_alignment";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_gallery_content_alignment";
  `)
}
