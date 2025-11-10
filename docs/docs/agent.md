# Txlog Agent

Txlog Agent is a lightweight command-line tool written in Go that collects and
transmits RPM transaction data from RHEL-based systems to the [Txlog
Server](/docs/server). The agent provides automated tracking of package
installations, updates, and removals, creating a comprehensive audit trail of
system changes over time.

## Overview

The agent acts as a data collector on each managed system, performing these key
functions:

- **Transaction Collection**: Reads DNF/YUM history and extracts detailed
  transaction information
- **Restart Detection**: Identifies when system restarts are needed after
  package updates
- **System Information**: Reports OS details, hostname, and agent version to the
  server
- **Flexible Authentication**: Supports both API key and basic authentication

## System Requirements

### Supported Operating Systems

The Txlog Agent is designed for **RHEL-compatible Linux distributions** that use
the DNF or YUM package manager:

- Red Hat Enterprise Linux (RHEL)
- AlmaLinux
- Rocky Linux
- CentOS
- Oracle Linux
- Fedora (recent versions)

### Dependencies

- **Package Manager**: DNF (preferred) or YUM
- **Network Access**: Connectivity to the Txlog Server
- **Disk Space**: Minimal (< 5 MB installed)

### Server Requirements

- A deployed [Txlog Server](/docs/server) accessible from the agent
- Server version **1.14.0 or later** for API key authentication (or any version
  with basic auth or no auth)

## Installation

### Using RPM Repository

The recommended installation method is via the RPM repository:

```bash
# Add the RPM repository
sudo dnf localinstall -y https://rpm.rda.run/rpm-rda-run-1.3.0-1.noarch.rpm

# Install the agent
sudo dnf install -y txlog
```

### Verify Installation

Check that the agent is installed correctly:

```bash
txlog version
```

You should see output similar to:

```text

============================================================
📦 Txlog Agent:  v1.9.0
🖥️ Txlog Server: v1.18.0
============================================================

✓ You are running the latest version!

```

## Configuration

The agent is configured via `/etc/txlog.yaml`. After installation, edit this
file to configure your Txlog Server connection and authentication.

### Basic Configuration

::: code-group

```yaml [API Key (Recommended)]
# /etc/txlog.yaml
agent:
  check_version: true

server:
  url: https://txlog-server.example.com
  api_key: txlog_your_api_key_here
```

```yaml [Basic Auth (Legacy)]
# /etc/txlog.yaml
agent:
  check_version: true

server:
  url: https://txlog-server.example.com
  username: bob_tables
  password: correct-horse-battery-staple
```

```yaml [No Auth (Development)]
# /etc/txlog.yaml
agent:
  check_version: true

server:
  url: http://localhost:8080
```

:::

### Configuration Reference

#### Agent Section

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `check_version` | boolean | `true` | Check for new agent versions at `https://txlog.rda.run/agent/version` when running `txlog version` |

#### Server Section

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `url` | string | Yes | Txlog Server URL including protocol and port<br/>Example: `https://txlog.example.com` |
| `api_key` | string | No* | API key for authentication (Server v1.14.0+)<br/>Example: `txlog_abc123...` |
| `username` | string | No* | Username for basic authentication (legacy) |
| `password` | string | No* | Password for basic authentication (legacy) |

Either `api_key` OR `username`+`password` must be configured if the server
requires authentication.`

### Environment Variables

- **NO_COLOR**: When set to any value (even an empty string), disables colored
output and emoji icons in all txlog commands. This follows the standard defined
at <https://no-color.org>. Useful for CI/CD pipelines, logging to files, or
terminals that don't support colors. Example: `NO_COLOR=1 txlog build`

### Authentication Methods

#### API Key Authentication (Recommended)

::: tip Server Version Requirement
API key authentication requires **Txlog Server 1.14.0 or later**. The agent
automatically validates server compatibility on startup.
:::

To use API key authentication:

1. Generate an API key in the Txlog Server admin panel (`/admin`)
2. Copy the generated secret (shown only once)
3. Add it to `/etc/txlog.yaml` following the configuration section above.

**Benefits**:

- More secure than basic auth
- Keys can be individually revoked
- No password storage needed
- Supports key rotation

#### Basic Authentication (Legacy)

For older server versions or specific requirements.

::: warning Security Note
Store credentials securely. The configuration file should have restricted
permissions:

```bash
sudo chmod 600 /etc/txlog.yaml
```

:::

#### No Authentication (Development Only)

For internal deployments without authentication. This requires the server to be
running without OIDC and without API key requirements.

## Usage

### Primary Command: `build`

The main command to collect and send transaction data:

```bash
sudo txlog build
```

This command:

1. Collects system identification (machine ID, hostname)
2. Retrieves previously sent transaction IDs from the server
3. Reads local DNF/YUM history
4. Compares local and remote transactions
5. Sends only new transactions to the server
6. Reports system restart requirements (if server supports it)
7. Records execution details

**Example output:**

```text
🔍 Compiling host identification for server01.example.com
   Machine ID: d43a86fe690e4fd6b9606eb8efbdfa51

📥 Retrieving saved transactions...
   Found 70 saved transactions on server

