import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_advantages_layout" AS ENUM ('icons', 'steps');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE IF EXISTS "home_page"
      ADD COLUMN IF NOT EXISTS "advantages_layout" "public"."enum_home_page_advantages_layout" DEFAULT 'icons';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "home_page"
      DROP COLUMN IF EXISTS "advantages_layout";

    DROP TYPE IF EXISTS "public"."enum_home_page_advantages_layout";
  `)
}
