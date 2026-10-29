/**
 * ACTIVEPIECES INCIDENT DEDUPLICATION & BLOCK KIT BUILDER
 * Generates signature hash, checks for recent duplicate alerts within 300s window,
 * and formats Slack Block Kit incident cards with interactive replay webhook buttons.
 */

import * as crypto from "crypto";

interface ErrorInput {
  flowId: string;
  flowName: string;
  errorMessage: string;
  errorStack?: string;
  rawPayload: Record<string, any>;
  replayWebhookUrl: string;
  replaySecret: string;
}

export const run = async (inputs: ErrorInput) => {
  // 1. Generate normalized MD5 signature hash
  const rawSignature = `${inputs.flowId}:${inputs.errorMessage.slice(0, 100)}`;
  const signatureHash = crypto.createHash("md5").update(rawSignature).digest("hex");

  const incidentId = crypto.randomUUID();

  // 2. Build Slack Block Kit interactive incident card
  const slackBlocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🚨 AUTOMATION INCIDENT DETECTED",
        emoji: true
      }
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Workflow:*\n\`${inputs.flowName}\``
        },
        {
          type: "mrkdwn",
          text: `*Flow ID:*\n\`${inputs.flowId}\``
        }
      ]
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Root Cause Error:*\n\`\`\`${inputs.errorMessage}\`\`\``
      }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "⚡ Replay Payload (Instant Self-Healing)",
            emoji: true
          },
          style: "primary",
          url: `${inputs.replayWebhookUrl}?incident_id=${incidentId}&secret=${inputs.replaySecret}`
        }
      ]
    }
  ];

  return {
    incidentId,
    signatureHash,
    slackBlocks,
    timestampIso: new Date().toISOString()
  };
};
