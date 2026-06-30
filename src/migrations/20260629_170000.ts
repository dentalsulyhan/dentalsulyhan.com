import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "site_settings"
      ADD COLUMN IF NOT EXISTS "branding_favicon_id" integer,
      ADD COLUMN IF NOT EXISTS "branding_logo_id" integer,
      ADD COLUMN IF NOT EXISTS "branding_logo_light_id" integer,
      ADD COLUMN IF NOT EXISTS "branding_logo_dark_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_branding_favicon_id_media_id_fk'
      ) THEN
        ALTER TABLE "site_settings"
          ADD CONSTRAINT "site_settings_branding_favicon_id_media_id_fk"
          FOREIGN KEY ("branding_favicon_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_branding_logo_id_media_id_fk'
      ) THEN
        ALTER TABLE "site_settings"
          ADD CONSTRAINT "site_settings_branding_logo_id_media_id_fk"
          FOREIGN KEY ("branding_logo_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_branding_logo_light_id_media_id_fk'
      ) THEN
        ALTER TABLE "site_settings"
          ADD CONSTRAINT "site_settings_branding_logo_light_id_media_id_fk"
          FOREIGN KEY ("branding_logo_light_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_branding_logo_dark_id_media_id_fk'
      ) THEN
        ALTER TABLE "site_settings"
          ADD CONSTRAINT "site_settings_branding_logo_dark_id_media_id_fk"
          FOREIGN KEY ("branding_logo_dark_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_branding_favicon_idx" ON "site_settings" USING btree ("branding_favicon_id");
    CREATE INDEX IF NOT EXISTS "site_settings_branding_logo_idx" ON "site_settings" USING btree ("branding_logo_id");
    CREATE INDEX IF NOT EXISTS "site_settings_branding_logo_light_idx" ON "site_settings" USING btree ("branding_logo_light_id");
    CREATE INDEX IF NOT EXISTS "site_settings_branding_logo_dark_idx" ON "site_settings" USING btree ("branding_logo_dark_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "site_settings_branding_logo_dark_idx";
    DROP INDEX IF EXISTS "site_settings_branding_logo_light_idx";
    DROP INDEX IF EXISTS "site_settings_branding_logo_idx";
    DROP INDEX IF EXISTS "site_settings_branding_favicon_idx";

    ALTER TABLE "site_settings"
      DROP CONSTRAINT IF EXISTS "site_settings_branding_logo_dark_id_media_id_fk";
    ALTER TABLE "site_settings"
      DROP CONSTRAINT IF EXISTS "site_settings_branding_logo_light_id_media_id_fk";
    ALTER TABLE "site_settings"
      DROP CONSTRAINT IF EXISTS "site_settings_branding_logo_id_media_id_fk";
    ALTER TABLE "site_settings"
      DROP CONSTRAINT IF EXISTS "site_settings_branding_favicon_id_media_id_fk";

    ALTER TABLE IF EXISTS "site_settings"
      DROP COLUMN IF EXISTS "branding_logo_dark_id",
      DROP COLUMN IF EXISTS "branding_logo_light_id",
      DROP COLUMN IF EXISTS "branding_logo_id",
      DROP COLUMN IF EXISTS "branding_favicon_id";
  `)
}
