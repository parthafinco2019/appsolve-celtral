# AppSolve Central — Production Blueprint: Activepieces on Coolify

> **Self-Host Activepieces on Coolify with Free Automated SSL & Off-Site S3 Backups for $5/Month**
> 
> Watch the full step-by-step masterclass on YouTube: [AppSolve Central](https://www.youtube.com/@AppSolveCentral)

---

## 📦 What's Inside This Repository

| File | Purpose | Description |
| :--- | :--- | :--- |
| **[`docker-compose.yml`](docker-compose.yml)** | Service Stack | Activepieces Core + PostgreSQL 14 (Alpine) + Redis 7 (Alpine with AOF persistence) + Traefik reverse proxy integration. Includes strict `condition: service_healthy` container dependency gates. |
| **[`.env.production`](.env.production)** / **[`.env.example`](.env.example)** | Environment Config | Pre-configured `AP_FRONTEND_URL`, 256-bit AES encryption secret placeholders, PostgreSQL credentials, and `UNSANDBOXED` executor mode flag (<700MB RAM usage). |
| **[`s3_backup_cron.sh`](s3_backup_cron.sh)** | Disaster Recovery | Automated nightly database dump script configured for AWS S3, Cloudflare R2, or Backblaze B2 with 30-day snapshot retention. |
| **[`test_webhooks.sh`](test_webhooks.sh)** | Ingress Stress Test | Shell script firing 5 concurrent sub-second webhook triggers to verify queue concurrency and live notification delivery. |

---

## 🚀 5-Step Quick Deployment Guide

### 1. DNS Setup (Cloudflare)
* Add an **A-record** pointing your subdomain (e.g., `automation.yourdomain.com`) to your VPS public IPv4.
* **CRITICAL:** Switch the Cloudflare proxy toggle to **DNS Only (Grey Cloud)** during initial certificate provisioning to avoid the Cloudflare 522 challenge failure.

### 2. Generate Cryptographic 32-Byte Hex Keys
Run OpenSSL twice in your terminal to generate cryptographically secure keys:
```bash
# Application encryption key for third-party OAuth tokens & DB secrets
openssl rand -hex 32

# User JWT secret for signing session cookies
openssl rand -hex 32
```

### 3. Deploy Stack in Coolify
1. In your Coolify dashboard, navigate to your Project Workspace.
2. Click **+ Add Resource** $\rightarrow$ **Docker Compose**.
3. Paste the contents of [`docker-compose.yml`](docker-compose.yml).
4. In the **Environment Variables** tab, paste the variables from [`.env.production`](.env.production) with your custom domain and generated secrets.
5. In **Activepieces** $\rightarrow$ **General Settings** $\rightarrow$ **Traefik Configuration**, check **Enable WebSocket and SSE streaming pass-through** to eliminate execution log buffering lag.
6. Click **Deploy**.

### 4. Live Ingress Test
Once the cluster shifts to **Running (All Healthy)**, create your admin account, build an ingress flow, and run:
```bash
chmod +x test_webhooks.sh
./test_webhooks.sh "https://automation.yourdomain.com/api/v1/webhooks/YOUR_FLOW_ID"
```

### 5. Automated S3 Backups & Disaster Recovery
1. In Coolify, click directly on your **PostgreSQL** service $\rightarrow$ **Backups** tab.
2. Click **Add S3 Storage** and provide your S3 / Cloudflare R2 credentials.
3. Set the Cron schedule to `0 3 * * *` (3:00 AM daily) and retention to `30 days`.
4. Click **Backup Now** to verify instant snapshot creation and cloud upload.

---

## 💬 Community & Guaranteed Support
If you encounter any roadblock, SSL challenge error, or database timeout while deploying this stack, drop a comment on the [YouTube Masterclass](https://www.youtube.com/@AppSolveCentral). We personally answer every single comment to make sure your cluster gets into production!
