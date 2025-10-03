# Txlog Server

Txlog Server is a centralized transaction log management system built with Go
and the Gin web framework. It manages a PostgreSQL database that stores
transaction data from multiple [Txlog Agent](/docs/agent) instances across your
infrastructure. The server provides both a web interface and REST API for
monitoring package installations, updates, and system changes across all managed
assets.

## Overview

The server acts as the central hub for your package management audit trail,
offering:

- **Transaction Tracking**: Records all package installations, updates, and
  removals from connected agents
- **Asset Management**: Monitors all systems (machines) sending transaction data
- **Restart Detection**: Identifies systems that require restarts after updates
- **Package Statistics**: Provides insights into package distribution and update
  history across your infrastructure
- **OIDC Authentication**: Optional OpenID Connect authentication for web
  interface access
- **API Key Authentication**: Secure API access for agent communication
- **Automated Housekeeping**: Scheduled cleanup of old transaction data

## System Requirements

### PostgreSQL Database

Txlog Server requires a PostgreSQL database to store transaction logs and
related data. The server automatically creates all necessary tables using
database migrations on first startup.

Create a blank database:

```sql
CREATE DATABASE "txlog" WITH ENCODING = 'UTF8';
```

### Supported Platforms

The server runs as a containerized application using Docker or Kubernetes. The
container image is built from scratch (minimal base image) for security and
efficiency, containing only:

- The compiled Go binary
- CA certificates for HTTPS connections
- A non-root user (`txlog` with UID 10001)

### Network Requirements

- Port 8080 (default) for HTTP traffic
- PostgreSQL connection (typically port 5432)
- Optional: OIDC provider connectivity for authentication

## Installation

The Txlog Server is distributed as a Docker container image available at
`cr.rda.run/txlog/server`. You can deploy it using Docker or Kubernetes.

### Version Tags

- `main` - Latest development version (may include breaking changes)
- `v1.14.0` - Latest stable release (recommended for production)
- `v1.x.x` - Specific version tags for pinned deployments

::: warning
The `main` tag is under active development and may introduce breaking changes.
For production use, always use a specific version tag like `v1.14.0`.
:::

### Quick Start with Docker

::: code-group

```bash [Docker]
docker run -d -p 8080:8080 \
  -e INSTANCE="My Datacenter" \
  -e LOG_LEVEL=INFO \
  -e PGSQL_HOST=postgres.example.com \
  -e PGSQL_PORT=5432 \
  -e PGSQL_USER=txlog \
  -e PGSQL_DB=txlog \
  -e PGSQL_PASSWORD=your_db_password \
  -e PGSQL_SSLMODE=require \
  -e CRON_RETENTION_DAYS=7 \
  -e CRON_RETENTION_EXPRESSION="0 2 * * *" \
  -e CRON_STATS_EXPRESSION="0 * * * *" \
  -e IGNORE_EMPTY_EXECUTION=true \
  cr.rda.run/txlog/server:v1.14.0
```

```yaml [Kubernetes]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: txlog-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: txlog-server
  template:
    metadata:
      labels:
        app: txlog-server
    spec:
      containers:
      - name: txlog-server
        image: cr.rda.run/txlog/server:v1.14.0
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        env:
        - name: INSTANCE
          value: "My Datacenter"
        - name: LOG_LEVEL
          value: "INFO"
        - name: PGSQL_HOST
          value: "postgres.example.com"
        - name: PGSQL_PORT
          value: "5432"
        - name: PGSQL_USER
          value: "txlog"
        - name: PGSQL_DB
          value: "txlog"
        - name: PGSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: txlog-secrets
              key: db-password
        - name: PGSQL_SSLMODE
          value: "require"
        - name: CRON_RETENTION_DAYS
          value: "7"
        - name: CRON_RETENTION_EXPRESSION
          value: "0 2 * * *"
        - name: CRON_STATS_EXPRESSION
          value: "0 * * * *"
        - name: IGNORE_EMPTY_EXECUTION
          value: "true"
```

:::

### Health Checks

The server provides a health check endpoint at `/health` for monitoring:

```bash
curl http://localhost:8080/health
```

This endpoint is useful for:

- Kubernetes liveness and readiness probes
- Load balancer health checks
- Monitoring systems

## Configuration Options

The Txlog Server is configured entirely through environment variables:

### Core Settings

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `INSTANCE` | A name to identify this server instance | - | `My Datacenter` |
| `LOG_LEVEL` | Logging verbosity level | `INFO` | `DEBUG`, `INFO`, `WARN`, `ERROR` |
| `GIN_MODE` | Gin framework mode | `release` | `debug`, `release` |
| `PORT` | HTTP server port | `8080` | `8080` |

