import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN "form_notifications_recipient_email" varchar,
      ADD COLUMN "form_notifications_send_confirmation_to_user" boolean DEFAULT true;

    ALTER TABLE "site_settings_locales"
      ADD COLUMN "form_notifications_admin_subject" varchar,
      ADD COLUMN "form_notifications_admin_message" varchar,
      ADD COLUMN "form_notifications_user_subject" varchar,
      ADD COLUMN "form_notifications_user_message" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings_locales"
      DROP COLUMN "form_notifications_admin_subject",
      DROP COLUMN "form_notifications_admin_message",
      DROP COLUMN "form_notifications_user_subject",
      DROP COLUMN "form_notifications_user_message";

    ALTER TABLE "site_settings"
      DROP COLUMN "form_notifications_recipient_email",
      DROP COLUMN "form_notifications_send_confirmation_to_user";
  `)
}
