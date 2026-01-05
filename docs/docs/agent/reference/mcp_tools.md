<!-- markdownlint-disable MD033 MD013 -->
# MCP Tools Reference

This document provides a technical reference for the tools available through
the Txlog MCP server.

## Requirements

- **Txlog Server**: Version 1.19.0 or higher

## Starting the Server

| Mode | Command |
| :--- | :--- |
| Stdio (Claude Desktop) | `txlog mcp serve` |
| SSE (Web clients) | `txlog mcp serve --transport sse --port 3000` |
| Custom config | `txlog mcp serve --config /path/to/txlog.yaml` |

## Available Tools

### `list_assets`

List datacenter servers with optional OS/version filters.

**Arguments:**

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `os` | string | No | Filter by operating system (e.g., "AlmaLinux") |
| `version` | string | No | Filter by OS version (e.g., "9.4") |

**Example Query:** "List all servers running AlmaLinux 9"

---

### `get_asset_details`

Get detailed information about a specific server.

**Arguments:**

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `hostname` | string | No* | Server hostname |
| `machine_id` | string | No* | Server machine ID |

*At least one of `hostname` or `machine_id` is required.

**Example Query:** "Show me details for server webserver01"

---

### `list_transactions`

Get package transaction history for a specific server.

**Arguments:**

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `hostname` | string | No* | Server hostname |
| `machine_id` | string | No* | Server machine ID |
| `limit` | integer | No | Maximum transactions to return |

*At least one of `hostname` or `machine_id` is required.

**Example Query:** "Show me the last 10 transactions on dbserver01"

---

### `get_transaction_details`

Get package changes in a specific transaction.

**Arguments:**

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `transaction_id` | string | Yes | Transaction ID |

**Example Query:** "What packages were changed in transaction abc123?"

---

### `get_restart_required`

List servers that need to be restarted after package updates.

**Arguments:** None

**Example Query:** "Which servers need to be restarted?"

---

### `search_package`

Find servers with a specific package installed.

**Arguments:**

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `package` | string | Yes | Package name to search |
| `version` | string | No | Specific version to match |

**Example Query:** "Which servers have openssl installed?"

---

### `generate_executive_report`

Generate a monthly management report with update statistics, CVE analysis, and
impact patterns.

**Arguments:**

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `month` | integer | Yes | Month (1-12) |
| `year` | integer | Yes | Year (e.g., 2024) |

**Example Query:** "Generate an executive report for December 2024"

## Available Prompts

| Prompt | Description | Required Arguments |
| :--- | :--- | :--- |
| `infrastructure_report` | Complete infrastructure overview | None |
| `security_audit` | Security-focused package analysis | `package` (optional) |
| `troubleshoot_asset` | Debug guide for a specific server | `hostname` |
| `compliance_check` | Infrastructure compliance verification | None |
| `executive_report` | Monthly management report | `month`, `year` |