### PostgreSQL Database

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PGSQL_HOST` | PostgreSQL server hostname | ✓ | `postgres.example.com` |
| `PGSQL_PORT` | PostgreSQL server port | ✓ | `5432` |
| `PGSQL_USER` | PostgreSQL username | ✓ | `txlog` |
| `PGSQL_DB` | PostgreSQL database name | ✓ | `txlog` |
| `PGSQL_PASSWORD` | PostgreSQL password | ✓ | `your_db_password` |
| `PGSQL_SSLMODE` | SSL connection mode | - | `disable`, `require`, `verify-ca`, `verify-full` |

### Data Retention

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CRON_RETENTION_DAYS` | Days to keep transaction data | `7` | `30` |
| `CRON_RETENTION_EXPRESSION` | Cron schedule for cleanup job | `0 2 * * *` | `0 2 * * *` (2 AM daily) |
| `CRON_STATS_EXPRESSION` | Cron schedule for statistics updates | `0 * * * *` | `0 * * * *` (hourly) |
| `IGNORE_EMPTY_EXECUTION` | Skip empty transaction executions | `false` | `true`, `false` |

### Version Check

| Variable | Description | Example |
|----------|-------------|---------|
| `LATEST_VERSION` | URL to check for latest server version | `https://api.github.com/repos/txlog/server/releases/latest` |

## Authentication

Txlog Server provides a dual authentication system designed to balance security
with operational needs:

- **Web Interface**: Optional OIDC authentication for human access
- **API Endpoints**: API Key authentication for agent communication

### Web Interface Authentication (OIDC)

::: info Optional Feature
OIDC authentication is completely optional. When not configured, the web
interface is publicly accessible. This is useful for internal deployments where
network security provides sufficient protection.
:::

#### Enabling OIDC

Configure these environment variables to enable OpenID Connect authentication:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OIDC_ISSUER_URL` | OIDC provider's issuer URL | Yes | `https://id.example.com` |
| `OIDC_CLIENT_ID` | OAuth2 client ID | Yes | `txlog-client` |
| `OIDC_CLIENT_SECRET` | OAuth2 client secret | Yes | `your-secret` |
| `OIDC_REDIRECT_URL` | Callback URL after authentication | Yes | `https://txlog.example.com/auth/callback` |
| `OIDC_SKIP_TLS_VERIFY` | Skip TLS verification (dev only) | No | `false` |

#### Supported OIDC Providers

::: code-group

```bash [Pocket ID]
# Self-hosted OIDC provider: https://pocket-id.org
OIDC_ISSUER_URL=https://pocketid.example.com
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

```bash [Google]
# Create credentials at: https://console.cloud.google.com/apis/credentials
OIDC_ISSUER_URL=https://accounts.google.com
OIDC_CLIENT_ID=your-client-id.apps.googleusercontent.com
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

```bash [Microsoft Entra ID]
# Register app at: https://portal.azure.com
OIDC_ISSUER_URL=https://login.microsoftonline.com/{tenant-id}/v2.0
OIDC_CLIENT_ID=your-application-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

```bash [Keycloak]
# Keycloak Configuration
OIDC_ISSUER_URL=https://keycloak.example.com/realms/{realm-name}
OIDC_CLIENT_ID=txlog-client
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

```bash [Auth0]
# Create application at: https://manage.auth0.com/
OIDC_ISSUER_URL=https://{your-domain}.auth0.com/
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

```bash [Okta]
# Create app at: https://{your-domain}.okta.com/admin/apps
OIDC_ISSUER_URL=https://{your-domain}.okta.com/oauth2/default
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

:::

#### User Management

When OIDC is enabled:

- **Automatic User Creation**: Users are created automatically on their first
  login
- **First User Admin**: The first user to log in is automatically promoted to
  administrator
- **Admin Panel**: Administrators can manage users via the `/admin` interface
- **User Status**: Users can be activated/deactivated by administrators
- **Admin Privileges**: Administrators can promote/demote other users

::: tip
The admin panel at `/admin` is accessible even without OIDC authentication,
allowing database migration management and system configuration viewing.
:::

### API Key Authentication

**Since v1.14.0**, if you enable OIDC authentication, the REST API endpoints
(`/v1/*`) require API key authentication. This provides secure access for agents
while keeping management simple.

#### Creating API Keys

1. Access the Admin Panel at `/admin` (requires admin privileges when OIDC is
   enabled)
