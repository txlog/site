# Getting Started with MCP Server

This tutorial will guide you through setting up the Txlog Agent as a Model
Context Protocol (MCP) server, allowing AI assistants like Claude or Gemini to
query your datacenter information directly.

## Prerequisites

Before you begin, ensure you have:

1. **Txlog Agent installed** (see [Getting Started](getting_started.md)).
2. **Txlog Server version 1.19.0 or higher** running and accessible.
3. **A configured `txlog.yaml`** with valid server credentials.
4. **An MCP-compatible client** (e.g., Claude Desktop, Gemini CLI).

## Step 1: Verify Configuration

First, ensure your `txlog.yaml` is properly configured:

```bash
cat /etc/txlog.yaml
```

You should see your server URL and authentication configured:

```yaml
server:
  url: https://txlog.example.com:8080
  api_key: your_api_key_here
```

## Step 2: Start the MCP Server

The MCP server can run in two modes. For Claude Desktop integration, use stdio
mode:

```bash
txlog mcp serve
```

You should see output indicating the server is ready:

```text
MCP server started in stdio mode
```

## Step 3: Configure Claude Desktop

To use the MCP server with Claude Desktop, add this configuration to your
`claude_desktop_config.json`:

**Linux:** `~/.config/Claude/claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "txlog": {
      "command": "/usr/bin/txlog",
      "args": ["mcp", "serve", "--config", "/etc/txlog.yaml"]
    }
  }
}
```

After saving, restart Claude Desktop.

## Step 4: Test the Integration

Open Claude Desktop and try asking natural language questions about your
infrastructure:

- "Which servers are running AlmaLinux 9?"
- "List all servers that need to be restarted"
- "Show me the package transactions for server webserver01"
- "Generate an executive report for December 2024"

## Step 5: Try Available Prompts

The MCP server includes pre-built prompts for common tasks. In Claude Desktop,
you can access them through the prompt menu:

- **Infrastructure Report**: Complete overview of your datacenter
- **Security Audit**: Focus on specific packages
- **Troubleshoot Asset**: Debug a specific server
- **Compliance Check**: Verify infrastructure compliance

---

**Next Steps**: Check the [How-to Guides](../how-to/configure_mcp_sse.md) to
learn about SSE transport for web clients, or explore the
[Reference](../reference/mcp_tools.md) for a complete list of available tools.
