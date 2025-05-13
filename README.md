# MCP 服务器工具

这是一个基于 Model Context Protocol (MCP) 的服务器工具集，提供了一套简单的计算工具。

## 功能特点

- 基于 MCP 协议实现的服务器
- 支持通过标准输入/输出（stdio）或 REST API 方式进行通信
- 提供基础数学运算工具（如加法运算）
- 简单易用的 API 接口

## 安装

```bash
npm install @hungry557/mcp-server-tools
```

## 使用方法

### 命令行

```bash
# 使用 npx 运行
npx -y @hungry557/mcp-server-tools

# 带环境变量
API_URL=YOUR_API_URL_HERE API_KEY=YOUR_API_KEY_HERE npx -y @hungry557/mcp-server-tools
```

### Docker

```bash
# 使用 Docker 运行
docker run -i --rm -e API_URL=YOUR_API_URL_HERE -e API_KEY=YOUR_API_KEY_HERE hungry557/tools
```

### 配置选项

在运行时，你可以设置以下环境变量：

- `API_URL`：API 服务地址
- `API_KEY`：API 密钥
- `mode`：服务模式，支持 `stdio`（默认）和 `rest`
- `port`：REST 模式下的端口号（默认：9593）
- `endpoint`：REST 模式下的端点（默认：/rest）

## 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 开发模式

```bash
npm run watch
```

### 运行检查器

```bash
npm run inspector
```

## MCP 服务器配置

可以通过 `chatmcp.yaml` 文件配置 MCP 服务器，示例配置已包含在项目中。

## 扩展工具

如需添加新工具，可以修改 `src/index.ts` 中的 `ListToolsRequestSchema` 处理程序和 `src/tools.ts` 中的工具实现。

## 许可证

参见 [LICENSE](LICENSE) 文件。

## 作者

[hungry557](https://github.com/hungry557)
