import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_submissions" (
      "id" serial PRIMARY KEY NOT NULL,
      "full_name" varchar NOT NULL,
      "phone" varchar NOT NULL,
      "email" varchar NOT NULL,
      "patient_type" varchar NOT NULL,
      "referral_source" varchar NOT NULL,
      "comment" varchar,
      "locale" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "pages_blocks_contact_section"
      ADD COLUMN IF NOT EXISTS "full_name_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "phone_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "email_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "patient_type_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "referral_source_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "comment_placeholder" varchar,
      ADD COLUMN IF NOT EXISTS "success_message" varchar,
      ADD COLUMN IF NOT EXISTS "error_message" varchar;

    CREATE TABLE IF NOT EXISTS "pages_blocks_contact_section_patient_type_options" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_contact_section_referral_source_options" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'pages_blocks_contact_section_patient_type_options_parent_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_contact_section_patient_type_options"
          ADD CONSTRAINT "pages_blocks_contact_section_patient_type_options_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."pages_blocks_contact_section"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END
    $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'pages_blocks_contact_section_referral_source_options_parent_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_contact_section_referral_source_options"
          ADD CONSTRAINT "pages_blocks_contact_section_referral_source_options_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."pages_blocks_contact_section"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "contact_submissions_locale_idx" ON "contact_submissions" USING btree ("locale");

    CREATE INDEX IF NOT EXISTS "pages_blocks_contact_section_patient_type_options_order_idx" ON "pages_blocks_contact_section_patient_type_options" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_contact_section_patient_type_options_parent_id_idx" ON "pages_blocks_contact_section_patient_type_options" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_contact_section_patient_type_options_locale_idx" ON "pages_blocks_contact_section_patient_type_options" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "pages_blocks_contact_section_referral_source_options_order_idx" ON "pages_blocks_contact_section_referral_source_options" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_contact_section_referral_source_options_parent_id_idx" ON "pages_blocks_contact_section_referral_source_options" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_contact_section_referral_source_options_locale_idx" ON "pages_blocks_contact_section_referral_source_options" USING btree ("_locale");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_contact_section_patient_type_options"
      DROP CONSTRAINT "pages_blocks_contact_section_patient_type_options_parent_id_fk";

    ALTER TABLE "pages_blocks_contact_section_referral_source_options"
      DROP CONSTRAINT "pages_blocks_contact_section_referral_source_options_parent_id_fk";

    DROP INDEX "contact_submissions_updated_at_idx";
    DROP INDEX "contact_submissions_created_at_idx";
    DROP INDEX "contact_submissions_locale_idx";

    DROP INDEX "pages_blocks_contact_section_patient_type_options_order_idx";
    DROP INDEX "pages_blocks_contact_section_patient_type_options_parent_id_idx";
    DROP INDEX "pages_blocks_contact_section_patient_type_options_locale_idx";

    DROP INDEX "pages_blocks_contact_section_referral_source_options_order_idx";
    DROP INDEX "pages_blocks_contact_section_referral_source_options_parent_id_idx";
    DROP INDEX "pages_blocks_contact_section_referral_source_options_locale_idx";

    DROP TABLE "contact_submissions";
    DROP TABLE "pages_blocks_contact_section_patient_type_options";
    DROP TABLE "pages_blocks_contact_section_referral_source_options";

    ALTER TABLE "pages_blocks_contact_section"
      DROP COLUMN "full_name_placeholder",
      DROP COLUMN "phone_placeholder",
      DROP COLUMN "email_placeholder",
      DROP COLUMN "patient_type_placeholder",
      DROP COLUMN "referral_source_placeholder",
      DROP COLUMN "comment_placeholder",
      DROP COLUMN "success_message",
      DROP COLUMN "error_message";
  `)
}
