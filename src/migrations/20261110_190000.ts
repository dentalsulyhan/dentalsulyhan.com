import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds layout blocks shared by `pages` and `services`:
 * - `timeline` (+ `_items`) — horizontal stages with icons connected by a line
 * - `iconHighlight` — icon, vertical divider, title and rich text
 * - `advantages.iconStyle` — plain icon or icon in a circle
 */

const PARENTS = ['pages', 'services'] as const

function createEnum(name: string, values: string[]) {
  const list = values.map((value) => `'${value}'`).join(', ')
  return `
    DO $$ BEGIN
      CREATE TYPE "public"."${name}" AS ENUM (${list});
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`
}

function addConstraint(table: string, name: string, definition: string) {
  return `
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${name}') THEN
        ALTER TABLE "${table}" ADD CONSTRAINT "${name}" ${definition};
      END IF;
    END $$;`
}

function index(table: string, column: string, suffix: string) {
  return `CREATE INDEX IF NOT EXISTS "${table}_${suffix}_idx" ON "${table}" USING btree ("${column}");`
}

function upSql(parent: (typeof PARENTS)[number]) {
  const advantages = `${parent}_blocks_advantages`
  const timeline = `${parent}_blocks_timeline`
  const timelineItems = `${parent}_blocks_timeline_items`
  const highlight = `${parent}_blocks_icon_highlight`
  const themes = ['white', 'soft', 'sand', 'sage']
  const iconSources = ['upload', 'fontAwesome']

  return `
    ${createEnum(`enum_${advantages}_icon_style`, ['plain', 'circle'])}
    ${createEnum(`enum_${timeline}_theme`, themes)}
    ${createEnum(`enum_${timelineItems}_icon_source`, iconSources)}
    ${createEnum(`enum_${highlight}_theme`, themes)}
    ${createEnum(`enum_${highlight}_icon_source`, iconSources)}

    ALTER TABLE IF EXISTS "${advantages}"
      ADD COLUMN IF NOT EXISTS "icon_style" "public"."enum_${advantages}_icon_style" DEFAULT 'plain';

    CREATE TABLE IF NOT EXISTS "${timeline}" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "theme" "public"."enum_${timeline}_theme" DEFAULT 'white',
      "compact_spacing" boolean DEFAULT false,
      "section_title" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "${timelineItems}" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_source" "public"."enum_${timelineItems}_icon_source" DEFAULT 'upload',
      "icon_id" integer,
      "font_awesome_icon" varchar,
      "title" varchar NOT NULL,
      "text" jsonb
    );

    CREATE TABLE IF NOT EXISTS "${highlight}" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "theme" "public"."enum_${highlight}_theme" DEFAULT 'soft',
      "compact_spacing" boolean DEFAULT false,
      "icon_source" "public"."enum_${highlight}_icon_source" DEFAULT 'upload',
      "icon_id" integer,
      "font_awesome_icon" varchar,
      "title" varchar,
      "content" jsonb,
      "block_name" varchar
    );

    ${addConstraint(timeline, `${timeline}_parent_id_fk`, `FOREIGN KEY ("_parent_id") REFERENCES "public"."${parent}"("id") ON DELETE cascade ON UPDATE no action`)}
    ${addConstraint(timelineItems, `${timelineItems}_parent_id_fk`, `FOREIGN KEY ("_parent_id") REFERENCES "public"."${timeline}"("id") ON DELETE cascade ON UPDATE no action`)}
    ${addConstraint(timelineItems, `${timelineItems}_icon_id_media_id_fk`, `FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`)}
    ${addConstraint(highlight, `${highlight}_parent_id_fk`, `FOREIGN KEY ("_parent_id") REFERENCES "public"."${parent}"("id") ON DELETE cascade ON UPDATE no action`)}
    ${addConstraint(highlight, `${highlight}_icon_id_media_id_fk`, `FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`)}

    ${index(timeline, '_order', 'order')}
    ${index(timeline, '_parent_id', 'parent_id')}
    ${index(timeline, '_path', 'path')}
    ${index(timeline, '_locale', 'locale')}
    ${index(timelineItems, '_order', 'order')}
    ${index(timelineItems, '_parent_id', 'parent_id')}
    ${index(timelineItems, '_locale', 'locale')}
    ${index(timelineItems, 'icon_id', 'icon')}
    ${index(highlight, '_order', 'order')}
    ${index(highlight, '_parent_id', 'parent_id')}
    ${index(highlight, '_path', 'path')}
    ${index(highlight, '_locale', 'locale')}
    ${index(highlight, 'icon_id', 'icon')}
  `
}

function downSql(parent: (typeof PARENTS)[number]) {
  const advantages = `${parent}_blocks_advantages`
  const timeline = `${parent}_blocks_timeline`
  const timelineItems = `${parent}_blocks_timeline_items`
  const highlight = `${parent}_blocks_icon_highlight`

  return `
    DROP TABLE IF EXISTS "${timelineItems}" CASCADE;
    DROP TABLE IF EXISTS "${timeline}" CASCADE;
    DROP TABLE IF EXISTS "${highlight}" CASCADE;

    ALTER TABLE IF EXISTS "${advantages}"
      DROP COLUMN IF EXISTS "icon_style";

    DROP TYPE IF EXISTS "public"."enum_${advantages}_icon_style";
    DROP TYPE IF EXISTS "public"."enum_${timeline}_theme";
    DROP TYPE IF EXISTS "public"."enum_${timelineItems}_icon_source";
    DROP TYPE IF EXISTS "public"."enum_${highlight}_theme";
    DROP TYPE IF EXISTS "public"."enum_${highlight}_icon_source";
  `
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const parent of PARENTS) {
    await db.execute(sql.raw(upSql(parent)))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const parent of PARENTS) {
    await db.execute(sql.raw(downSql(parent)))
  }
}
