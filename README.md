# AppSolve Central — Production Automation & Self-Hosting Blueprints

> **The Official Open-Source Blueprint Repository for the [AppSolve Central YouTube Masterclass Series](https://www.youtube.com/@AppSolveCentral).**
> Battle-tested Docker Compose stacks, TypeScript SDK piece modules, AI agent architectures, and enterprise reliability workflows — 100% verified for production.

---

## 📚 Masterclass Blueprints Catalog (Episodes 1 – 10)

| Episode | Blueprint Title | Key Assets Included | Direct Folder Link |
| :---: | :--- | :--- | :--- |
| **01** | **How to Self-Host Activepieces on Coolify with Free SSL & Automated Backups** | `docker-compose.yml`, `.env.production`, `s3_backup_cron.sh`, `test_webhooks.sh` | [📂 View Topic 01](01-coolify-activepieces-selfhost/) |
| **02** | **Connect Activepieces to Claude Desktop & Cursor using MCP** | `package.json`, `index.ts`, `claude_desktop_config.json`, `mcp.json`, `tsconfig.json` | [📂 View Topic 02](02-mcp-claude-cursor-activepieces/) |
| **03** | **Stop Paying $300/mo for Zapier: The Complete Activepieces Migration Blueprint** | `zapier_to_activepieces_blueprint.json`, `zapier_formatter_replacement.ts`, `migration_audit_checklist.md`, `docker-compose.yml` | [📂 View Topic 03](03-zapier-to-activepieces-migration/) |
| **04** | **Build a 100% Free Local AI Agent with Ollama & Activepieces ($0 Token Costs)** | `docker-compose.bridge.yml`, `Modelfile`, `test_stress_agent.sh`, `docker-compose.yml` | [📂 View Topic 04](04-local-ai-agent-ollama-activepieces/) |
| **05** | **Automated Deep Web Research Agent (Perplexity Sonar Pro + Google Docs)** | `citation_normalizer.ts`, `docker-compose.yml`, `test_research_curl.sh` | [📂 View Topic 05](05-perplexity-sonar-deep-research/) |
| **06** | **Activepieces vs n8n: RAM & Server Benchmark on a $4 VPS** | `docker-compose.benchmark.yml`, `server_memory_hardening.sh`, `setup_swap.sh`, `benchmark_stress_suite.sh` | [📂 View Topic 06](06-activepieces-vs-n8n-ram-benchmark/) |
| **07** | **Bulletproof Global Error-Catching & Dead-Letter Queue (DLQ) Alert System** | `incident_vault_schema.sql`, `deduplication_engine.ts`, `chaos_stress_test.sh`, `dlq_schema.sql` | [📂 View Topic 07](07-global-error-handling-dead-letter-queue/) |
| **08** | **Automated AI Invoice & Receipt Extractor to Google Sheets** | `invoice_reconciler.ts`, `accounting_ledger_template.csv`, `activepieces_invoice_flow.json`, `math_firewall.ts` | [📂 View Topic 08](08-ai-invoice-receipt-extractor/) |
| **09** | **How to Code a Custom Piece in Activepieces from Scratch (TypeScript SDK)** | `package.json`, `index.ts`, `create-contact.ts`, `create-contact.test.ts`, `docker-compose.dev.yml` | [📂 View Topic 09](09-custom-piece-typescript-sdk/) |
| **10** | **Autonomous Social Media Repurposer with Multi-Agent AI** | `content_repurposer.ts`, `char_firewall.ts`, `content_calendar_template.csv`, `activepieces_social_flow.json` | [📂 View Topic 10](10-autonomous-social-media-repurposer/) |

---

## 🛠️ Quick Start Guide

### 1. Clone the Blueprint Repository
```bash
git clone https://github.com/parthafinco2019/appsolve-central.git
cd appsolve-central
```

### 2. Navigate to Any Masterclass Topic
Each folder is self-contained with its own step-by-step instructions, Docker Compose files, environment templates, and test scripts:
```bash
# Example: Deploy Topic 1 (Coolify + Activepieces Self-Host)
cd 01-coolify-activepieces-selfhost
cp .env.example .env

# Example: Run Topic 2 (MCP Bridge Server)
cd ../02-mcp-claude-cursor-activepieces
npm install && npm run build
```

---

## 💬 100% Guaranteed Community Support
Encounter an error, configuration issue, or edge case with any of these blueprints?
1. Check the dedicated `README.md` inside each topic folder for troubleshooting guides.
2. Drop a comment directly on the corresponding [YouTube Masterclass video](https://www.youtube.com/@AppSolveCentral). We personally answer **every single comment** to make sure your production instance succeeds!

---
*Maintained by **AppSolve Central** — Production DevOps, AI Automations, and Open-Source Infrastructure.*
