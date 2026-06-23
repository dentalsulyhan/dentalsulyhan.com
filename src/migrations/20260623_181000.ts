import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_pages_blocks_content_image_image_width'
      ) THEN
        CREATE TYPE "public"."enum_pages_blocks_content_image_image_width" AS ENUM('full', 'contained');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_content_image_image_width'
      ) THEN
        CREATE TYPE "public"."enum_services_blocks_content_image_image_width" AS ENUM('full', 'contained');
      END IF;
    END $$;

    ALTER TABLE IF EXISTS "pages_blocks_content_image"
      ADD COLUMN IF NOT EXISTS "image_width" "public"."enum_pages_blocks_content_image_image_width" DEFAULT 'full';

    ALTER TABLE IF EXISTS "services_blocks_content_image"
      ADD COLUMN IF NOT EXISTS "image_width" "public"."enum_services_blocks_content_image_image_width" DEFAULT 'full';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "services_blocks_content_image"
      DROP COLUMN IF EXISTS "image_width";

    ALTER TABLE IF EXISTS "pages_blocks_content_image"
      DROP COLUMN IF EXISTS "image_width";

    DROP TYPE IF EXISTS "public"."enum_services_blocks_content_image_image_width";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_image_image_width";
  `)
}
