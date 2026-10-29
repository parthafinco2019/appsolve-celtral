#!/bin/bash
# ==============================================================================
# CONCURRENT LOCAL AI INGRESS STRESS TEST SCRIPT (5x Parallel Webhooks)
# ==============================================================================

WEBHOOK_URL="http://localhost:8080/api/v1/webhooks/catch/YOUR_FLOW_ID"

echo "[$(date)] Firing 5 concurrent customer inquiries to local Ollama agent..."

payloads=(
  '{"customer": "Alice Smith", "message": "My order #ORD-8812 arrived completely shattered! I need an immediate replacement or full refund right now!"}'
  '{"customer": "Bob Vance", "message": "Can you tell me how to update my account password from the settings tab? Thanks."}'
  '{"customer": "Charlie Davis", "message": "I was double charged on invoice #INV-9021 for $450. Please escalate this to billing urgently."}'
  '{"customer": "Dana Scully", "message": "Looking for the enterprise API documentation for bulk webhook exports."}'
  '{"customer": "Evan Wright", "message": "Order #ORD-7741 has been stuck at customs for 5 days. What is going on?"}'
)

for p in "${payloads[@]}"; do
  curl -s -X POST "${WEBHOOK_URL}"     -H "Content-Type: application/json"     -d "${p}" &
done

wait
echo "[$(date)] All 5 requests dispatched. Check Activepieces Runs table for sub-second executions!"