⚙️  Compiling transaction data...
   ✓ Transaction #71 sent successfully

============================================================
✓ Build completed successfully!
   Transactions processed: 71
   Transactions sent:      1
============================================================

```

### The `verify` command

This command allows you to verify that all local DNF transaction data has been
properly replicated to the Txlog server. This is useful for ensuring data
integrity and identifying any synchronization issues.

The verification process checks:

1. **Missing Transactions:** Identifies transactions that exist in the local DNF
  history but have not been sent to the server. These transactions may have
  been skipped during a previous txlog build execution due to errors or
  interruptions.
1. **Transaction Items Integrity:** For each transaction that exists on the server,
   verifies that all package items (installations, upgrades, removals) are
   correctly recorded. The verification compares:
   - Package names, versions, releases, epochs, and architectures
   - Action types (Install, Upgrade, Remove, etc.)
   - Repository information

After running `txlog verify`, if any issues are detected, you can delete the
asset data on server and run `txlog build` to synchronize the data again.

### The `version` command

Check agent and server versions:

```bash
txlog version
```

**Example output:**

```text

============================================================
📦 Txlog Agent:  v1.9.0
🖥️ Txlog Server: v1.18.0
============================================================

✓ You are running the latest version!

```

If a newer version is available (and `check_version: true`):

```text
Txlog Agent v1.7.0
Txlog Server v1.14.0

Your version of Txlog Agent is out of date! The latest version
is v1.7.1. Go to https://txlog.rda.run/agent/latest for details.
```

### The `help` command

View all available commands and options:

```bash
txlog --help
```

Or get help for a specific command:

```bash
txlog build --help
```

### Configuration File Override

Use a custom configuration file:

```bash
txlog --config /path/to/custom.yaml build
```

## Scheduling with Cron

To automatically sync transaction data, set up a cron job:

```bash
# Run every hour
0 * * * * /usr/bin/txlog build >/dev/null 2>&1

# Run every 6 hours
0 */6 * * * /usr/bin/txlog build >/dev/null 2>&1

# Run daily at 2 AM
0 2 * * * /usr/bin/txlog build >/dev/null 2>&1
```

Add to root's crontab:

```bash
sudo crontab -e
```

::: tip Best Practice
Run the agent regularly but not too frequently. Daily executions is typically
sufficient for most environments. The agent is smart enough to only send new
transactions.
:::

## How It Works

### Transaction Detection

1. **Local History**: The agent reads `/var/lib/dnf/history` or equivalent YUM
   history
2. **Server Query**: Requests list of transaction IDs already stored for this
   machine
3. **Comparison**: Identifies transactions present locally but not on server
4. **Extraction**: For each new transaction, runs `dnf history info <ID>` to get
   full details
5. **Transmission**: Sends transaction data via HTTP POST to `/v1/transactions`
6. **Execution Record**: Records the execution details via HTTP POST to
   `/v1/executions`

### Data Collected

For each transaction, the agent collects:

- **Transaction metadata**:
  - Transaction ID
  - Begin and end timestamps
  - User who executed the transaction
  - Command line used
  - Return code
  - OS release version

- **Package details**:
  - Package name, version, release, epoch, architecture
  - Action performed (Install, Update, Remove, etc.)
  - Repository source
  - Previous version (for upgrades)

- **System information**:
  - Machine ID (unique system identifier)
  - Hostname
  - OS information from `/etc/os-release`
  - Agent version
  - Restart requirement status

### Restart Detection

On servers version 1.8.0+, the agent detects if a system restart is needed by
checking:

- Kernel updates requiring reboot
- Core system libraries needing restart
- Package manager indicators
- Boot time changes

This information helps administrators identify systems that need maintenance
windows.

## Troubleshooting

### Connection Errors

**Error:** `failed to connect to server`

**Solutions:**

- Check server URL in `/etc/txlog.yaml`
- Verify network connectivity: `curl -v https://txlog-server.example.com/health`
- Check firewall rules
- Verify SSL certificates if using HTTPS

### Authentication Errors

**Error:** `authentication failed: invalid credentials`

**Solutions:**

- Verify API key or username/password in configuration
- Check if API key has been revoked in server admin panel
- Ensure API key is not expired
- Verify server version supports API keys (1.14.0+)

**Error:** `server version X.X.X does not support API key authentication`

**Solutions:**

- Upgrade server to 1.14.0 or later
- Use basic authentication instead
- Update server configuration

### Permission Errors

**Error:** `permission denied` or `cannot access DNF history`

**Solutions:**

- Run with `sudo`: `sudo txlog build`
- Ensure the command is executed as root
- Check permissions on `/var/lib/dnf/history`

### Version Mismatch

**Error:** `server returned status code 400` or validation errors

**Solutions:**

- Check agent and server versions: `txlog version`
- Update agent to latest version
- Review server logs for specific error details

### Debug Mode

For troubleshooting, check the configuration:

```bash
# View current configuration
sudo cat /etc/txlog.yaml

# Test server connectivity
curl -H "X-API-Key: your_key" https://txlog-server.example.com/v1/version

# Check DNF history
sudo dnf history list
```
