import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'site_settings_locales'
          AND column_name = 'contacts_section_description'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "site_settings_locales"
          ALTER COLUMN "contacts_section_description" SET DATA TYPE jsonb
          USING CASE
            WHEN "contacts_section_description" IS NULL THEN NULL
            ELSE jsonb_build_object(
              'root',
              jsonb_build_object(
                'type', 'root',
                'children', jsonb_build_array(
                  jsonb_build_object(
                    'type', 'paragraph',
                    'children', jsonb_build_array(
                      jsonb_build_object(
                        'type', 'text',
                        'text', "contacts_section_description",
                        'detail', 0,
                        'format', 0,
                        'mode', 'normal',
                        'style', '',
                        'version', 1
                      )
                    ),
                    'direction', NULL,
                    'format', '',
                    'indent', 0,
                    'version', 1,
                    'textFormat', 0,
                    'textStyle', ''
                  )
                ),
                'direction', NULL,
                'format', '',
                'indent', 0,
                'version', 1
              )
            )
          END;
      END IF;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'site_settings_locales'
          AND column_name = 'contacts_section_description'
          AND data_type = 'jsonb'
      ) THEN
        ALTER TABLE "site_settings_locales"
          ALTER COLUMN "contacts_section_description" SET DATA TYPE varchar
          USING CASE
            WHEN "contacts_section_description" IS NULL THEN NULL
            ELSE "contacts_section_description"->'root'->'children'->0->'children'->0->>'text'
          END;
      END IF;
    END
    $$;
  `)
}
