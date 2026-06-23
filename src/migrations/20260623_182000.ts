import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_locales"
      ADD COLUMN IF NOT EXISTS "not_found_title" varchar,
      ADD COLUMN IF NOT EXISTS "not_found_text" jsonb,
      ADD COLUMN IF NOT EXISTS "not_found_button_text" varchar,
      ADD COLUMN IF NOT EXISTS "not_found_button_link" varchar;

    ALTER TABLE IF EXISTS "pages"
      ADD COLUMN IF NOT EXISTS "not_found_background_image_id" integer,
      ADD COLUMN IF NOT EXISTS "not_found_overlay_color" varchar DEFAULT '#000000',
      ADD COLUMN IF NOT EXISTS "not_found_overlay_opacity" numeric DEFAULT 35;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pages_not_found_background_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "pages"
          ADD CONSTRAINT "pages_not_found_background_image_id_media_id_fk"
          FOREIGN KEY ("not_found_background_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages"
      DROP CONSTRAINT IF EXISTS "pages_not_found_background_image_id_media_id_fk";

    ALTER TABLE IF EXISTS "pages"
      DROP COLUMN IF EXISTS "not_found_background_image_id",
      DROP COLUMN IF EXISTS "not_found_overlay_color",
      DROP COLUMN IF EXISTS "not_found_overlay_opacity";

    ALTER TABLE IF EXISTS "pages_locales"
      DROP COLUMN IF EXISTS "not_found_title",
      DROP COLUMN IF EXISTS "not_found_text",
      DROP COLUMN IF EXISTS "not_found_button_text",
      DROP COLUMN IF EXISTS "not_found_button_link";
  `)
}