2. Navigate to the "API Keys" section
3. Click "Create New API Key"
4. Provide a description (e.g., "Production Agent Key")
5. Copy the generated secret immediately (it won't be shown again)

#### Using API Keys

Agents authenticate using the `X-API-Key` header:

```bash
curl -H "X-API-Key: your-api-key-secret" \
  http://localhost:8080/v1/version
```

Configure the [Txlog Agent](/docs/agent) with your API key:

```ini
[txlog]
url = https://txlog.example.com
api_key = your-api-key-secret
```

::: warning Legacy Note
For backwards compatibility with agents pre-v1.6.0, some legacy endpoints remain
available but are deprecated. Update agents to use the current API endpoints.
:::

## Database Migrations

Txlog Server uses automated database migrations to manage schema changes.
Migrations run automatically on server startup, but can also be managed via the
admin panel.

### Automatic Migrations

On first startup, the server creates all necessary tables:

- `executions` - Transaction execution records
- `transactions` - Individual transaction details
- `transaction_items` - Package-level transaction data
- `statistics` - Aggregated statistics
- `users` - User accounts (when OIDC is enabled)
- `api_keys` - API key storage

### Manual Migration Control

Access `/admin` to:

- View migration status
- Run pending migrations manually
- See migration history
- Troubleshoot migration issues

## Features

### Web Interface

Access the web interface at `http://<server-address>:8080`:

### Dashboard

The home page provides an overview of your infrastructure:

- **Package Statistics**: See which packages are most frequently updated
- **OS Distribution**: View operating system breakdown across assets
- **Agent Version Distribution**: Monitor agent versions across your fleet
- **Recent Activity**: Track recent transaction executions

![Server Home](./server-home.png)

### Asset Management

View all assets at `/assets`:

- **Search**: Find assets by hostname or machine ID
- **OS Information**: See operating system and version
- **Agent Version**: Check which agent version is running
- **Last Seen**: View last contact time
- **Restart Status**: Identify assets requiring restarts

### Transaction History

Detailed transaction logs for each asset provide:

- **Package Changes**: See installed, updated, and removed packages
- **Timestamps**: Track exact installation times
- **User Actions**: Identify manual vs automated changes
- **Command Line**: View the exact command that triggered the transaction

![Server Transactions](./server-transactions-2.png)

![Server Transactions](./server-transactions.png)

### Package Statistics

Monitor package distribution at `/packages`:

- **Version Tracking**: See which versions are deployed where
- **Update History**: Track package update progression
- **Asset Count**: View how many assets use each package version

![Server Home](./server-home.png)

### Restart Tracking

Server restarts are automatically detected when the agent reports boot time
changes. The dashboard clearly indicates:

- **Assets Requiring Restart**: Systems with pending updates that need a reboot
- **Last Boot Time**: When each system was last restarted
- **Update Status**: Whether critical patches require a restart

This information helps prioritize maintenance windows and ensures security
updates are fully applied.

![Server Restart](./server-restart.png)

### Package Progression Analysis

Track update rollout over time at `/package-progression`:

- **Weekly Update Trends**: See package update activity by week
- **Historical Data**: View up to 15 weeks of update history
- **Update Velocity**: Monitor how quickly packages are being updated across
  infrastructure

## REST API

The Txlog Server provides a comprehensive REST API for programmatic access and
agent communication.

### API Documentation (Swagger UI)

Interactive API documentation is available at `/swagger`:

- **Endpoint Explorer**: Browse all available API endpoints
- **Request/Response Schemas**: View data structures and validation rules
- **Try It Out**: Test API calls directly from the browser
- **Authentication Testing**: Test API key authentication

![Server API](./server-api.png)

### API Authentication Example

```bash
# Get server version
curl -H "X-API-Key: your-api-key" \
  https://txlog.example.com/v1/version

# Submit transaction data (from agent)
curl -X POST \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d @transaction.json \
  https://txlog.example.com/v1/transactions

# Get assets requiring restart
curl -H "X-API-Key: your-api-key" \
  https://txlog.example.com/v1/assets/requiring-restart
```

## Scheduled Tasks

The server runs automated cron jobs for maintenance:

### Data Retention Job

Controlled by `CRON_RETENTION_EXPRESSION` (default: `0 2 * * *` - 2 AM daily):

- Deletes transaction data older than `CRON_RETENTION_DAYS`
- Maintains database performance
- Prevents unbounded data growth

### Statistics Generation Job

Controlled by `CRON_STATS_EXPRESSION` (default: `0 * * * *` - hourly):

- Updates aggregated package statistics
- Recalculates distribution metrics
- Refreshes dashboard data

## Deployment Best Practices

### High Availability

For production deployments:

```yaml
# Kubernetes with multiple replicas
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

### Resource Requirements

Recommended minimum resources:

- **CPU**: 100m (0.1 cores) - can burst to 500m
- **Memory**: 128Mi - 256Mi typical
- **Storage**: PostgreSQL database sizing depends on retention policy

### Monitoring

Monitor these metrics:

- `/health` endpoint for liveness/readiness
- Database connection pool status
- API response times
- Transaction ingestion rate

### Backup

Critical data to backup:

- PostgreSQL database (contains all transaction history)
- Environment configuration (document your settings)
- API keys (keep secure backups of key management)

## Troubleshooting

### Common Issues

#### Database Connection Failed

```text
Error: failed to connect to database
```

Check:

- PostgreSQL host/port are correct
- Network connectivity to database
- Database credentials are valid
- Database exists and is accessible

#### OIDC Authentication Not Working

```text
Error: Failed to initialize OIDC service
```

Check:

- All OIDC environment variables are set
- Issuer URL is accessible from the server
- Redirect URL matches your OIDC provider configuration
- Client ID and secret are correct

#### API Key Authentication Failed

```text
401 Unauthorized
```

Check:

- API key is sent in `X-API-Key` header
- API key has not been revoked
- API key exists in the database

### Logs

View logs for debugging:

```bash
# Docker
docker logs txlog-server

# Kubernetes
kubectl logs -f deployment/txlog-server
```

Set `LOG_LEVEL=DEBUG` for detailed logging during troubleshooting.
