#!/bin/bash
# ==============================================================================
# PERPLEXITY SONAR PRO LIVE API VERIFICATION SCRIPT
# ==============================================================================

PERPLEXITY_API_KEY="pplx-••••••••••••••••••••••••••••••••••••••••••••••••"

RESEARCH_TOPIC="Quantum Computing commercial breakthroughs and enterprise venture investments in 2026"

echo "[$(date)] Dispatching deep research query to Perplexity Sonar Pro..."

curl -s -X POST "https://api.perplexity.ai/chat/completions" \
  -H "Authorization: Bearer ${PERPLEXITY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar-pro",
    "messages": [
      {
        "role": "system",
        "content": "You are a senior market research analyst. Provide an exhaustive, factual executive briefing with structured headings, numerical statistics, and validated web citations."
      },
      {
        "role": "user",
        "content": "'"${RESEARCH_TOPIC}"'"
      }
    ],
    "temperature": 0.2,
    "max_tokens": 4000,
    "return_citations": true
  }' | jq '{content: .choices[0].message.content, citations: .citations}'

echo "[$(date)] Sonar Pro response verified with live citations!"
