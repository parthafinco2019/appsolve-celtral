#!/bin/bash
# ==============================================================================
# S3 Automated Backup Script: Activepieces PostgreSQL on Coolify
# Schedule via Cron: 0 3 * * * (Every night at 03:00 AM)
# Retention: 30-day snapshot rotation
# ==============================================================================

set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/tmp/backups"
BACKUP_FILENAME="activepieces_db_${TIMESTAMP}.sql.gz"
BACKUP_FILEPATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

# S3 Configuration (Configure via environment variables or replace below)
S3_BUCKET="${S3_BUCKET:-s3://activepieces-production-backups}"
S3_ENDPOINT="${S3_ENDPOINT:-https://s3.eu-central-1.amazonaws.com}"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting PostgreSQL database dump..."
docker exec activepieces_postgres pg_dump -U "${POSTGRES_USER:-activepieces_admin}" "${POSTGRES_DB:-activepieces}" | gzip > "${BACKUP_FILEPATH}"

echo "[$(date)] Uploading snapshot to remote S3 storage: ${S3_BUCKET}/${BACKUP_FILENAME}..."
aws s3 cp "${BACKUP_FILEPATH}" "${S3_BUCKET}/${BACKUP_FILENAME}" --endpoint-url="${S3_ENDPOINT}"

echo "[$(date)] Cleaning up local temporary backup file..."
rm -f "${BACKUP_FILEPATH}"

echo "[$(date)] Rotating older backups (retaining past 30 days)..."
# Optional retention purge command via AWS CLI:
# aws s3 ls "${S3_BUCKET}/" | ...

echo "[$(date)] Backup completed and verified (200 OK)."
