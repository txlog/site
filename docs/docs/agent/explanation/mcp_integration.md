# MCP Integration

This document explains how the Txlog Agent implements the Model Context Protocol
(MCP) and why this integration is valuable for infrastructure management.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants
to securely connect with external systems and data sources. Think of it as a
"USB-C for AI" – a standardized interface that allows AI models to discover and
use tools provided by external applications.

## Why MCP for Txlog?

Traditional infrastructure queries require:

1. Logging into a dashboard or terminal
2. Writing specific queries or commands
3. Interpreting raw data

With MCP integration, you can simply ask questions in natural language:

- "Which servers need security updates?"
- "Show me all changes made to the database servers last week"
- "Generate a report for the executive team"

The AI assistant translates your intent into the appropriate tool calls and
presents the results in a human-readable format.

## Architecture

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AI Assistant  │────▶│   Txlog Agent   │────▶│  Txlog Server   │
│  (Claude, etc)  │     │   (MCP Server)  │     │    (REST API)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
   Natural Language        Tool Calls              HTTP/JSON
      Queries              + Prompts               Requests
```

### Components

1. **AI Assistant**: The client application (Claude Desktop, Gemini CLI) that
   sends natural language queries.

2. **Txlog Agent (MCP Server)**: Exposes tools and prompts via the MCP
   protocol. Receives tool invocations and translates them into API calls.

3. **Txlog Server**: The data source providing asset information, transaction
   history, and analytics via REST API.

## Transport Modes

### Stdio Mode

Used for local integrations where the AI client spawns the MCP server as a
subprocess. Communication happens via standard input/output.

**Use case**: Claude Desktop integration

```text
Claude Desktop ──stdin/stdout──▶ txlog mcp serve
```

### SSE Mode

Server-Sent Events mode allows remote clients to connect over HTTP. The MCP
server listens on a specified port.

**Use case**: Web-based AI clients, remote access

```text
Web Client ──HTTP/SSE──▶ txlog mcp serve --transport sse --port 3000
```

## Tools vs Prompts

### Tools

Tools are functions that the AI can call to retrieve data or perform actions.
They are discoverable and self-describing, allowing the AI to understand what
parameters are needed and what data will be returned.

Example: `list_assets` retrieves a list of servers, optionally filtered by OS.

### Prompts

Prompts are pre-built templates for complex workflows. They guide the AI through
multi-step analysis tasks.

Example: `security_audit` combines multiple tool calls to produce a
comprehensive security assessment.

## Security Considerations

1. **Authentication**: The MCP server uses the same credentials configured in
   `txlog.yaml`. Ensure API keys are properly secured.

2. **Data Access**: The AI assistant can only access data that the configured
   user/API key has permission to view.

3. **Read-Only**: All MCP tools are read-only operations. The AI cannot modify
   infrastructure state through this interface.

4. **Local vs Remote**: Stdio mode only allows local access. SSE mode should be
   protected with TLS and access controls when exposed over a network.

## Version Requirements

The MCP integration requires Txlog Server version 1.19.0 or higher. The agent
will check server compatibility on startup and report errors if the server
version is insufficient.
