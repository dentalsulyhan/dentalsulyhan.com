#!/bin/sh
# Daily encrypted PostgreSQL backup.
#   - runs `pg_dump -Fc`, verifies the archive is readable, encrypts it (AES-256, PBKDF2)
#   - keeps BACKUP_KEEP_DAYS days of encrypted dumps in /backups
#   - uploads to an S3-compatible bucket (Cloudflare R2) when BACKUP_S3_BUCKET is set
#
# Modes:  (default) loop forever, run once a day at BACKUP_HOUR_UTC
#         BACKUP_MODE=once   run a single backup and exit (manual / testing)
#
# Restore:  openssl enc -d -aes-256-cbc -pbkdf2 -pass env:BACKUP_PASSPHRASE -in X.dump.enc -out X.dump
#           pg_restore --no-owner --no-acl -d <EMPTY database> X.dump
set -eu

: "${DATABASE_URL:?DATABASE_URL is required}"
# The dump contains patient contact data, so an unencrypted backup is never produced.
: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE is required (dumps contain personal data)}"

BACKUP_DIR="${BACKUP_DIR:-/backups}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"
HOUR="${BACKUP_HOUR_UTC:-3}"

log() { echo "[backup $(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

run_backup() {
  ts="$(date -u +%Y%m%dT%H%M%SZ)"
  plain="$BACKUP_DIR/sulyhan-$ts.dump"
  enc="$plain.enc"

  umask 077
  log "dumping database"
  pg_dump -Fc --no-owner --no-acl "$DATABASE_URL" > "$plain"

  # Fail loudly on a truncated / unreadable archive instead of keeping a useless backup.
  pg_restore -l "$plain" > /dev/null
  log "archive verified ($(wc -c < "$plain") bytes)"

  openssl enc -aes-256-cbc -pbkdf2 -salt -pass env:BACKUP_PASSPHRASE -in "$plain" -out "$enc"
  rm -f "$plain"
  log "encrypted -> $enc"

  if [ -n "${BACKUP_S3_BUCKET:-}" ]; then
    endpoint_arg=""
    [ -n "${BACKUP_S3_ENDPOINT:-}" ] && endpoint_arg="--endpoint-url $BACKUP_S3_ENDPOINT"
    # shellcheck disable=SC2086
    aws s3 cp "$enc" "s3://$BACKUP_S3_BUCKET/${BACKUP_S3_PREFIX:-sulyhan}/$(basename "$enc")" $endpoint_arg --only-show-errors
    log "uploaded to s3://$BACKUP_S3_BUCKET/${BACKUP_S3_PREFIX:-sulyhan}/ (remote retention: use a bucket lifecycle rule)"
  else
    log "BACKUP_S3_BUCKET not set: backup kept only on the local volume"
  fi

  find "$BACKUP_DIR" -name 'sulyhan-*.dump.enc' -mtime "+$KEEP_DAYS" -delete
}

if [ "${BACKUP_MODE:-loop}" = "once" ]; then
  run_backup
  exit 0
fi

log "scheduler started: daily at ${HOUR}:00 UTC, keeping ${KEEP_DAYS} days"
while true; do
  today="$(date -u +%Y%m%d)"
  last="$(cat "$BACKUP_DIR/.last-run" 2>/dev/null || true)"
  if [ "$(date -u +%-H)" = "$((HOUR + 0))" ] && [ "$last" != "$today" ]; then
    # A failed backup must not stop the scheduler; it is retried at the next check.
    if run_backup; then
      echo "$today" > "$BACKUP_DIR/.last-run"
    else
      log "BACKUP FAILED, will retry in 5 minutes"
    fi
  fi
  sleep 300
done
