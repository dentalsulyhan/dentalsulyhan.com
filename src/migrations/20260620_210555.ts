import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en', 'uk');
  CREATE TYPE "public"."enum_services_blocks_content_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_header_footer_footer_social_links_platform" AS ENUM('instagram', 'facebook', 'twitter', 'youtube');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pricing_categories_services_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_name" varchar NOT NULL,
  	"price" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "pricing_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_title" varchar NOT NULL,
  	"category_description" varchar
  );
  
  CREATE TABLE "pricing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pricing_locales" (
  	"title" varchar DEFAULT 'Прайс-лист' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "promotions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"valid_until" timestamp(3) with time zone NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "promotions_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_blocks_content_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position" "enum_services_blocks_content_image_position" DEFAULT 'left',
  	"text" jsonb NOT NULL,
  	"image_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pricing_id" integer,
  	"promotions_id" integer,
  	"services_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_advantages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_button_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_footer_header_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "header_footer_header_menu_items_locales" (
  	"label" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_footer_footer_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "header_footer_footer_menu_items_locales" (
  	"label" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_footer_footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_header_footer_footer_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "header_footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_logo_id" integer,
  	"header_contacts_phone" varchar DEFAULT '+34 665-399-280',
  	"header_contacts_whatsapp" varchar DEFAULT 'https://wa.me/+34665399280',
  	"header_contacts_telegram" varchar DEFAULT 'https://t.me/+34665399280',
  	"footer_logo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_footer_locales" (
  	"footer_copyright" varchar DEFAULT '©2024 - All right reserved',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_categories_services_list" ADD CONSTRAINT "pricing_categories_services_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_categories" ADD CONSTRAINT "pricing_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_locales" ADD CONSTRAINT "pricing_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promotions_locales" ADD CONSTRAINT "promotions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_content_image" ADD CONSTRAINT "services_blocks_content_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_content_image" ADD CONSTRAINT "services_blocks_content_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_accordion" ADD CONSTRAINT "services_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pricing_fk" FOREIGN KEY ("pricing_id") REFERENCES "public"."pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_advantages" ADD CONSTRAINT "home_page_advantages_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_advantages" ADD CONSTRAINT "home_page_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_footer_header_menu_items" ADD CONSTRAINT "header_footer_header_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_footer_header_menu_items_locales" ADD CONSTRAINT "header_footer_header_menu_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_footer_header_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_footer_footer_menu_items" ADD CONSTRAINT "header_footer_footer_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_footer_footer_menu_items_locales" ADD CONSTRAINT "header_footer_footer_menu_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_footer_footer_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_footer_footer_social_links" ADD CONSTRAINT "header_footer_footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_footer" ADD CONSTRAINT "header_footer_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_footer" ADD CONSTRAINT "header_footer_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_footer_locales" ADD CONSTRAINT "header_footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "pricing_categories_services_list_order_idx" ON "pricing_categories_services_list" USING btree ("_order");
  CREATE INDEX "pricing_categories_services_list_parent_id_idx" ON "pricing_categories_services_list" USING btree ("_parent_id");
  CREATE INDEX "pricing_categories_services_list_locale_idx" ON "pricing_categories_services_list" USING btree ("_locale");
  CREATE INDEX "pricing_categories_order_idx" ON "pricing_categories" USING btree ("_order");
  CREATE INDEX "pricing_categories_parent_id_idx" ON "pricing_categories" USING btree ("_parent_id");
  CREATE INDEX "pricing_categories_locale_idx" ON "pricing_categories" USING btree ("_locale");
  CREATE INDEX "pricing_updated_at_idx" ON "pricing" USING btree ("updated_at");
  CREATE INDEX "pricing_created_at_idx" ON "pricing" USING btree ("created_at");
  CREATE UNIQUE INDEX "pricing_locales_locale_parent_id_unique" ON "pricing_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "promotions_updated_at_idx" ON "promotions" USING btree ("updated_at");
  CREATE INDEX "promotions_created_at_idx" ON "promotions" USING btree ("created_at");
  CREATE UNIQUE INDEX "promotions_locales_locale_parent_id_unique" ON "promotions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_content_image_order_idx" ON "services_blocks_content_image" USING btree ("_order");
  CREATE INDEX "services_blocks_content_image_parent_id_idx" ON "services_blocks_content_image" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_content_image_path_idx" ON "services_blocks_content_image" USING btree ("_path");
  CREATE INDEX "services_blocks_content_image_locale_idx" ON "services_blocks_content_image" USING btree ("_locale");
  CREATE INDEX "services_blocks_content_image_image_idx" ON "services_blocks_content_image" USING btree ("image_id");
  CREATE INDEX "services_blocks_accordion_order_idx" ON "services_blocks_accordion" USING btree ("_order");
  CREATE INDEX "services_blocks_accordion_parent_id_idx" ON "services_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_accordion_path_idx" ON "services_blocks_accordion" USING btree ("_path");
  CREATE INDEX "services_blocks_accordion_locale_idx" ON "services_blocks_accordion" USING btree ("_locale");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pricing_id_idx" ON "payload_locked_documents_rels" USING btree ("pricing_id");
  CREATE INDEX "payload_locked_documents_rels_promotions_id_idx" ON "payload_locked_documents_rels" USING btree ("promotions_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_advantages_order_idx" ON "home_page_advantages" USING btree ("_order");
  CREATE INDEX "home_page_advantages_parent_id_idx" ON "home_page_advantages" USING btree ("_parent_id");
  CREATE INDEX "home_page_advantages_locale_idx" ON "home_page_advantages" USING btree ("_locale");
  CREATE INDEX "home_page_advantages_icon_idx" ON "home_page_advantages" USING btree ("icon_id");
  CREATE INDEX "home_page_hero_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_footer_header_menu_items_order_idx" ON "header_footer_header_menu_items" USING btree ("_order");
  CREATE INDEX "header_footer_header_menu_items_parent_id_idx" ON "header_footer_header_menu_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_footer_header_menu_items_locales_locale_parent_id_uni" ON "header_footer_header_menu_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_footer_footer_menu_items_order_idx" ON "header_footer_footer_menu_items" USING btree ("_order");
  CREATE INDEX "header_footer_footer_menu_items_parent_id_idx" ON "header_footer_footer_menu_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_footer_footer_menu_items_locales_locale_parent_id_uni" ON "header_footer_footer_menu_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_footer_footer_social_links_order_idx" ON "header_footer_footer_social_links" USING btree ("_order");
  CREATE INDEX "header_footer_footer_social_links_parent_id_idx" ON "header_footer_footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "header_footer_header_header_logo_idx" ON "header_footer" USING btree ("header_logo_id");
  CREATE INDEX "header_footer_footer_footer_logo_idx" ON "header_footer" USING btree ("footer_logo_id");
  CREATE UNIQUE INDEX "header_footer_locales_locale_parent_id_unique" ON "header_footer_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pricing_categories_services_list" CASCADE;
  DROP TABLE "pricing_categories" CASCADE;
  DROP TABLE "pricing" CASCADE;
  DROP TABLE "pricing_locales" CASCADE;
  DROP TABLE "promotions" CASCADE;
  DROP TABLE "promotions_locales" CASCADE;
  DROP TABLE "services_blocks_content_image" CASCADE;
  DROP TABLE "services_blocks_accordion" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_advantages" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "header_footer_header_menu_items" CASCADE;
  DROP TABLE "header_footer_header_menu_items_locales" CASCADE;
  DROP TABLE "header_footer_footer_menu_items" CASCADE;
  DROP TABLE "header_footer_footer_menu_items_locales" CASCADE;
  DROP TABLE "header_footer_footer_social_links" CASCADE;
  DROP TABLE "header_footer" CASCADE;
  DROP TABLE "header_footer_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_services_blocks_content_image_position";
  DROP TYPE "public"."enum_header_footer_footer_social_links_platform";`)
}
