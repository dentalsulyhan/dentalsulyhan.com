import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_advantages_item_layout" AS ENUM('column', 'row');
    CREATE TYPE "public"."enum_pages_blocks_philosophy_item_layout" AS ENUM('column', 'row');
    CREATE TYPE "public"."enum_pages_blocks_contact_section_contact_rows_order_row" AS ENUM('email', 'phone', 'address', 'transport', 'social');

    ALTER TABLE "pages_blocks_advantages" ADD COLUMN "item_layout" "public"."enum_pages_blocks_advantages_item_layout" DEFAULT 'column';
    ALTER TABLE "pages_blocks_advantages" ADD COLUMN "button_text" varchar;
    ALTER TABLE "pages_blocks_advantages" ADD COLUMN "button_link" varchar;

    ALTER TABLE "pages_blocks_about_us_grid" ADD COLUMN "button_text" varchar;
    ALTER TABLE "pages_blocks_about_us_grid" ADD COLUMN "button_link" varchar;

    ALTER TABLE "pages_blocks_philosophy" ADD COLUMN "item_layout" "public"."enum_pages_blocks_philosophy_item_layout" DEFAULT 'column';
    ALTER TABLE "pages_blocks_philosophy" ADD COLUMN "button_text" varchar;
    ALTER TABLE "pages_blocks_philosophy" ADD COLUMN "button_link" varchar;

    ALTER TABLE "pages_blocks_promotions" ADD COLUMN "button_text" varchar;
    ALTER TABLE "pages_blocks_promotions" ADD COLUMN "button_link" varchar;

    ALTER TABLE "pages_blocks_gallery" ADD COLUMN "button_text" varchar;
    ALTER TABLE "pages_blocks_gallery" ADD COLUMN "button_link" varchar;

    ALTER TABLE "pages_blocks_team" ADD COLUMN "button_text" varchar;
    ALTER TABLE "pages_blocks_team" ADD COLUMN "button_link" varchar;

    ALTER TABLE "pages_blocks_reviews" ADD COLUMN "button_text" varchar;
    ALTER TABLE "pages_blocks_reviews" ADD COLUMN "button_link" varchar;

    ALTER TABLE "pages_blocks_content" ADD COLUMN "button_text" varchar;
    ALTER TABLE "pages_blocks_content" ADD COLUMN "button_link" varchar;

    CREATE TABLE "pages_blocks_contact_section_contact_rows_order" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "row" "public"."enum_pages_blocks_contact_section_contact_rows_order_row" NOT NULL
    );

    ALTER TABLE "pages_blocks_contact_section_contact_rows_order" ADD CONSTRAINT "pages_blocks_contact_section_contact_rows_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_section"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "pages_blocks_contact_section_contact_rows_order_order_idx" ON "pages_blocks_contact_section_contact_rows_order" USING btree ("_order");
    CREATE INDEX "pages_blocks_contact_section_contact_rows_order_parent_id_idx" ON "pages_blocks_contact_section_contact_rows_order" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_contact_section_contact_rows_order_locale_idx" ON "pages_blocks_contact_section_contact_rows_order" USING btree ("_locale");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_contact_section_contact_rows_order" DROP CONSTRAINT "pages_blocks_contact_section_contact_rows_order_parent_id_fk";

    DROP INDEX "pages_blocks_contact_section_contact_rows_order_order_idx";
    DROP INDEX "pages_blocks_contact_section_contact_rows_order_parent_id_idx";
    DROP INDEX "pages_blocks_contact_section_contact_rows_order_locale_idx";

    DROP TABLE "pages_blocks_contact_section_contact_rows_order";

    ALTER TABLE "pages_blocks_content" DROP COLUMN "button_text";
    ALTER TABLE "pages_blocks_content" DROP COLUMN "button_link";

    ALTER TABLE "pages_blocks_reviews" DROP COLUMN "button_text";
    ALTER TABLE "pages_blocks_reviews" DROP COLUMN "button_link";

    ALTER TABLE "pages_blocks_team" DROP COLUMN "button_text";
    ALTER TABLE "pages_blocks_team" DROP COLUMN "button_link";

    ALTER TABLE "pages_blocks_gallery" DROP COLUMN "button_text";
    ALTER TABLE "pages_blocks_gallery" DROP COLUMN "button_link";

    ALTER TABLE "pages_blocks_promotions" DROP COLUMN "button_text";
    ALTER TABLE "pages_blocks_promotions" DROP COLUMN "button_link";

    ALTER TABLE "pages_blocks_philosophy" DROP COLUMN "item_layout";
    ALTER TABLE "pages_blocks_philosophy" DROP COLUMN "button_text";
    ALTER TABLE "pages_blocks_philosophy" DROP COLUMN "button_link";

    ALTER TABLE "pages_blocks_about_us_grid" DROP COLUMN "button_text";
    ALTER TABLE "pages_blocks_about_us_grid" DROP COLUMN "button_link";

    ALTER TABLE "pages_blocks_advantages" DROP COLUMN "item_layout";
    ALTER TABLE "pages_blocks_advantages" DROP COLUMN "button_text";
    ALTER TABLE "pages_blocks_advantages" DROP COLUMN "button_link";

    DROP TYPE "public"."enum_pages_blocks_advantages_item_layout";
    DROP TYPE "public"."enum_pages_blocks_philosophy_item_layout";
    DROP TYPE "public"."enum_pages_blocks_contact_section_contact_rows_order_row";
  `)
}
