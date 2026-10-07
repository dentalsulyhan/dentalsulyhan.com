import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_advantages_content_alignment" AS ENUM('left', 'center');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE IF EXISTS "pages_blocks_advantages"
      ADD COLUMN IF NOT EXISTS "content_alignment" "public"."enum_pages_blocks_advantages_content_alignment" DEFAULT 'left';

    ALTER TABLE IF EXISTS "design_settings"
      ALTER COLUMN "buttons_radius" SET DEFAULT '10px';

    UPDATE "design_settings"
      SET "buttons_radius" = '10px';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_advantages"
      DROP COLUMN IF EXISTS "content_alignment";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_advantages_content_alignment";

    ALTER TABLE IF EXISTS "design_settings"
      ALTER COLUMN "buttons_radius" SET DEFAULT '9999px';

    UPDATE "design_settings"
      SET "buttons_radius" = '9999px'
      WHERE "buttons_radius" = '10px';
  `)
}
