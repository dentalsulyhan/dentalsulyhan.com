import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_advantages_items_per_row" AS ENUM ('2', '3', '4');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE IF EXISTS "pages_blocks_advantages"
      ADD COLUMN IF NOT EXISTS "items_per_row" "public"."enum_pages_blocks_advantages_items_per_row" DEFAULT '3';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_advantages"
      DROP COLUMN IF EXISTS "items_per_row";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_advantages_items_per_row";
  `)
}
