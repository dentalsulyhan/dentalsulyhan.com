import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "site_settings"
      ADD COLUMN IF NOT EXISTS "contacts_address_url" varchar;

    ALTER TABLE IF EXISTS "site_contacts"
      ADD COLUMN IF NOT EXISTS "address_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "site_contacts"
      DROP COLUMN IF EXISTS "address_url";

    ALTER TABLE IF EXISTS "site_settings"
      DROP COLUMN IF EXISTS "contacts_address_url";
  `)
}
