#!/usr/bin/env node
/**
 * MCP服务器工具 - 提供基于Model Context Protocol的工具服务
 *
 * 这个文件实现了一个MCP服务器，提供简单的计算工具功能。
 * 服务器通过stdio与客户端通信，支持工具列表查询和工具调用。
 *
 * @module mcp-server-tools
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { RestServerTransport } from "@chatmcp/sdk/server/rest.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { VERSION } from "./common/version.js";
import { mode, port, endpoint } from "./common/utils.js";
import * as number from "./tools/number.js";

/**
 * MCP服务器实例
 *
 * @type {Server}
 */
const server = new Server(
  {
    name: "mcp-server-tools",
    version: VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 处理工具列表请求的处理器
 *
 * 当客户端请求可用工具列表时返回所有支持的工具及其描述和输入模式
 *
 * @param {z.infer<typeof ListToolsRequestSchema>} request - 工具列表请求对象
 * @returns {Promise<{tools: Array<{name: string, description: string, inputSchema: object}>}>} 可用工具列表
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add",
        description: "Add two numbers",
        inputSchema: zodToJsonSchema(number.AddSchema),
      },
    ],
  };
});

/**
 * 处理工具调用请求的处理器
 *
 * 基于请求的工具名称和参数执行相应的功能，并返回结果
 *
 * @param {z.infer<typeof CallToolRequestSchema>} request - 工具调用请求对象
 * @returns {Promise<{content: Array<{type: string, text: string}>}>} 工具执行结果
 * @throws {Error} 当工具未知或参数无效时抛出错误
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    if (!args) {
      throw new Error("No arguments provided");
    }

    switch (name) {
      case "add": {
        const parsedArgs = number.AddSchema.parse(args);

        return {
          content: [
            { type: "text", text: String(parsedArgs.a + parsedArgs.b) },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
    }
    throw error;
  }
});

/**
 * 启动MCP服务器
 *
 * 初始化stdio传输通道并连接服务器，开始处理客户端请求
 *
 * @async
 * @returns {Promise<void>}
 */
async function runServer() {
  try {
    // after: MCP Server run with rest transport and stdio transport
    if (mode === "rest") {
      const transport = new RestServerTransport({
        port,
        endpoint,
      });
      await server.connect(transport);

      await transport.startServer();

      return;
    }

    // before: MCP Server only run with stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Server Tools running on stdio");
  } catch (error) {
    console.error("Fatal error running server:", error);
    process.exit(1);
  }
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
