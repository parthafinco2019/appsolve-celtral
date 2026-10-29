# 10-Point Zapier to Activepieces Pre-Cutover Audit Checklist

Before flipping your production traffic away from Zapier, verify every item below:

- [ ] **1. Credential Vault Verification**: All OAuth connections (Slack, HubSpot, Google Sheets) verified with live test pings in Activepieces Connection tab.
- [ ] **2. Webhook Ingress Redundancy**: Webhook triggers configured to accept POST bodies with proper JSON parsing enabled.
- [ ] **3. E.164 Phone Normalization**: Code piece regex verified against 10-digit domestic and international phone numbers.
- [ ] **4. Business Domain Filter**: Public webmail domains (Gmail, Yahoo, Hotmail) correctly isolated from corporate routing.
- [ ] **5. High-Value Path Evaluation**: Conditional branches verified with numeric operators (>= $10,000) using casted number types.
- [ ] **6. Slack Block Kit Rendering**: Interactive alerts verified across desktop, web, and mobile Slack clients.
- [ ] **7. Fallback Error Handling**: Secondary branch configured with dead-letter logging or default spreadsheet storage.
- [ ] **8. 5x Concurrent Stress Test**: Webhook endpoint load tested with concurrent curl requests to ensure sub-100ms response times.
- [ ] **9. Parallel Ingress Verification**: Secondary webhook active on intake form for 48 hours to confirm 100% data parity with legacy Zap.
- [ ] **10. Zapier Graceful Decommission**: Legacy Zaps toggled OFF, plan downgraded to Free tier to preserve historical logs and avoid account termination.
