import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_advantages_display_variant" AS ENUM ('icons', 'steps');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE IF EXISTS "pages_blocks_advantages"
      ADD COLUMN IF NOT EXISTS "display_variant" "public"."enum_pages_blocks_advantages_display_variant" DEFAULT 'icons';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_advantages"
      DROP COLUMN IF EXISTS "display_variant";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_advantages_display_variant";
  `)
}
