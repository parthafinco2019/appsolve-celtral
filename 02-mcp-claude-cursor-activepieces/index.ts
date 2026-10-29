#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// ==============================================================================
// CONFIGURATION & CREDENTIAL ENFORCEMENT
// ==============================================================================
const AP_WEBHOOK_URL = process.env.AP_WEBHOOK_URL || "";
const AP_MCP_SECRET = process.env.AP_MCP_SECRET || "";

if (!AP_WEBHOOK_URL) {
  // CRITICAL RULE: Never use console.log on stdout! Write errors strictly to stderr.
  console.error("FATAL: AP_WEBHOOK_URL environment variable is missing.");
}

// ==============================================================================
// MCP SERVER INITIALIZATION
// ==============================================================================
const server = new Server(
  {
    name: "activepieces-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ==============================================================================
// TOOL DEFINITIONS (EXPOSING ACTIVEPIECES FLOWS TO LLMs)
// ==============================================================================
const ACTIVEPIECES_TOOLS: Tool[] = [
  {
    name: "activepieces_customer_ops",
    description:
      "Execute automated customer operations via Activepieces workflows. " +
      "Supports querying customer order status and delivery tracking from internal databases, " +
      "or dispatching structured incident alerts directly to team Slack channels.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["query_order", "post_slack_alert"],
          description: "The specific operation to trigger in the workflow engine.",
        },
        customer_id: {
          type: "string",
          description: "The unique alphanumeric identifier for the customer (e.g., '8492').",
        },
        urgency: {
          type: "string",
          enum: ["low", "medium", "high", "critical"],
          description: "Urgency level when dispatching alerts to Slack.",
        },
        message: {
          type: "string",
          description: "Detailed context, ticket findings, or escalation message for team notification.",
        },
      },
      required: ["action", "customer_id"],
    },
  },
];

// ==============================================================================
// REQUEST HANDLERS: LIST TOOLS
// ==============================================================================
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error(`[MCP] Received ListTools query. Reporting ${ACTIVEPIECES_TOOLS.length} available tools.`);
  return {
    tools: ACTIVEPIECES_TOOLS,
  };
});

// ==============================================================================
// REQUEST HANDLERS: CALL TOOL
// ==============================================================================
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  console.error(`[MCP] Invoking tool '${name}' with arguments:`, JSON.stringify(args));

  if (name !== "activepieces_customer_ops") {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Unknown tool requested: ${name}. Available tools: ${ACTIVEPIECES_TOOLS.map((t) => t.name).join(", ")}`,
        },
      ],
    };
  }

  try {
    // Send authenticated HTTP POST payload to Activepieces Webhook Endpoint
    const response = await axios.post(
      AP_WEBHOOK_URL,
      {
        ...args,
        source: "mcp_agent",
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-mcp-secret": AP_MCP_SECRET,
        },
        timeout: 25000, // 25s timeout to stay strictly within Claude's 60s boundary
      }
    );

    console.error(`[MCP] Activepieces responded with status: ${response.status}`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  } catch (error: any) {
    const errorMsg = error.response
      ? `Activepieces HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`
      : error.message;

    console.error("[MCP] Execution Error:", errorMsg);

    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Workflow execution failed: ${errorMsg}`,
        },
      ],
    };
  }
});

// ==============================================================================
// SERVER LAUNCH (STDIO TRANSPORT)
// ==============================================================================
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[MCP] Activepieces Model Context Protocol Server running on stdio.");
}

main().catch((err) => {
  console.error("[MCP] Fatal startup error:", err);
  process.exit(1);
});
