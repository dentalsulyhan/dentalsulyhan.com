import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings_locales" ADD COLUMN "contacts_section_title" varchar;
    ALTER TABLE "site_settings_locales" ADD COLUMN "contacts_section_description" varchar;
    ALTER TABLE "site_settings_locales" ADD COLUMN "contacts_phone_label" varchar;
    ALTER TABLE "site_settings_locales" ADD COLUMN "contacts_email_label" varchar;
    ALTER TABLE "site_settings_locales" ADD COLUMN "contacts_address_label" varchar;
    ALTER TABLE "site_settings_locales" ADD COLUMN "contacts_transport_label" varchar;
    ALTER TABLE "site_settings_locales" ADD COLUMN "contacts_social_label" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings_locales" DROP COLUMN "contacts_section_title";
    ALTER TABLE "site_settings_locales" DROP COLUMN "contacts_section_description";
    ALTER TABLE "site_settings_locales" DROP COLUMN "contacts_phone_label";
    ALTER TABLE "site_settings_locales" DROP COLUMN "contacts_email_label";
    ALTER TABLE "site_settings_locales" DROP COLUMN "contacts_address_label";
    ALTER TABLE "site_settings_locales" DROP COLUMN "contacts_transport_label";
    ALTER TABLE "site_settings_locales" DROP COLUMN "contacts_social_label";
  `)
}
