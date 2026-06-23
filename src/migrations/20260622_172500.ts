import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_promotions_position" AS ENUM('left', 'right');
    CREATE TYPE "public"."enum_pages_blocks_gallery_position" AS ENUM('left', 'right');

    ALTER TABLE "promotions" ADD COLUMN "image_id" integer;
    ALTER TABLE "promotions_locales" ADD COLUMN "content" jsonb;

    ALTER TABLE "pages_blocks_promotions" ADD COLUMN "position" "public"."enum_pages_blocks_promotions_position" DEFAULT 'left';
    ALTER TABLE "pages_blocks_promotions" ADD COLUMN "promotion_id" integer;

    CREATE TABLE "pages_blocks_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "position" "public"."enum_pages_blocks_gallery_position" DEFAULT 'right',
      "title" varchar,
      "description" jsonb,
      "block_name" varchar
    );

    CREATE TABLE "pages_blocks_gallery_images" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL
    );

    ALTER TABLE "promotions" ADD CONSTRAINT "promotions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_promotions" ADD CONSTRAINT "pages_blocks_promotions_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX "promotions_image_idx" ON "promotions" USING btree ("image_id");
    CREATE INDEX "pages_blocks_promotions_promotion_idx" ON "pages_blocks_promotions" USING btree ("promotion_id");
    CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
    CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
    CREATE INDEX "pages_blocks_gallery_locale_idx" ON "pages_blocks_gallery" USING btree ("_locale");
    CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
    CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_gallery_images_locale_idx" ON "pages_blocks_gallery_images" USING btree ("_locale");
    CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "promotions" DROP CONSTRAINT "promotions_image_id_media_id_fk";
    ALTER TABLE "pages_blocks_promotions" DROP CONSTRAINT "pages_blocks_promotions_promotion_id_promotions_id_fk";
    ALTER TABLE "pages_blocks_gallery" DROP CONSTRAINT "pages_blocks_gallery_parent_id_fk";
    ALTER TABLE "pages_blocks_gallery_images" DROP CONSTRAINT "pages_blocks_gallery_images_parent_id_fk";
    ALTER TABLE "pages_blocks_gallery_images" DROP CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk";

    DROP INDEX "promotions_image_idx";
    DROP INDEX "pages_blocks_promotions_promotion_idx";
    DROP INDEX "pages_blocks_gallery_order_idx";
    DROP INDEX "pages_blocks_gallery_parent_id_idx";
    DROP INDEX "pages_blocks_gallery_path_idx";
    DROP INDEX "pages_blocks_gallery_locale_idx";
    DROP INDEX "pages_blocks_gallery_images_order_idx";
    DROP INDEX "pages_blocks_gallery_images_parent_id_idx";
    DROP INDEX "pages_blocks_gallery_images_locale_idx";
    DROP INDEX "pages_blocks_gallery_images_image_idx";

    DROP TABLE "pages_blocks_gallery_images";
    DROP TABLE "pages_blocks_gallery";

    ALTER TABLE "pages_blocks_promotions" DROP COLUMN "position";
    ALTER TABLE "pages_blocks_promotions" DROP COLUMN "promotion_id";
    ALTER TABLE "promotions_locales" DROP COLUMN "content";
    ALTER TABLE "promotions" DROP COLUMN "image_id";

    DROP TYPE "public"."enum_pages_blocks_promotions_position";
    DROP TYPE "public"."enum_pages_blocks_gallery_position";
  `)
}
