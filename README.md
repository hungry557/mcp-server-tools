# MCP Server Tools

MCP Server Tools 是一个基于 Model Context Protocol 的服务器工具集，提供了一系列实用的工具函数供大型语言模型调用。

## 功能特点

- 基于 Model Context Protocol SDK 开发
- 支持通过标准输入输出（stdio）进行通信
- 简单易用的工具函数
- 支持 Docker 部署
- 支持 NPX 直接运行

## 当前工具

目前支持的工具函数：

- `add` - 计算两个数字的和

## 安装

### 通过 NPM 安装

```bash
npm install -g @hungry557/mcp-server-tools
```

### 或者直接使用 NPX

```bash
npx @hungry557/mcp-server-tools
```

### Docker 方式

```bash
docker run -i --rm hungry557/tools
```

## 配置

工具需要以下环境变量：

- `API_URL` - API 服务器地址
- `API_KEY` - API 访问密钥

## 使用方法

### 基本用法

```bash
API_URL=YOUR_API_URL API_KEY=YOUR_API_KEY npx -y @hungry557/mcp-server-tools
```

### 在 MCP 配置中使用

可以在 MCP 配置文件中添加以下配置：

```json
{
  "mcpServers": {
    "tools": {
      "command": "npx",
      "args": ["-y", "@hungry557/mcp-server-tools"],
      "env": {
        "API_URL": "YOUR_API_URL_HERE",
        "API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 监听模式下构建

```bash
npm run watch
```

### MCP 调试

```bash
npm run inspector
```

## 许可证

MIT
