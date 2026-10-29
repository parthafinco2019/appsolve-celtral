-- =============================================================================
-- POSTGRESQL DEAD-LETTER QUEUE & INCIDENT VAULT SCHEMA
-- Stores failed automation payloads with full execution stack and replay status
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE incident_status_enum AS ENUM (
  'NEW',
  'PENDING_RETRY',
  'CRITICAL',
  'REPLAYED',
  'RESOLVED',
  'DISCARDED'
);

CREATE TABLE IF NOT EXISTS incident_vault (
  incident_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_id VARCHAR(128) NOT NULL,
  flow_name VARCHAR(255) NOT NULL,
  error_type VARCHAR(128) NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  original_payload JSONB NOT NULL,
  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  incident_status incident_status_enum DEFAULT 'NEW',
  signature_hash VARCHAR(64) NOT NULL,
  last_alerted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- High-performance index for fast replay lookups and status aggregation
CREATE INDEX IF NOT EXISTS idx_incident_flow_status ON incident_vault (flow_id, incident_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incident_signature ON incident_vault (signature_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incident_payload_gin ON incident_vault USING GIN (original_payload);
