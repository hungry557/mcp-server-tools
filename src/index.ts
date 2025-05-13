#!/usr/bin/env node

/**
 * 这是一个调用flomo API写笔记的MCP服务器。
 * 它通过允许以下功能来演示MCP核心概念（如工具）：
 * - 通过工具向flomo写入笔记
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { getParamValue, getAuthValue } from "@chatmcp/sdk/utils/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolsClient } from "./tools.js";
import { RestServerTransport } from "@chatmcp/sdk/server/rest.js";

const api_url = getParamValue("api_url") || "";
const api_key = getParamValue("api_key") || "";

const mode = getParamValue("mode") || "stdio";
const port = getParamValue("port") || 9593;
const endpoint = getParamValue("endpoint") || "/rest";

/**
 * 创建一个具有工具功能的MCP服务器。
 */
const server = new Server(
  {
    name: "mcp-server-tools",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 列出可用工具的处理程序。
 * 提供一个单一的"write_note"工具，让客户端创建新笔记。
 */
server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  return {
    tools: [
      {
        name: "add",
        description: "Add two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "First number",
            },
            b: {
              type: "number",
              description: "Second number",
            },
          },
          required: ["a", "b"],
        },
      },
    ],
  };
});

/**
 * write_note工具的处理程序。
 * 创建带有内容的新笔记，保存到flomo并返回成功消息。
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const apiUrl = api_url || getAuthValue(request, "api_url");
  const apiKey = api_key || getAuthValue(request, "api_key");
  if (!apiUrl) {
    throw new Error("API URL not set");
  }
  if (!apiKey) {
    throw new Error("API KEY not set");
  }

  switch (request.params.name) {
    case "add": {
      const a = Number(request.params.arguments?.a);
      const b = Number(request.params.arguments?.a);
      if (!a) {
        throw new Error("A is required");
      }
      if (!b) {
        throw new Error("B is required");
      }

      const tools = new ToolsClient({ apiUrl, apiKey });
      const result = await tools.add({ a, b });

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * 使用stdio传输启动服务器。
 * 这允许服务器通过标准输入/输出流进行通信。
 */
async function main() {
  if (mode === "rest") {
    const transport = new RestServerTransport({
      port,
      endpoint,
    });
    await server.connect(transport);

    await transport.startServer();
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
