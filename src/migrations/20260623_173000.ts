import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_content"
      ADD COLUMN IF NOT EXISTS "background_image_id" integer,
      ADD COLUMN IF NOT EXISTS "overlay_color" varchar DEFAULT '#000000',
      ADD COLUMN IF NOT EXISTS "overlay_opacity" numeric DEFAULT 35;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pages_blocks_content_background_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_content"
          ADD CONSTRAINT "pages_blocks_content_background_image_id_media_id_fk"
          FOREIGN KEY ("background_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_content"
      DROP CONSTRAINT IF EXISTS "pages_blocks_content_background_image_id_media_id_fk";

    ALTER TABLE IF EXISTS "pages_blocks_content"
      DROP COLUMN IF EXISTS "background_image_id",
      DROP COLUMN IF EXISTS "overlay_color",
      DROP COLUMN IF EXISTS "overlay_opacity";
  `)
}
