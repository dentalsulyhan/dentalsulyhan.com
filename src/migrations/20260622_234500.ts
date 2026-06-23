import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'site_settings_locales'
          AND column_name = 'form_notifications_admin_message'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "site_settings_locales"
          ALTER COLUMN "form_notifications_admin_message" SET DATA TYPE jsonb
          USING CASE
            WHEN "form_notifications_admin_message" IS NULL THEN NULL
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
                        'text', "form_notifications_admin_message",
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

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'site_settings_locales'
          AND column_name = 'form_notifications_user_message'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "site_settings_locales"
          ALTER COLUMN "form_notifications_user_message" SET DATA TYPE jsonb
          USING CASE
            WHEN "form_notifications_user_message" IS NULL THEN NULL
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
                        'text', "form_notifications_user_message",
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
    ALTER TABLE "site_settings_locales"
      ALTER COLUMN "form_notifications_admin_message" SET DATA TYPE varchar
      USING CASE
        WHEN "form_notifications_admin_message" IS NULL THEN NULL
        ELSE "form_notifications_admin_message"->'root'->'children'->0->'children'->0->>'text'
      END;

    ALTER TABLE "site_settings_locales"
      ALTER COLUMN "form_notifications_user_message" SET DATA TYPE varchar
      USING CASE
        WHEN "form_notifications_user_message" IS NULL THEN NULL
        ELSE "form_notifications_user_message"->'root'->'children'->0->'children'->0->>'text'
      END;
  `)
}
