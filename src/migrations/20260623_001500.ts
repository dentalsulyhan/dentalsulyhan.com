import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_services_preview_position" AS ENUM('left', 'right');

    ALTER TABLE "services"
      ADD COLUMN "order" numeric DEFAULT 0,
      ADD COLUMN "preview_image_id" integer,
      ADD COLUMN "preview_position" "public"."enum_services_preview_position" DEFAULT 'left';

    ALTER TABLE "services"
      ADD CONSTRAINT "services_preview_image_id_media_id_fk"
      FOREIGN KEY ("preview_image_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null
      ON UPDATE no action;

    ALTER TABLE "services_locales"
      ADD COLUMN "listing_intro" jsonb,
      ADD COLUMN "details_button_label" varchar;

    CREATE TABLE "services_listing_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "price" varchar NOT NULL,
      "note" varchar
    );

    ALTER TABLE "services_listing_items"
      ADD CONSTRAINT "services_listing_items_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."services"("id")
      ON DELETE cascade
      ON UPDATE no action;

    CREATE INDEX "services_order_idx" ON "services" USING btree ("order");
    CREATE INDEX "services_preview_image_idx" ON "services" USING btree ("preview_image_id");
    CREATE INDEX "services_listing_items_order_idx" ON "services_listing_items" USING btree ("_order");
    CREATE INDEX "services_listing_items_parent_id_idx" ON "services_listing_items" USING btree ("_parent_id");
    CREATE INDEX "services_listing_items_locale_idx" ON "services_listing_items" USING btree ("_locale");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_listing_items" DROP CONSTRAINT "services_listing_items_parent_id_fk";
    ALTER TABLE "services" DROP CONSTRAINT "services_preview_image_id_media_id_fk";

    DROP INDEX "services_order_idx";
    DROP INDEX "services_preview_image_idx";
    DROP INDEX "services_listing_items_order_idx";
    DROP INDEX "services_listing_items_parent_id_idx";
    DROP INDEX "services_listing_items_locale_idx";

    DROP TABLE "services_listing_items";

    ALTER TABLE "services_locales"
      DROP COLUMN "listing_intro",
      DROP COLUMN "details_button_label";

    ALTER TABLE "services"
      DROP COLUMN "order",
      DROP COLUMN "preview_image_id",
      DROP COLUMN "preview_position";

    DROP TYPE "public"."enum_services_preview_position";
  `)
}
