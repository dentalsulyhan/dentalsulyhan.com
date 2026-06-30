import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "design_settings"
      ADD COLUMN IF NOT EXISTS "colors_footer_background" varchar DEFAULT '#f4ede7';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "design_settings"
      DROP COLUMN IF EXISTS "colors_footer_background";
  `)
}
