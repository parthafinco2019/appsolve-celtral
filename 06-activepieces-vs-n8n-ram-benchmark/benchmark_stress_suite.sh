#!/bin/bash
# ==============================================================================
# HEAD-TO-HEAD BENCHMARK STRESS SUITE (Activepieces vs n8n)
# ==============================================================================

AP_ENDPOINT="http://localhost:8080/api/v1/webhooks/catch/YOUR_AP_FLOW_ID"
N8N_ENDPOINT="http://localhost:5678/webhook/YOUR_N8N_WEBHOOK_PATH"

PAYLOAD='{"batch_id": "bench_9912", "records": [{"id": 1, "value": 100}, {"id": 2, "value": 200}, {"id": 3, "value": 300}, {"id": 4, "value": 400}, {"id": 5, "value": 500}]}'

echo "================================================================================"
echo " TEST 1: SINGLE REQUEST COLD-START LATENCY"
echo "================================================================================"
echo "Benchmarking Activepieces..."
curl -o /dev/null -s -w 'Activepieces Latency: %{time_total}s | Status: %{http_code}
' -X POST "${AP_ENDPOINT}" -H 'Content-Type: application/json' -d "${PAYLOAD}"

echo "Benchmarking n8n..."
curl -o /dev/null -s -w 'n8n Latency: %{time_total}s | Status: %{http_code}
' -X POST "${N8N_ENDPOINT}" -H 'Content-Type: application/json' -d "${PAYLOAD}"

echo ""
echo "================================================================================"
echo " TEST 2: 50-CONCURRENT WEBHOOK BURST STRESS TEST"
echo "================================================================================"
echo "Blasting Activepieces with 50 concurrent requests..."
for i in {1..50}; do
  curl -o /dev/null -s -w "%{http_code} " -X POST "${AP_ENDPOINT}" -H 'Content-Type: application/json' -d "${PAYLOAD}" &
done
wait
echo -e "
Activepieces 50-request burst finished."

echo "Blasting n8n with 50 concurrent requests..."
for i in {1..50}; do
  curl -o /dev/null -s -w "%{http_code} " -X POST "${N8N_ENDPOINT}" -H 'Content-Type: application/json' -d "${PAYLOAD}" &
done
wait
echo -e "
n8n 50-request burst finished. Checking container exit codes..."

docker inspect benchmark_activepieces --format 'Activepieces Status: {{.State.Status}} | OOMKilled: {{.State.OOMKilled}}'
docker inspect benchmark_n8n --format 'n8n Status: {{.State.Status}} | ExitCode: {{.State.ExitCode}} | OOMKilled: {{.State.OOMKilled}}'
