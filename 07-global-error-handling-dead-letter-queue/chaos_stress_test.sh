#!/bin/bash
# ==============================================================================
# CHAOS ENGINEERING INJECTION SCRIPT (50x Concurrent Failures)
# ==============================================================================

TARGET_FLOW_URL="http://localhost:8080/api/v1/webhooks/catch/YOUR_ECOMMERCE_FLOW"

echo "[$(date)] Firing 50 concurrent error payloads to test Global Interceptor & Deduplication..."

for i in {1..50}; do
  curl -s -X POST "${TARGET_FLOW_URL}"     -H "Content-Type: application/json"     -d "{"order_id": "ORD-CHAOS-${i}", "amount": 299.00, "simulate_error": "DB_LOCK_TIMEOUT"}" &
done

wait
echo "[$(date)] Chaos injection complete. Verify PostgreSQL incident_vault and single deduplicated Slack card!"
