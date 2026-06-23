import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_promotions_source" AS ENUM('active', 'manual');
    CREATE TYPE "public"."enum_pages_blocks_team_source" AS ENUM('all', 'manual');

    CREATE TABLE "pages_blocks_advantages" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_title" varchar,
      "block_name" varchar
    );

    CREATE TABLE "pages_blocks_advantages_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "title" varchar NOT NULL,
      "text" jsonb NOT NULL
    );

    CREATE TABLE "pages_blocks_about_us_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_title" varchar,
      "block_name" varchar
    );

    CREATE TABLE "pages_blocks_about_us_grid_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "text" jsonb NOT NULL,
      "button_text" varchar,
      "button_link" varchar,
      "image_id" integer NOT NULL
    );

    CREATE TABLE "pages_blocks_philosophy" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_title" varchar,
      "block_name" varchar
    );

    CREATE TABLE "pages_blocks_philosophy_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "title" varchar NOT NULL,
      "text" jsonb NOT NULL
    );

    CREATE TABLE "pages_blocks_promotions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_title" varchar,
      "intro" jsonb,
      "source" "public"."enum_pages_blocks_promotions_source" DEFAULT 'active',
      "limit" numeric DEFAULT 6,
      "block_name" varchar
    );

    CREATE TABLE "pages_blocks_team" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_title" varchar,
      "description" jsonb,
      "source" "public"."enum_pages_blocks_team_source" DEFAULT 'all',
      "slider_limit" numeric DEFAULT 12,
      "block_name" varchar
    );

    CREATE TABLE "pages_blocks_reviews" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_title" varchar,
      "embed_code" varchar,
      "block_name" varchar
    );

    CREATE TABLE "pages_blocks_contact_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_title" varchar,
      "section_description" jsonb,
      "form_title" varchar,
      "form_description" jsonb,
      "submit_button_label" varchar,
      "block_name" varchar
    );

    CREATE TABLE "pages_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "locale" "public"."_locales",
      "promotions_id" integer,
      "team_members_id" integer
    );

    ALTER TABLE "pages_blocks_advantages" ADD CONSTRAINT "pages_blocks_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_advantages_items" ADD CONSTRAINT "pages_blocks_advantages_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_advantages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_advantages_items" ADD CONSTRAINT "pages_blocks_advantages_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_about_us_grid" ADD CONSTRAINT "pages_blocks_about_us_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_about_us_grid_items" ADD CONSTRAINT "pages_blocks_about_us_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_us_grid"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_about_us_grid_items" ADD CONSTRAINT "pages_blocks_about_us_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_philosophy" ADD CONSTRAINT "pages_blocks_philosophy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_philosophy_items" ADD CONSTRAINT "pages_blocks_philosophy_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_philosophy"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_philosophy_items" ADD CONSTRAINT "pages_blocks_philosophy_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_promotions" ADD CONSTRAINT "pages_blocks_promotions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_reviews" ADD CONSTRAINT "pages_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_contact_section" ADD CONSTRAINT "pages_blocks_contact_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "pages_blocks_advantages_order_idx" ON "pages_blocks_advantages" USING btree ("_order");
    CREATE INDEX "pages_blocks_advantages_parent_id_idx" ON "pages_blocks_advantages" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_advantages_path_idx" ON "pages_blocks_advantages" USING btree ("_path");
    CREATE INDEX "pages_blocks_advantages_locale_idx" ON "pages_blocks_advantages" USING btree ("_locale");
    CREATE INDEX "pages_blocks_advantages_items_order_idx" ON "pages_blocks_advantages_items" USING btree ("_order");
    CREATE INDEX "pages_blocks_advantages_items_parent_id_idx" ON "pages_blocks_advantages_items" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_advantages_items_locale_idx" ON "pages_blocks_advantages_items" USING btree ("_locale");
    CREATE INDEX "pages_blocks_advantages_items_icon_idx" ON "pages_blocks_advantages_items" USING btree ("icon_id");
    CREATE INDEX "pages_blocks_about_us_grid_order_idx" ON "pages_blocks_about_us_grid" USING btree ("_order");
    CREATE INDEX "pages_blocks_about_us_grid_parent_id_idx" ON "pages_blocks_about_us_grid" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_about_us_grid_path_idx" ON "pages_blocks_about_us_grid" USING btree ("_path");
    CREATE INDEX "pages_blocks_about_us_grid_locale_idx" ON "pages_blocks_about_us_grid" USING btree ("_locale");
    CREATE INDEX "pages_blocks_about_us_grid_items_order_idx" ON "pages_blocks_about_us_grid_items" USING btree ("_order");
    CREATE INDEX "pages_blocks_about_us_grid_items_parent_id_idx" ON "pages_blocks_about_us_grid_items" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_about_us_grid_items_locale_idx" ON "pages_blocks_about_us_grid_items" USING btree ("_locale");
    CREATE INDEX "pages_blocks_about_us_grid_items_image_idx" ON "pages_blocks_about_us_grid_items" USING btree ("image_id");
    CREATE INDEX "pages_blocks_philosophy_order_idx" ON "pages_blocks_philosophy" USING btree ("_order");
    CREATE INDEX "pages_blocks_philosophy_parent_id_idx" ON "pages_blocks_philosophy" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_philosophy_path_idx" ON "pages_blocks_philosophy" USING btree ("_path");
    CREATE INDEX "pages_blocks_philosophy_locale_idx" ON "pages_blocks_philosophy" USING btree ("_locale");
    CREATE INDEX "pages_blocks_philosophy_items_order_idx" ON "pages_blocks_philosophy_items" USING btree ("_order");
    CREATE INDEX "pages_blocks_philosophy_items_parent_id_idx" ON "pages_blocks_philosophy_items" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_philosophy_items_locale_idx" ON "pages_blocks_philosophy_items" USING btree ("_locale");
    CREATE INDEX "pages_blocks_philosophy_items_icon_idx" ON "pages_blocks_philosophy_items" USING btree ("icon_id");
    CREATE INDEX "pages_blocks_promotions_order_idx" ON "pages_blocks_promotions" USING btree ("_order");
    CREATE INDEX "pages_blocks_promotions_parent_id_idx" ON "pages_blocks_promotions" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_promotions_path_idx" ON "pages_blocks_promotions" USING btree ("_path");
    CREATE INDEX "pages_blocks_promotions_locale_idx" ON "pages_blocks_promotions" USING btree ("_locale");
    CREATE INDEX "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
    CREATE INDEX "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
    CREATE INDEX "pages_blocks_team_locale_idx" ON "pages_blocks_team" USING btree ("_locale");
    CREATE INDEX "pages_blocks_reviews_order_idx" ON "pages_blocks_reviews" USING btree ("_order");
    CREATE INDEX "pages_blocks_reviews_parent_id_idx" ON "pages_blocks_reviews" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_reviews_path_idx" ON "pages_blocks_reviews" USING btree ("_path");
    CREATE INDEX "pages_blocks_reviews_locale_idx" ON "pages_blocks_reviews" USING btree ("_locale");
    CREATE INDEX "pages_blocks_contact_section_order_idx" ON "pages_blocks_contact_section" USING btree ("_order");
    CREATE INDEX "pages_blocks_contact_section_parent_id_idx" ON "pages_blocks_contact_section" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_contact_section_path_idx" ON "pages_blocks_contact_section" USING btree ("_path");
    CREATE INDEX "pages_blocks_contact_section_locale_idx" ON "pages_blocks_contact_section" USING btree ("_locale");
    CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
    CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
    CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
    CREATE INDEX "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
    CREATE INDEX "pages_rels_promotions_id_idx" ON "pages_rels" USING btree ("promotions_id","locale");
    CREATE INDEX "pages_rels_team_members_id_idx" ON "pages_rels" USING btree ("team_members_id","locale");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_advantages" DROP CONSTRAINT "pages_blocks_advantages_parent_id_fk";
    ALTER TABLE "pages_blocks_advantages_items" DROP CONSTRAINT "pages_blocks_advantages_items_parent_id_fk";
    ALTER TABLE "pages_blocks_advantages_items" DROP CONSTRAINT "pages_blocks_advantages_items_icon_id_media_id_fk";
    ALTER TABLE "pages_blocks_about_us_grid" DROP CONSTRAINT "pages_blocks_about_us_grid_parent_id_fk";
    ALTER TABLE "pages_blocks_about_us_grid_items" DROP CONSTRAINT "pages_blocks_about_us_grid_items_parent_id_fk";
    ALTER TABLE "pages_blocks_about_us_grid_items" DROP CONSTRAINT "pages_blocks_about_us_grid_items_image_id_media_id_fk";
    ALTER TABLE "pages_blocks_philosophy" DROP CONSTRAINT "pages_blocks_philosophy_parent_id_fk";
    ALTER TABLE "pages_blocks_philosophy_items" DROP CONSTRAINT "pages_blocks_philosophy_items_parent_id_fk";
    ALTER TABLE "pages_blocks_philosophy_items" DROP CONSTRAINT "pages_blocks_philosophy_items_icon_id_media_id_fk";
    ALTER TABLE "pages_blocks_promotions" DROP CONSTRAINT "pages_blocks_promotions_parent_id_fk";
    ALTER TABLE "pages_blocks_team" DROP CONSTRAINT "pages_blocks_team_parent_id_fk";
    ALTER TABLE "pages_blocks_reviews" DROP CONSTRAINT "pages_blocks_reviews_parent_id_fk";
    ALTER TABLE "pages_blocks_contact_section" DROP CONSTRAINT "pages_blocks_contact_section_parent_id_fk";
    ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_parent_fk";
    ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_promotions_fk";
    ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_team_members_fk";

    DROP INDEX "pages_blocks_advantages_order_idx";
    DROP INDEX "pages_blocks_advantages_parent_id_idx";
    DROP INDEX "pages_blocks_advantages_path_idx";
    DROP INDEX "pages_blocks_advantages_locale_idx";
    DROP INDEX "pages_blocks_advantages_items_order_idx";
    DROP INDEX "pages_blocks_advantages_items_parent_id_idx";
    DROP INDEX "pages_blocks_advantages_items_locale_idx";
    DROP INDEX "pages_blocks_advantages_items_icon_idx";
    DROP INDEX "pages_blocks_about_us_grid_order_idx";
    DROP INDEX "pages_blocks_about_us_grid_parent_id_idx";
    DROP INDEX "pages_blocks_about_us_grid_path_idx";
    DROP INDEX "pages_blocks_about_us_grid_locale_idx";
    DROP INDEX "pages_blocks_about_us_grid_items_order_idx";
    DROP INDEX "pages_blocks_about_us_grid_items_parent_id_idx";
    DROP INDEX "pages_blocks_about_us_grid_items_locale_idx";
    DROP INDEX "pages_blocks_about_us_grid_items_image_idx";
    DROP INDEX "pages_blocks_philosophy_order_idx";
    DROP INDEX "pages_blocks_philosophy_parent_id_idx";
    DROP INDEX "pages_blocks_philosophy_path_idx";
    DROP INDEX "pages_blocks_philosophy_locale_idx";
    DROP INDEX "pages_blocks_philosophy_items_order_idx";
    DROP INDEX "pages_blocks_philosophy_items_parent_id_idx";
    DROP INDEX "pages_blocks_philosophy_items_locale_idx";
    DROP INDEX "pages_blocks_philosophy_items_icon_idx";
    DROP INDEX "pages_blocks_promotions_order_idx";
    DROP INDEX "pages_blocks_promotions_parent_id_idx";
    DROP INDEX "pages_blocks_promotions_path_idx";
    DROP INDEX "pages_blocks_promotions_locale_idx";
    DROP INDEX "pages_blocks_team_order_idx";
    DROP INDEX "pages_blocks_team_parent_id_idx";
    DROP INDEX "pages_blocks_team_path_idx";
    DROP INDEX "pages_blocks_team_locale_idx";
    DROP INDEX "pages_blocks_reviews_order_idx";
    DROP INDEX "pages_blocks_reviews_parent_id_idx";
    DROP INDEX "pages_blocks_reviews_path_idx";
    DROP INDEX "pages_blocks_reviews_locale_idx";
    DROP INDEX "pages_blocks_contact_section_order_idx";
    DROP INDEX "pages_blocks_contact_section_parent_id_idx";
    DROP INDEX "pages_blocks_contact_section_path_idx";
    DROP INDEX "pages_blocks_contact_section_locale_idx";
    DROP INDEX "pages_rels_order_idx";
    DROP INDEX "pages_rels_parent_idx";
    DROP INDEX "pages_rels_path_idx";
    DROP INDEX "pages_rels_locale_idx";
    DROP INDEX "pages_rels_promotions_id_idx";
    DROP INDEX "pages_rels_team_members_id_idx";

    DROP TABLE "pages_blocks_advantages_items";
    DROP TABLE "pages_blocks_advantages";
    DROP TABLE "pages_blocks_about_us_grid_items";
    DROP TABLE "pages_blocks_about_us_grid";
    DROP TABLE "pages_blocks_philosophy_items";
    DROP TABLE "pages_blocks_philosophy";
    DROP TABLE "pages_blocks_promotions";
    DROP TABLE "pages_blocks_team";
    DROP TABLE "pages_blocks_reviews";
    DROP TABLE "pages_blocks_contact_section";
    DROP TABLE "pages_rels";

    DROP TYPE "public"."enum_pages_blocks_promotions_source";
    DROP TYPE "public"."enum_pages_blocks_team_source";
  `)
}
