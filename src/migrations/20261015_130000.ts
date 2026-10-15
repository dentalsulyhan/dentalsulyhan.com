import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_settings_menu_style" AS ENUM ('drawer', 'dropdown');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE IF EXISTS "site_settings"
      ADD COLUMN IF NOT EXISTS "menu_style" "public"."enum_site_settings_menu_style" DEFAULT 'drawer';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "site_settings"
      DROP COLUMN IF EXISTS "menu_style";

    DROP TYPE IF EXISTS "public"."enum_site_settings_menu_style";
  `)
}
