import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_blocks_faq"
      ADD COLUMN IF NOT EXISTS "bottom_text" jsonb;

    ALTER TABLE "services_blocks_comparison"
      ADD COLUMN IF NOT EXISTS "left_content" jsonb,
      ADD COLUMN IF NOT EXISTS "right_content" jsonb;

    DROP TABLE IF EXISTS "services_blocks_comparison_left_items";
    DROP TABLE IF EXISTS "services_blocks_comparison_right_items";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_blocks_comparison_left_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "services_blocks_comparison_right_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_comparison_left_items_parent_id_fk'
      ) THEN
        ALTER TABLE "services_blocks_comparison_left_items"
          ADD CONSTRAINT "services_blocks_comparison_left_items_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."services_blocks_comparison"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_comparison_right_items_parent_id_fk'
      ) THEN
        ALTER TABLE "services_blocks_comparison_right_items"
          ADD CONSTRAINT "services_blocks_comparison_right_items_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."services_blocks_comparison"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "services_blocks_comparison_left_items_order_idx" ON "services_blocks_comparison_left_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "services_blocks_comparison_left_items_parent_id_idx" ON "services_blocks_comparison_left_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "services_blocks_comparison_left_items_locale_idx" ON "services_blocks_comparison_left_items" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "services_blocks_comparison_right_items_order_idx" ON "services_blocks_comparison_right_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "services_blocks_comparison_right_items_parent_id_idx" ON "services_blocks_comparison_right_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "services_blocks_comparison_right_items_locale_idx" ON "services_blocks_comparison_right_items" USING btree ("_locale");

    ALTER TABLE "services_blocks_comparison"
      DROP COLUMN IF EXISTS "left_content",
      DROP COLUMN IF EXISTS "right_content";

    ALTER TABLE "services_blocks_faq"
      DROP COLUMN IF EXISTS "bottom_text";
  `)
}
