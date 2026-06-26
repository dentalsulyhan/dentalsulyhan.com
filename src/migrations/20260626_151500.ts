import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_locales"
      ADD COLUMN IF NOT EXISTS "path" varchar;

    ALTER TABLE "services_locales"
      ADD COLUMN IF NOT EXISTS "path" varchar;

    UPDATE "pages_locales" AS pl
    SET "path" = p."slug"
    FROM "pages" AS p
    WHERE pl."_parent_id" = p."id"
      AND (pl."path" IS NULL OR pl."path" = '');

    UPDATE "services_locales" AS sl
    SET "path" = s."slug"
    FROM "services" AS s
    WHERE sl."_parent_id" = s."id"
      AND (sl."path" IS NULL OR sl."path" = '');

    ALTER TABLE "pages_locales"
      ALTER COLUMN "path" SET NOT NULL;

    ALTER TABLE "services_locales"
      ALTER COLUMN "path" SET NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_locales"
      DROP COLUMN IF EXISTS "path";

    ALTER TABLE "services_locales"
      DROP COLUMN IF EXISTS "path";
  `)
}
