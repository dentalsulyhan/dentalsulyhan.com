import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_advantages_item_layout'
      ) THEN
        CREATE TYPE "public"."enum_services_blocks_advantages_item_layout" AS ENUM('column', 'row');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_advantages_columns'
      ) THEN
        CREATE TYPE "public"."enum_services_blocks_advantages_columns" AS ENUM('2', '3', '4');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_advantages_incomplete_row_alignment'
      ) THEN
        CREATE TYPE "public"."enum_services_blocks_advantages_incomplete_row_alignment" AS ENUM('center', 'start');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_cards_item_layout'
      ) THEN
        CREATE TYPE "public"."enum_services_blocks_cards_item_layout" AS ENUM('column', 'row');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_cards_columns'
      ) THEN
        CREATE TYPE "public"."enum_services_blocks_cards_columns" AS ENUM('2', '3', '4');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_cards_incomplete_row_alignment'
      ) THEN
        CREATE TYPE "public"."enum_services_blocks_cards_incomplete_row_alignment" AS ENUM('center', 'start');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_faq_columns'
      ) THEN
        CREATE TYPE "public"."enum_services_blocks_faq_columns" AS ENUM('one', 'two');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_comparison_layout_style'
      ) THEN
        CREATE TYPE "public"."enum_services_blocks_comparison_layout_style" AS ENUM('cards', 'split');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_pages_twitter_card'
      ) THEN
        CREATE TYPE "public"."enum_pages_twitter_card" AS ENUM('summary', 'summary_large_image');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_services_twitter_card'
      ) THEN
        CREATE TYPE "public"."enum_services_twitter_card" AS ENUM('summary', 'summary_large_image');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_seo_settings_default_twitter_card'
      ) THEN
        CREATE TYPE "public"."enum_seo_settings_default_twitter_card" AS ENUM('summary', 'summary_large_image');
      END IF;
    END
    $$;

    ALTER TABLE IF EXISTS "pages"
      ADD COLUMN IF NOT EXISTS "meta_image_id" integer,
      ADD COLUMN IF NOT EXISTS "canonical_url" varchar,
      ADD COLUMN IF NOT EXISTS "no_index" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "no_follow" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "twitter_card" "public"."enum_pages_twitter_card" DEFAULT 'summary_large_image';

    ALTER TABLE IF EXISTS "pages_locales"
      ADD COLUMN IF NOT EXISTS "meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "meta_description" varchar;

    ALTER TABLE IF EXISTS "pages_blocks_hero"
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb;

    ALTER TABLE IF EXISTS "services"
      ADD COLUMN IF NOT EXISTS "meta_image_id" integer,
      ADD COLUMN IF NOT EXISTS "canonical_url" varchar,
      ADD COLUMN IF NOT EXISTS "no_index" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "no_follow" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "twitter_card" "public"."enum_services_twitter_card" DEFAULT 'summary_large_image';

    ALTER TABLE IF EXISTS "services_locales"
      ADD COLUMN IF NOT EXISTS "meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "meta_description" varchar;

    ALTER TABLE IF EXISTS "services_blocks_advantages"
      ADD COLUMN IF NOT EXISTS "subtitle" jsonb,
      ADD COLUMN IF NOT EXISTS "item_layout" "public"."enum_services_blocks_advantages_item_layout" DEFAULT 'column',
      ADD COLUMN IF NOT EXISTS "columns" "public"."enum_services_blocks_advantages_columns" DEFAULT '3',
      ADD COLUMN IF NOT EXISTS "incomplete_row_alignment" "public"."enum_services_blocks_advantages_incomplete_row_alignment" DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb,
      ADD COLUMN IF NOT EXISTS "button_text" varchar,
      ADD COLUMN IF NOT EXISTS "button_link" varchar;

    ALTER TABLE IF EXISTS "services_blocks_cards"
      ADD COLUMN IF NOT EXISTS "item_layout" "public"."enum_services_blocks_cards_item_layout" DEFAULT 'column',
      ADD COLUMN IF NOT EXISTS "columns" "public"."enum_services_blocks_cards_columns" DEFAULT '4',
      ADD COLUMN IF NOT EXISTS "incomplete_row_alignment" "public"."enum_services_blocks_cards_incomplete_row_alignment" DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "intro" jsonb,
      ADD COLUMN IF NOT EXISTS "button_text" varchar,
      ADD COLUMN IF NOT EXISTS "button_link" varchar,
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb;

    ALTER TABLE IF EXISTS "services_blocks_steps"
      ADD COLUMN IF NOT EXISTS "full_width_text" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb;

    ALTER TABLE IF EXISTS "services_blocks_faq"
      ADD COLUMN IF NOT EXISTS "intro" jsonb,
      ADD COLUMN IF NOT EXISTS "columns" "public"."enum_services_blocks_faq_columns" DEFAULT 'one',
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb;

    ALTER TABLE IF EXISTS "services_blocks_comparison"
      ADD COLUMN IF NOT EXISTS "layout_style" "public"."enum_services_blocks_comparison_layout_style" DEFAULT 'cards',
      ADD COLUMN IF NOT EXISTS "intro" jsonb,
      ADD COLUMN IF NOT EXISTS "conclusion" jsonb;

    ALTER TABLE IF EXISTS "seo_settings"
      ADD COLUMN IF NOT EXISTS "site_name" varchar DEFAULT 'Dental Clinic Sulyhan',
      ADD COLUMN IF NOT EXISTS "title_template" varchar DEFAULT '%s | Dental Clinic Sulyhan',
      ADD COLUMN IF NOT EXISTS "base_url" varchar,
      ADD COLUMN IF NOT EXISTS "default_og_image_id" integer,
      ADD COLUMN IF NOT EXISTS "default_twitter_card" "public"."enum_seo_settings_default_twitter_card" DEFAULT 'summary_large_image',
      ADD COLUMN IF NOT EXISTS "index_site" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "follow_links" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "organization_name" varchar DEFAULT 'Dental Clinic Sulyhan',
      ADD COLUMN IF NOT EXISTS "organization_logo_id" integer,
      ADD COLUMN IF NOT EXISTS "organization_phone" varchar,
      ADD COLUMN IF NOT EXISTS "organization_email" varchar;

    ALTER TABLE IF EXISTS "seo_settings_locales"
      ADD COLUMN IF NOT EXISTS "default_description" varchar,
      ADD COLUMN IF NOT EXISTS "organization_address" varchar;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'pages_meta_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "pages"
          ADD CONSTRAINT "pages_meta_image_id_media_id_fk"
          FOREIGN KEY ("meta_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'services_meta_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "services"
          ADD CONSTRAINT "services_meta_image_id_media_id_fk"
          FOREIGN KEY ("meta_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'seo_settings_default_og_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "seo_settings"
          ADD CONSTRAINT "seo_settings_default_og_image_id_media_id_fk"
          FOREIGN KEY ("default_og_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'seo_settings_organization_logo_id_media_id_fk'
      ) THEN
        ALTER TABLE "seo_settings"
          ADD CONSTRAINT "seo_settings_organization_logo_id_media_id_fk"
          FOREIGN KEY ("organization_logo_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "pages_meta_image_idx" ON "pages" USING btree ("meta_image_id");
    CREATE INDEX IF NOT EXISTS "services_meta_image_idx" ON "services" USING btree ("meta_image_id");
    CREATE INDEX IF NOT EXISTS "seo_settings_default_og_image_idx" ON "seo_settings" USING btree ("default_og_image_id");
    CREATE INDEX IF NOT EXISTS "seo_settings_organization_logo_idx" ON "seo_settings" USING btree ("organization_logo_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "seo_settings_organization_logo_idx";
    DROP INDEX IF EXISTS "seo_settings_default_og_image_idx";
    DROP INDEX IF EXISTS "services_meta_image_idx";
    DROP INDEX IF EXISTS "pages_meta_image_idx";

    ALTER TABLE "seo_settings"
      DROP CONSTRAINT IF EXISTS "seo_settings_organization_logo_id_media_id_fk";
    ALTER TABLE "seo_settings"
      DROP CONSTRAINT IF EXISTS "seo_settings_default_og_image_id_media_id_fk";
    ALTER TABLE "services"
      DROP CONSTRAINT IF EXISTS "services_meta_image_id_media_id_fk";
    ALTER TABLE "pages"
      DROP CONSTRAINT IF EXISTS "pages_meta_image_id_media_id_fk";

    ALTER TABLE IF EXISTS "seo_settings_locales"
      DROP COLUMN IF EXISTS "organization_address",
      DROP COLUMN IF EXISTS "default_description";

    ALTER TABLE IF EXISTS "seo_settings"
      DROP COLUMN IF EXISTS "organization_email",
      DROP COLUMN IF EXISTS "organization_phone",
      DROP COLUMN IF EXISTS "organization_logo_id",
      DROP COLUMN IF EXISTS "organization_name",
      DROP COLUMN IF EXISTS "follow_links",
      DROP COLUMN IF EXISTS "index_site",
      DROP COLUMN IF EXISTS "default_twitter_card",
      DROP COLUMN IF EXISTS "default_og_image_id",
      DROP COLUMN IF EXISTS "base_url",
      DROP COLUMN IF EXISTS "title_template",
      DROP COLUMN IF EXISTS "site_name";

    ALTER TABLE IF EXISTS "services_blocks_comparison"
      DROP COLUMN IF EXISTS "conclusion",
      DROP COLUMN IF EXISTS "intro",
      DROP COLUMN IF EXISTS "layout_style";

    ALTER TABLE IF EXISTS "services_blocks_faq"
      DROP COLUMN IF EXISTS "bottom_text",
      DROP COLUMN IF EXISTS "columns",
      DROP COLUMN IF EXISTS "intro";

    ALTER TABLE IF EXISTS "services_blocks_steps"
      DROP COLUMN IF EXISTS "bottom_text",
      DROP COLUMN IF EXISTS "full_width_text";

    ALTER TABLE IF EXISTS "services_blocks_cards"
      DROP COLUMN IF EXISTS "bottom_text",
      DROP COLUMN IF EXISTS "button_link",
      DROP COLUMN IF EXISTS "button_text",
      DROP COLUMN IF EXISTS "intro",
      DROP COLUMN IF EXISTS "incomplete_row_alignment",
      DROP COLUMN IF EXISTS "columns",
      DROP COLUMN IF EXISTS "item_layout";

    ALTER TABLE IF EXISTS "services_blocks_advantages"
      DROP COLUMN IF EXISTS "button_link",
      DROP COLUMN IF EXISTS "button_text",
      DROP COLUMN IF EXISTS "bottom_text",
      DROP COLUMN IF EXISTS "incomplete_row_alignment",
      DROP COLUMN IF EXISTS "columns",
      DROP COLUMN IF EXISTS "item_layout",
      DROP COLUMN IF EXISTS "subtitle";

    ALTER TABLE IF EXISTS "pages_blocks_hero"
      DROP COLUMN IF EXISTS "bottom_text";

    ALTER TABLE IF EXISTS "services_locales"
      DROP COLUMN IF EXISTS "meta_description",
      DROP COLUMN IF EXISTS "meta_title";

    ALTER TABLE IF EXISTS "services"
      DROP COLUMN IF EXISTS "twitter_card",
      DROP COLUMN IF EXISTS "no_follow",
      DROP COLUMN IF EXISTS "no_index",
      DROP COLUMN IF EXISTS "canonical_url",
      DROP COLUMN IF EXISTS "meta_image_id";

    ALTER TABLE IF EXISTS "pages_locales"
      DROP COLUMN IF EXISTS "meta_description",
      DROP COLUMN IF EXISTS "meta_title";

    ALTER TABLE IF EXISTS "pages"
      DROP COLUMN IF EXISTS "twitter_card",
      DROP COLUMN IF EXISTS "no_follow",
      DROP COLUMN IF EXISTS "no_index",
      DROP COLUMN IF EXISTS "canonical_url",
      DROP COLUMN IF EXISTS "meta_image_id";

    DROP TYPE IF EXISTS "public"."enum_seo_settings_default_twitter_card";
    DROP TYPE IF EXISTS "public"."enum_services_twitter_card";
    DROP TYPE IF EXISTS "public"."enum_pages_twitter_card";
    DROP TYPE IF EXISTS "public"."enum_services_blocks_comparison_layout_style";
    DROP TYPE IF EXISTS "public"."enum_services_blocks_faq_columns";
    DROP TYPE IF EXISTS "public"."enum_services_blocks_cards_incomplete_row_alignment";
    DROP TYPE IF EXISTS "public"."enum_services_blocks_cards_columns";
    DROP TYPE IF EXISTS "public"."enum_services_blocks_cards_item_layout";
    DROP TYPE IF EXISTS "public"."enum_services_blocks_advantages_incomplete_row_alignment";
    DROP TYPE IF EXISTS "public"."enum_services_blocks_advantages_columns";
    DROP TYPE IF EXISTS "public"."enum_services_blocks_advantages_item_layout";
  `)
}
