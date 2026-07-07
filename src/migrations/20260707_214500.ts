import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_locales"
      ADD COLUMN IF NOT EXISTS "canonical_url" varchar;

    ALTER TABLE IF EXISTS "services_locales"
      ADD COLUMN IF NOT EXISTS "canonical_url" varchar;

    UPDATE "pages_locales" AS pl
    SET "canonical_url" = p."canonical_url"
    FROM "pages" AS p
    WHERE pl."_parent_id" = p."id"
      AND pl."canonical_url" IS NULL
      AND p."canonical_url" IS NOT NULL;

    UPDATE "services_locales" AS sl
    SET "canonical_url" = s."canonical_url"
    FROM "services" AS s
    WHERE sl."_parent_id" = s."id"
      AND sl."canonical_url" IS NULL
      AND s."canonical_url" IS NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "services_locales"
      DROP COLUMN IF EXISTS "canonical_url";

    ALTER TABLE IF EXISTS "pages_locales"
      DROP COLUMN IF EXISTS "canonical_url";
  `)
}
