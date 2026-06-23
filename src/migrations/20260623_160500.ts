import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'promotions_locales'
          AND column_name = 'description'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "promotions_locales"
          ALTER COLUMN "description" SET DATA TYPE jsonb
          USING CASE
            WHEN "description" IS NULL THEN NULL
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
                        'text', "description",
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
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'team_members_locales'
          AND column_name = 'description'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "team_members_locales"
          ALTER COLUMN "description" SET DATA TYPE jsonb
          USING CASE
            WHEN "description" IS NULL THEN NULL
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
                        'text', "description",
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
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pricing_categories'
          AND column_name = 'category_description'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "pricing_categories"
          ALTER COLUMN "category_description" SET DATA TYPE jsonb
          USING CASE
            WHEN "category_description" IS NULL THEN NULL
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
                        'text', "category_description",
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
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'home_page_advantages'
          AND column_name = 'description'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "home_page_advantages"
          ALTER COLUMN "description" SET DATA TYPE jsonb
          USING CASE
            WHEN "description" IS NULL THEN NULL
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
                        'text', "description",
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
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'home_page_philosophy_cards'
          AND column_name = 'description'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "home_page_philosophy_cards"
          ALTER COLUMN "description" SET DATA TYPE jsonb
          USING CASE
            WHEN "description" IS NULL THEN NULL
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
                        'text', "description",
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
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'home_page_locales'
          AND column_name = 'gallery_description'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "home_page_locales"
          ALTER COLUMN "gallery_description" SET DATA TYPE jsonb
          USING CASE
            WHEN "gallery_description" IS NULL THEN NULL
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
                        'text', "gallery_description",
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
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'home_page_locales'
          AND column_name = 'contacts_section_description'
          AND data_type <> 'jsonb'
      ) THEN
        ALTER TABLE "home_page_locales"
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
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'home_page_locales'
          AND column_name = 'contacts_section_description'
          AND data_type = 'jsonb'
      ) THEN
        ALTER TABLE "home_page_locales"
          ALTER COLUMN "contacts_section_description" SET DATA TYPE varchar
          USING CASE
            WHEN "contacts_section_description" IS NULL THEN NULL
            ELSE "contacts_section_description"->'root'->'children'->0->'children'->0->>'text'
          END;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'home_page_locales'
          AND column_name = 'gallery_description'
          AND data_type = 'jsonb'
      ) THEN
        ALTER TABLE "home_page_locales"
          ALTER COLUMN "gallery_description" SET DATA TYPE varchar
          USING CASE
            WHEN "gallery_description" IS NULL THEN NULL
            ELSE "gallery_description"->'root'->'children'->0->'children'->0->>'text'
          END;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'home_page_philosophy_cards'
          AND column_name = 'description'
          AND data_type = 'jsonb'
      ) THEN
        ALTER TABLE "home_page_philosophy_cards"
          ALTER COLUMN "description" SET DATA TYPE varchar
          USING CASE
            WHEN "description" IS NULL THEN NULL
            ELSE "description"->'root'->'children'->0->'children'->0->>'text'
          END;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'home_page_advantages'
          AND column_name = 'description'
          AND data_type = 'jsonb'
      ) THEN
        ALTER TABLE "home_page_advantages"
          ALTER COLUMN "description" SET DATA TYPE varchar
          USING CASE
            WHEN "description" IS NULL THEN NULL
            ELSE "description"->'root'->'children'->0->'children'->0->>'text'
          END;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pricing_categories'
          AND column_name = 'category_description'
          AND data_type = 'jsonb'
      ) THEN
        ALTER TABLE "pricing_categories"
          ALTER COLUMN "category_description" SET DATA TYPE varchar
          USING CASE
            WHEN "category_description" IS NULL THEN NULL
            ELSE "category_description"->'root'->'children'->0->'children'->0->>'text'
          END;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'team_members_locales'
          AND column_name = 'description'
          AND data_type = 'jsonb'
      ) THEN
        ALTER TABLE "team_members_locales"
          ALTER COLUMN "description" SET DATA TYPE varchar
          USING CASE
            WHEN "description" IS NULL THEN NULL
            ELSE "description"->'root'->'children'->0->'children'->0->>'text'
          END;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'promotions_locales'
          AND column_name = 'description'
          AND data_type = 'jsonb'
      ) THEN
        ALTER TABLE "promotions_locales"
          ALTER COLUMN "description" SET DATA TYPE varchar
          USING CASE
            WHEN "description" IS NULL THEN NULL
            ELSE "description"->'root'->'children'->0->'children'->0->>'text'
          END;
      END IF;
    END
    $$;
  `)
}
