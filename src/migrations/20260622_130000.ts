import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_content_image_position" AS ENUM('left', 'right');
    CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('instagram', 'facebook', 'twitter', 'youtube', 'tiktok');

    CREATE TABLE "pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "slug" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "pages_locales" (
      "title" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE "pages_blocks_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "button_text" varchar,
      "button_link" varchar,
      "image_id" integer,
      "block_name" varchar
    );

    CREATE TABLE "pages_blocks_content" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "content" jsonb NOT NULL,
      "block_name" varchar
    );

    CREATE TABLE "pages_blocks_content_image" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "position" "public"."enum_pages_blocks_content_image_position" DEFAULT 'left',
      "title" varchar,
      "text" jsonb NOT NULL,
      "button_text" varchar,
      "button_link" varchar,
      "image_id" integer NOT NULL,
      "block_name" varchar
    );

    CREATE TABLE "site_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "header_logo_id" integer,
      "footer_logo_id" integer,
      "contacts_email" varchar DEFAULT 'clinica@dentalsulyhan.com',
      "contacts_phone" varchar DEFAULT '+34 665-399-280',
      "contacts_whatsapp" varchar DEFAULT 'https://wa.me/+34665399280',
      "contacts_telegram" varchar DEFAULT 'https://t.me/+34665399280',
      "contacts_google_maps_url" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE "site_settings_locales" (
      "header_menu_button_label" varchar DEFAULT 'Menu',
      "footer_copyright" varchar DEFAULT '©2024 - All right reserved',
      "contacts_address" varchar DEFAULT 'Juan de Garay, 30, 46017, Valencia',
      "contacts_transport" varchar DEFAULT 'Metro Safranar: Lineas – 1 → 2 → 7',
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE "site_settings_menu_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link" varchar NOT NULL
    );

    CREATE TABLE "site_settings_menu_items_locales" (
      "label" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE "site_settings_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "platform" "public"."enum_site_settings_social_links_platform" NOT NULL,
      "url" varchar NOT NULL
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;

    ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_content_image" ADD CONSTRAINT "pages_blocks_content_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_content_image" ADD CONSTRAINT "pages_blocks_content_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings_menu_items" ADD CONSTRAINT "site_settings_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings_menu_items_locales" ADD CONSTRAINT "site_settings_menu_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_menu_items"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
    CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
    CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
    CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
    CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
    CREATE INDEX "pages_blocks_hero_locale_idx" ON "pages_blocks_hero" USING btree ("_locale");
    CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
    CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
    CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
    CREATE INDEX "pages_blocks_content_locale_idx" ON "pages_blocks_content" USING btree ("_locale");
    CREATE INDEX "pages_blocks_content_image_order_idx" ON "pages_blocks_content_image" USING btree ("_order");
    CREATE INDEX "pages_blocks_content_image_parent_id_idx" ON "pages_blocks_content_image" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_content_image_path_idx" ON "pages_blocks_content_image" USING btree ("_path");
    CREATE INDEX "pages_blocks_content_image_locale_idx" ON "pages_blocks_content_image" USING btree ("_locale");
    CREATE INDEX "pages_blocks_content_image_image_idx" ON "pages_blocks_content_image" USING btree ("image_id");
    CREATE INDEX "site_settings_header_header_logo_idx" ON "site_settings" USING btree ("header_logo_id");
    CREATE INDEX "site_settings_footer_footer_logo_idx" ON "site_settings" USING btree ("footer_logo_id");
    CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX "site_settings_menu_items_order_idx" ON "site_settings_menu_items" USING btree ("_order");
    CREATE INDEX "site_settings_menu_items_parent_id_idx" ON "site_settings_menu_items" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "site_settings_menu_items_locales_locale_parent_id_unique" ON "site_settings_menu_items_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
    CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
    CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
    ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_parent_id_fk";
    ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_parent_id_fk";
    ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_image_id_media_id_fk";
    ALTER TABLE "pages_blocks_content" DROP CONSTRAINT "pages_blocks_content_parent_id_fk";
    ALTER TABLE "pages_blocks_content_image" DROP CONSTRAINT "pages_blocks_content_image_parent_id_fk";
    ALTER TABLE "pages_blocks_content_image" DROP CONSTRAINT "pages_blocks_content_image_image_id_media_id_fk";
    ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_header_logo_id_media_id_fk";
    ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_footer_logo_id_media_id_fk";
    ALTER TABLE "site_settings_locales" DROP CONSTRAINT "site_settings_locales_parent_id_fk";
    ALTER TABLE "site_settings_menu_items" DROP CONSTRAINT "site_settings_menu_items_parent_id_fk";
    ALTER TABLE "site_settings_menu_items_locales" DROP CONSTRAINT "site_settings_menu_items_locales_parent_id_fk";
    ALTER TABLE "site_settings_social_links" DROP CONSTRAINT "site_settings_social_links_parent_id_fk";

    DROP INDEX "pages_slug_idx";
    DROP INDEX "pages_updated_at_idx";
    DROP INDEX "pages_created_at_idx";
    DROP INDEX "pages_locales_locale_parent_id_unique";
    DROP INDEX "pages_blocks_hero_order_idx";
    DROP INDEX "pages_blocks_hero_parent_id_idx";
    DROP INDEX "pages_blocks_hero_path_idx";
    DROP INDEX "pages_blocks_hero_locale_idx";
    DROP INDEX "pages_blocks_hero_image_idx";
    DROP INDEX "pages_blocks_content_order_idx";
    DROP INDEX "pages_blocks_content_parent_id_idx";
    DROP INDEX "pages_blocks_content_path_idx";
    DROP INDEX "pages_blocks_content_locale_idx";
    DROP INDEX "pages_blocks_content_image_order_idx";
    DROP INDEX "pages_blocks_content_image_parent_id_idx";
    DROP INDEX "pages_blocks_content_image_path_idx";
    DROP INDEX "pages_blocks_content_image_locale_idx";
    DROP INDEX "pages_blocks_content_image_image_idx";
    DROP INDEX "site_settings_header_header_logo_idx";
    DROP INDEX "site_settings_footer_footer_logo_idx";
    DROP INDEX "site_settings_locales_locale_parent_id_unique";
    DROP INDEX "site_settings_menu_items_order_idx";
    DROP INDEX "site_settings_menu_items_parent_id_idx";
    DROP INDEX "site_settings_menu_items_locales_locale_parent_id_unique";
    DROP INDEX "site_settings_social_links_order_idx";
    DROP INDEX "site_settings_social_links_parent_id_idx";
    DROP INDEX "payload_locked_documents_rels_pages_id_idx";

    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";

    DROP TABLE "pages_blocks_hero";
    DROP TABLE "pages_blocks_content";
    DROP TABLE "pages_blocks_content_image";
    DROP TABLE "pages_locales";
    DROP TABLE "pages";
    DROP TABLE "site_settings_menu_items_locales";
    DROP TABLE "site_settings_menu_items";
    DROP TABLE "site_settings_social_links";
    DROP TABLE "site_settings_locales";
    DROP TABLE "site_settings";

    DROP TYPE "public"."enum_pages_blocks_content_image_position";
    DROP TYPE "public"."enum_site_settings_social_links_platform";
  `)
}
