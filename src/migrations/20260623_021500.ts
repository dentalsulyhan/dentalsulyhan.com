import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'enum_pages_blocks_pricing_group_showcase_position'
      ) THEN
        CREATE TYPE "public"."enum_pages_blocks_pricing_group_showcase_position" AS ENUM('left', 'right');
      END IF;
    END
    $$;

    ALTER TABLE "pricing_locales"
      ADD COLUMN IF NOT EXISTS "description" jsonb,
      ADD COLUMN IF NOT EXISTS "details_link_label" varchar;

    ALTER TABLE "site_settings_locales"
      ADD COLUMN IF NOT EXISTS "global_contact_section_section_title" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_section_description" jsonb,
      ADD COLUMN IF NOT EXISTS "global_contact_section_form_title" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_form_description" jsonb,
      ADD COLUMN IF NOT EXISTS "global_contact_section_submit_button_label" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_full_name_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_phone_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_email_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_patient_type_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_referral_source_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_comment_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_success_message" varchar,
      ADD COLUMN IF NOT EXISTS "global_contact_section_error_message" varchar;

    CREATE TABLE IF NOT EXISTS "pages_blocks_pricing_group_showcase" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "position" "public"."enum_pages_blocks_pricing_group_showcase_position" DEFAULT 'left',
      "image_id" integer NOT NULL,
      "pricing_group_id" integer NOT NULL,
      "block_name" varchar
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pages_blocks_pricing_group_showcase_parent_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_pricing_group_showcase"
          ADD CONSTRAINT "pages_blocks_pricing_group_showcase_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."pages"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pages_blocks_pricing_group_showcase_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_pricing_group_showcase"
          ADD CONSTRAINT "pages_blocks_pricing_group_showcase_image_id_media_id_fk"
          FOREIGN KEY ("image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pages_blocks_pricing_group_showcase_pricing_group_id_pricing_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_pricing_group_showcase"
          ADD CONSTRAINT "pages_blocks_pricing_group_showcase_pricing_group_id_pricing_id_fk"
          FOREIGN KEY ("pricing_group_id")
          REFERENCES "public"."pricing"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_group_showcase_order_idx" ON "pages_blocks_pricing_group_showcase" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_group_showcase_parent_id_idx" ON "pages_blocks_pricing_group_showcase" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_group_showcase_path_idx" ON "pages_blocks_pricing_group_showcase" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_group_showcase_locale_idx" ON "pages_blocks_pricing_group_showcase" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_group_showcase_image_idx" ON "pages_blocks_pricing_group_showcase" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_group_showcase_pricing_group_idx" ON "pages_blocks_pricing_group_showcase" USING btree ("pricing_group_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_global_contact_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "block_name" varchar
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pages_blocks_global_contact_section_parent_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_global_contact_section"
          ADD CONSTRAINT "pages_blocks_global_contact_section_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."pages"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_global_contact_section_order_idx" ON "pages_blocks_global_contact_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_global_contact_section_parent_id_idx" ON "pages_blocks_global_contact_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_global_contact_section_path_idx" ON "pages_blocks_global_contact_section" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_global_contact_section_locale_idx" ON "pages_blocks_global_contact_section" USING btree ("_locale");

    CREATE TABLE IF NOT EXISTS "pricing_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "price" varchar NOT NULL,
      "service_page_id" integer
    );

    ALTER TABLE "pricing_items"
      ADD COLUMN IF NOT EXISTS "price" varchar,
      ADD COLUMN IF NOT EXISTS "service_page_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pricing_items_parent_id_fk'
      ) THEN
        ALTER TABLE "pricing_items"
          ADD CONSTRAINT "pricing_items_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."pricing"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pricing_items_service_page_id_services_id_fk'
      ) THEN
        ALTER TABLE "pricing_items"
          ADD CONSTRAINT "pricing_items_service_page_id_services_id_fk"
          FOREIGN KEY ("service_page_id")
          REFERENCES "public"."services"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "pricing_items_order_idx" ON "pricing_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pricing_items_parent_id_idx" ON "pricing_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pricing_items_service_page_idx" ON "pricing_items" USING btree ("service_page_id");

    CREATE TABLE IF NOT EXISTS "pricing_items_locales" (
      "service_name" varchar NOT NULL,
      "price_prefix" varchar,
      "note" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    ALTER TABLE "pricing_items_locales"
      ADD COLUMN IF NOT EXISTS "price_prefix" varchar;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pricing_items_locales_parent_id_fk'
      ) THEN
        ALTER TABLE "pricing_items_locales"
          ADD CONSTRAINT "pricing_items_locales_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."pricing_items"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "pricing_items_locales_locale_parent_id_unique" ON "pricing_items_locales" USING btree ("_locale", "_parent_id");

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'pricing_items'
          AND column_name = '_locale'
      ) AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'pricing_items'
          AND column_name = 'service_name'
      ) THEN
        INSERT INTO "pricing_items_locales" ("service_name", "note", "_locale", "_parent_id")
        SELECT
          "service_name",
          "note",
          "_locale",
          "id"
        FROM "pricing_items"
        WHERE "_locale" IS NOT NULL
          AND "service_name" IS NOT NULL
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
      END IF;
    END
    $$;

    CREATE TABLE IF NOT EXISTS "site_settings_global_contact_section_patient_types" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'site_settings_global_contact_section_patient_types_parent_id_fk'
      ) THEN
        ALTER TABLE "site_settings_global_contact_section_patient_types"
          ADD CONSTRAINT "site_settings_global_contact_section_patient_types_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."site_settings"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "site_settings_global_contact_section_patient_types_order_idx" ON "site_settings_global_contact_section_patient_types" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_global_contact_section_patient_types_parent_id_idx" ON "site_settings_global_contact_section_patient_types" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "site_settings_global_contact_section_patient_types_locales" (
      "label" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'site_settings_global_contact_section_patient_types_fk'
      ) THEN
        ALTER TABLE "site_settings_global_contact_section_patient_types_locales"
          ADD CONSTRAINT "site_settings_global_contact_section_patient_types_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."site_settings_global_contact_section_patient_types"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "site_settings_global_contact_section_patient_types_locale_parent_idx" ON "site_settings_global_contact_section_patient_types_locales" USING btree ("_locale", "_parent_id");

    CREATE TABLE IF NOT EXISTS "site_settings_global_contact_section_ref_sources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'site_settings_global_contact_section_ref_sources_parent_id_fk'
      ) THEN
        ALTER TABLE "site_settings_global_contact_section_ref_sources"
          ADD CONSTRAINT "site_settings_global_contact_section_ref_sources_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."site_settings"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "site_settings_global_contact_section_ref_sources_order_idx" ON "site_settings_global_contact_section_ref_sources" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_global_contact_section_ref_sources_parent_id_idx" ON "site_settings_global_contact_section_ref_sources" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "site_settings_global_contact_section_ref_sources_locales" (
      "label" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'site_settings_global_contact_section_ref_sources_fk'
      ) THEN
        ALTER TABLE "site_settings_global_contact_section_ref_sources_locales"
          ADD CONSTRAINT "site_settings_global_contact_section_ref_sources_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."site_settings_global_contact_section_ref_sources"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "site_settings_global_contact_section_ref_sources_locale_parent_idx" ON "site_settings_global_contact_section_ref_sources_locales" USING btree ("_locale", "_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "site_settings_global_contact_section_ref_sources_locale_parent_idx";
    DROP INDEX IF EXISTS "site_settings_global_contact_section_ref_sources_order_idx";
    DROP INDEX IF EXISTS "site_settings_global_contact_section_ref_sources_parent_id_idx";
    DROP INDEX IF EXISTS "site_settings_global_contact_section_patient_types_locale_parent_idx";
    DROP INDEX IF EXISTS "site_settings_global_contact_section_patient_types_order_idx";
    DROP INDEX IF EXISTS "site_settings_global_contact_section_patient_types_parent_id_idx";
    DROP INDEX IF EXISTS "pricing_items_order_idx";
    DROP INDEX IF EXISTS "pricing_items_parent_id_idx";
    DROP INDEX IF EXISTS "pricing_items_service_page_idx";
    DROP INDEX IF EXISTS "pricing_items_locales_locale_parent_id_unique";
    DROP INDEX IF EXISTS "pages_blocks_global_contact_section_order_idx";
    DROP INDEX IF EXISTS "pages_blocks_global_contact_section_parent_id_idx";
    DROP INDEX IF EXISTS "pages_blocks_global_contact_section_path_idx";
    DROP INDEX IF EXISTS "pages_blocks_global_contact_section_locale_idx";
    DROP INDEX IF EXISTS "pages_blocks_pricing_group_showcase_order_idx";
    DROP INDEX IF EXISTS "pages_blocks_pricing_group_showcase_parent_id_idx";
    DROP INDEX IF EXISTS "pages_blocks_pricing_group_showcase_path_idx";
    DROP INDEX IF EXISTS "pages_blocks_pricing_group_showcase_locale_idx";
    DROP INDEX IF EXISTS "pages_blocks_pricing_group_showcase_image_idx";
    DROP INDEX IF EXISTS "pages_blocks_pricing_group_showcase_pricing_group_idx";

    ALTER TABLE IF EXISTS "site_settings_global_contact_section_ref_sources_locales"
      DROP CONSTRAINT IF EXISTS "site_settings_global_contact_section_ref_sources_fk";
    ALTER TABLE IF EXISTS "site_settings_global_contact_section_ref_sources"
      DROP CONSTRAINT IF EXISTS "site_settings_global_contact_section_ref_sources_parent_id_fk";
    ALTER TABLE IF EXISTS "site_settings_global_contact_section_patient_types_locales"
      DROP CONSTRAINT IF EXISTS "site_settings_global_contact_section_patient_types_fk";
    ALTER TABLE IF EXISTS "site_settings_global_contact_section_patient_types"
      DROP CONSTRAINT IF EXISTS "site_settings_global_contact_section_patient_types_parent_id_fk";
    ALTER TABLE IF EXISTS "pricing_items_locales"
      DROP CONSTRAINT IF EXISTS "pricing_items_locales_parent_id_fk";
    ALTER TABLE IF EXISTS "pricing_items"
      DROP CONSTRAINT IF EXISTS "pricing_items_service_page_id_services_id_fk";
    ALTER TABLE IF EXISTS "pricing_items"
      DROP CONSTRAINT IF EXISTS "pricing_items_parent_id_fk";
    ALTER TABLE IF EXISTS "pages_blocks_global_contact_section"
      DROP CONSTRAINT IF EXISTS "pages_blocks_global_contact_section_parent_id_fk";
    ALTER TABLE IF EXISTS "pages_blocks_pricing_group_showcase"
      DROP CONSTRAINT IF EXISTS "pages_blocks_pricing_group_showcase_pricing_group_id_pricing_id_fk";
    ALTER TABLE IF EXISTS "pages_blocks_pricing_group_showcase"
      DROP CONSTRAINT IF EXISTS "pages_blocks_pricing_group_showcase_image_id_media_id_fk";
    ALTER TABLE IF EXISTS "pages_blocks_pricing_group_showcase"
      DROP CONSTRAINT IF EXISTS "pages_blocks_pricing_group_showcase_parent_id_fk";

    DROP TABLE IF EXISTS "pricing_items_locales";
    DROP TABLE IF EXISTS "site_settings_global_contact_section_ref_sources_locales";
    DROP TABLE IF EXISTS "site_settings_global_contact_section_ref_sources";
    DROP TABLE IF EXISTS "site_settings_global_contact_section_patient_types_locales";
    DROP TABLE IF EXISTS "site_settings_global_contact_section_patient_types";
    DROP TABLE IF EXISTS "pricing_items";
    DROP TABLE IF EXISTS "pages_blocks_global_contact_section";
    DROP TABLE IF EXISTS "pages_blocks_pricing_group_showcase";

    ALTER TABLE IF EXISTS "site_settings_locales"
      DROP COLUMN IF EXISTS "global_contact_section_section_title",
      DROP COLUMN IF EXISTS "global_contact_section_section_description",
      DROP COLUMN IF EXISTS "global_contact_section_form_title",
      DROP COLUMN IF EXISTS "global_contact_section_form_description",
      DROP COLUMN IF EXISTS "global_contact_section_submit_button_label",
      DROP COLUMN IF EXISTS "global_contact_section_full_name_placeholder",
      DROP COLUMN IF EXISTS "global_contact_section_phone_placeholder",
      DROP COLUMN IF EXISTS "global_contact_section_email_placeholder",
      DROP COLUMN IF EXISTS "global_contact_section_patient_type_placeholder",
      DROP COLUMN IF EXISTS "global_contact_section_referral_source_placeholder",
      DROP COLUMN IF EXISTS "global_contact_section_comment_placeholder",
      DROP COLUMN IF EXISTS "global_contact_section_success_message",
      DROP COLUMN IF EXISTS "global_contact_section_error_message";

    ALTER TABLE IF EXISTS "pricing_locales"
      DROP COLUMN IF EXISTS "description",
      DROP COLUMN IF EXISTS "details_link_label";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_pricing_group_showcase_position";
  `)
}
