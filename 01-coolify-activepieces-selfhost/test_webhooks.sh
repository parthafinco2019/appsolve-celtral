#!/bin/bash
# ==============================================================================
# Ingress Concurrency Test: 5 Simultaneous Webhook Triggers
# Tests sub-second response times, Redis queueing, and Slack/Discord notifications
# ==============================================================================

WEBHOOK_URL="${1:-https://automation.yourdomain.com/api/v1/webhooks/your-flow-id}"

echo "Targeting Webhook Endpoint: ${WEBHOOK_URL}"
echo "Firing 5 concurrent requests with mock payload..."

for i in {1..5}; do
  curl -s -o /dev/null -w "Run $i: Status %{http_code} | Latency: %{time_total}s\n" \
    -X POST "${WEBHOOK_URL}" \
    -H "Content-Type: application/json" \
    -d "{\"run_id\": $i, \"event\": \"lead_signup\", \"timestamp\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\", \"user\": \"alex_${i}@tutorialflow.io\"}" &
done

wait
echo "All 5 concurrent requests completed."
