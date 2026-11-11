#!/usr/bin/env bash
# Copy the production database (Supabase) into a NEW PostgreSQL on the VPS.
#
# Safety guarantees:
#   * the SOURCE is only ever read (pg_dump + SELECT count). Nothing is written to it.
#   * the TARGET must be EMPTY (no tables in schema "public"); the script refuses otherwise,
#     so an existing database can never be overwritten or merged into.
#   * the TARGET must not look like Supabase and must differ from the SOURCE.
#
# Usage:
#   SOURCE_URL='postgresql://...supabase...:5432/postgres' \
#   TARGET_URL='postgres://user:pass@127.0.0.1:5432/dbname' \
#   deploy/scripts/db-copy.sh
#
# Notes:
#   * For SOURCE use the DIRECT or SESSION-pooler connection (port 5432), not the
#     transaction pooler (6543): pg_dump needs session features.
#   * The dump file contains personal data. It is written with mode 600 to DUMP_DIR
#     (default ./db-dump) and removed on exit, also after a failure, unless KEEP_DUMP=1.
#   * If the restore fails half-way, DROP and re-create the (new) target database before retrying.
set -euo pipefail

: "${SOURCE_URL:?SOURCE_URL is required}"
: "${TARGET_URL:?TARGET_URL is required}"

DUMP_DIR="${DUMP_DIR:-./db-dump}"
PSQL="${PSQL:-psql}"
PG_DUMP="${PG_DUMP:-pg_dump}"
PG_RESTORE="${PG_RESTORE:-pg_restore}"

die() { echo "ERROR: $*" >&2; exit 1; }
q() { "$PSQL" "$1" -X -At -v ON_ERROR_STOP=1 -c "$2"; }

[ "$SOURCE_URL" != "$TARGET_URL" ] || die "SOURCE_URL and TARGET_URL are identical"
case "$TARGET_URL" in *supabase*|*pooler*) die "TARGET_URL looks like Supabase. Refusing to write there." ;; esac

echo "== checking connections"
src_ver="$(q "$SOURCE_URL" "show server_version_num")"
dst_ver="$(q "$TARGET_URL" "show server_version_num")"
echo "source server_version_num=$src_ver  target=$dst_ver"
[ "${dst_ver:0:2}" -ge "${src_ver:0:2}" ] || die "target PostgreSQL major version is older than the source: pg_restore would fail"

echo "== checking that the target is empty"
tables="$(q "$TARGET_URL" "select count(*) from information_schema.tables where table_schema='public'")"
[ "$tables" = "0" ] || die "target already has $tables table(s) in schema public. Refusing to touch a non-empty database."

mkdir -p "$DUMP_DIR"; chmod 700 "$DUMP_DIR"
dump="$DUMP_DIR/sulyhan-$(date -u +%Y%m%dT%H%M%SZ).dump"

echo "== dumping source (read-only)"
# The dump holds personal data: remove it on ANY exit (success or failure) unless KEEP_DUMP=1.
cleanup() { if [ "${KEEP_DUMP:-0}" != "1" ]; then rm -f "$dump" "$dump.list"; fi; }
trap cleanup EXIT

( umask 077; "$PG_DUMP" "$SOURCE_URL" -Fc --no-owner --no-acl -n public -f "$dump" )
"$PG_RESTORE" -l "$dump" >/dev/null || die "dump archive is not readable"

# The target already has the default "public" schema, so skip the CREATE SCHEMA entry.
"$PG_RESTORE" -l "$dump" | grep -vE '[0-9]+; [0-9]+ [0-9]+ SCHEMA - public ' > "$dump.list"

echo "== restoring into target"
"$PG_RESTORE" --no-owner --no-acl --exit-on-error -L "$dump.list" -d "$TARGET_URL" "$dump"

echo "== removing the Payload dev-mode marker from the TARGET (otherwise 'payload migrate' prompts and hangs)"
q "$TARGET_URL" "delete from payload_migrations where batch = -1" >/dev/null

echo "== verifying row counts (source vs target)"
bad=0
for t in $(q "$TARGET_URL" "select tablename from pg_tables where schemaname='public' order by 1"); do
  a="$(q "$SOURCE_URL" "select count(*) from public.\"$t\"")"
  b="$(q "$TARGET_URL" "select count(*) from public.\"$t\"")"
  if [ "$t" = "payload_migrations" ]; then a=$((a - $(q "$SOURCE_URL" "select count(*) from public.payload_migrations where batch = -1"))); fi
  if [ "$a" != "$b" ]; then echo "MISMATCH $t: source=$a target=$b"; bad=1; fi
done
[ "$bad" = "0" ] || die "row counts differ (re-run with KEEP_DUMP=1 to inspect the dump)"
echo "all $(q "$TARGET_URL" "select count(*) from pg_tables where schemaname='public'") tables match"

if [ "${KEEP_DUMP:-0}" = "1" ]; then echo "dump kept: $dump (contains personal data, delete it when done)"; else echo "dump will be removed"; fi
echo "DONE. Next: docker compose --profile tools run --rm migrate"
