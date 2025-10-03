# Txlog Server

Txlog Server is a robust transaction log management system designed to handle
and process business transactions in a reliable and efficient manner. It serves
as a centralized platform for recording, monitoring, and managing transaction
logs across different services and applications. The server is particularly
useful in distributed systems where maintaining a consistent and accurate record
of transactions is crucial for data integrity and system reliability.

The primary purpose of Txlog Server is to provide a dependable mechanism for
tracking transaction states, ensuring data consistency, and facilitating error
recovery in case of system failures. It acts as a single source of truth for
transaction history, making it an essential component for businesses that
require precise transaction tracking and audit capabilities.

In addition, the Txlog Server provides detailed information in the asset listing
regarding whether a system restart is required to apply security updates. This
feature is crucial for maintaining operational security and minimizing downtime,
as it allows administrators to quickly identify assets that need immediate
attention. By clearly indicating which updates are pending and whether a restart
is necessary, the server helps ensure that critical patches are applied
promptly, reducing the risk of vulnerabilities being exploited. This proactive
approach supports compliance with security best practices and enables efficient
planning for maintenance windows, ultimately contributing to the reliability and
safety of the entire system.

## System Requirements

Before running Txlog Server, ensure you have access to a PostgreSQL database
server that will store the transaction logs and related data. You need to
create a blank database; the tables are created when the server starts.

```sql
CREATE DATABASE "txlog" WITH ENCODING = 'UTF8';
```

## Installation

The Txlog server can be easily deployed using Docker or using kuberentes. First,
pull the container image from the GitHub Container Registry:

::: code-group

```bash [Docker]
docker run -d -p 8080:8080 \`
  -e INSTANCE=My Datacenter \
  -e LOG_LEVEL=ERROR \
  -e PGSQL_HOST=postgres.example.com \
  -e PGSQL_PORT=5432 \
  -e PGSQL_USER=txlog \
  -e PGSQL_DB=txlog \
  -e PGSQL_PASSWORD=your_db_password \
  -e PGSQL_SSLMODE=require \
  -e CRON_RETENTION_DAYS=7 \
  -e CRON_RETENTION_EXPRESSION=0 2 * * * \
  -e CRON_STATS_EXPRESSION=0 1 * * * \
  cr.rda.run/txlog/server:main
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
        image: cr.rda.run/txlog/server:main
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
          value: "ERROR"
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
          value: 7
        - name: CRON_RETENTION_EXPRESSION
          value: "0 2 * * *"
        - name: CRON_STATS_EXPRESSION
          value: "0 1 * * *"
        - name: IGNORE_EMPTY_EXECUTION
          value: true
```

:::

If you want to use a production (stable) version, replace `main` by the version
number (e.g. `v1.0`) in the Docker commands and Kubernetes configuration.

## Options

The Txlog Server can be configured using the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `INSTANCE` | A name to identify this server instance | `My Datacenter` |
| `LOG_LEVEL` | The logging level (DEBUG, INFO, WARN, ERROR) | `ERROR` |
| `PGSQL_HOST` | PostgreSQL server hostname | `postgres.example.com` |
| `PGSQL_PORT` | PostgreSQL server port | `5432` |
| `PGSQL_USER` | PostgreSQL username | `txlog` |
| `PGSQL_DB` | PostgreSQL database name | `txlog` |
| `PGSQL_PASSWORD` | PostgreSQL user password | `your_db_password` |
| `PGSQL_SSLMODE` | PostgreSQL SSL mode (disable, require, verify-full) | `require` |
| `CRON_RETENTION_DAYS` | Number of days to keep transaction logs | `7` |
| `CRON_RETENTION_EXPRESSION` | Cron expression for log cleanup job | `0 2 * * *` |
| `CRON_STATS_EXPRESSION` | Cron expression for statistics generation | `0 1 * * *` |
| `IGNORE_EMPTY_EXECUTION` | Skip logging of empty executions | `true` |

## Authentication

The Txlog Server provides **optional** authentication support through OpenID Connect (OIDC). When enabled, authentication protects the web interface while keeping the API endpoints open for agent access.

### Authentication Modes

The server operates in two modes:

- **Without Authentication** (default): When OIDC is not configured, all web pages and API endpoints are accessible without authentication
- **With OIDC Authentication**: When OIDC is configured, web pages require authentication, but API endpoints (`/v1/*`) remain open for agent access

### Web Interface Authentication (OIDC)

To enable authentication for the web interface, configure the following environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OIDC_CLIENT_ID` | OAuth2 client ID for your application | - | Yes |
| `OIDC_CLIENT_SECRET` | OAuth2 client secret | - | Yes |
| `OIDC_ISSUER_URL` | OIDC provider's issuer URL | `http://localhost:8090` | No |
| `OIDC_REDIRECT_URL` | Redirect URI after authentication | `http://localhost:8080/auth/callback` | No |
| `OIDC_SKIP_TLS_VERIFY` | Skip TLS certificate verification (for self-signed certificates) | `false` | No |

::: warning
If both `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` are not provided, the server will run **without authentication**. All web pages will be publicly accessible.
:::

#### Provider Configuration Examples

::: code-group

```bash [Pocket ID]
# Pocket ID Configuration
# Self-hosted OIDC provider: https://pocket-id.org
OIDC_ISSUER_URL=https://pocketid.example.com
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

```bash [Google]
# Google OAuth2 Configuration
# Create credentials at: https://console.cloud.google.com/apis/credentials
OIDC_ISSUER_URL=https://accounts.google.com
OIDC_CLIENT_ID=your-client-id.apps.googleusercontent.com
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

```bash [Microsoft Entra ID]
# Microsoft Entra ID (Azure AD) Configuration
# Register app at: https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps
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
# Auth0 Configuration
# Create application at: https://manage.auth0.com/
OIDC_ISSUER_URL=https://{your-domain}.auth0.com/
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

```bash [Okta]
# Okta Configuration
# Create app at: https://{your-domain}.okta.com/admin/apps
OIDC_ISSUER_URL=https://{your-domain}.okta.com/oauth2/default
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URL=https://txlog.example.com/auth/callback
OIDC_SKIP_TLS_VERIFY=false
```

:::

#### User Management

Users are automatically created on their first login. The system supports:

- **Active/Inactive status**: Users can be deactivated by administrators
- **Admin privileges**: First-time setup may require manual promotion of admin users in the database

### API Authentication

The REST API endpoints (`/v1/*`) do **not** require authentication, even when OIDC is enabled. This design allows agents to send transaction data without managing OIDC tokens.

#### Securing the API

To protect the API endpoints, use a reverse proxy with basic authentication in front of the Txlog Server:

**Caddy Example**:

```caddyfile
txlog.example.com {
    # Protect API endpoints
    @api path /v1/*
    basicauth @api {
        agent $2a$14$...hashed_password...
    }

    # Forward to Txlog Server
    reverse_proxy localhost:8080
}
```

**Nginx Example**:

```nginx
location /v1/ {
    auth_basic "Txlog API";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://localhost:8080;
}
```

Configure the [agent](https://txlog.rda.run/docs/agent#configuration) with the username and password defined in your reverse proxy.

## UI and API

Once the server is running, you can access its interface at `http://<server-address>:8080`. From there, you can:

### View all collected transaction logs

Transaction logs for each asset provide valuable insights into what software
packages or updates have been installed and the exact time of installation. By
reviewing these logs, administrators can track changes to system components,
verify compliance with update policies, and quickly identify the source of
recent modifications. This level of visibility is essential for auditing,
troubleshooting, and ensuring that all assets remain up-to-date and secure.

![Server Transactions](./server-transactions-2.png)

![Server Transactions](./server-transactions.png)

### Monitor package statistics

Package statistics provide a comprehensive overview of how updates are being
distributed across all assets in the system. By analyzing these statistics,
administrators can identify which assets have received the latest security
patches and which ones are pending updates. This visibility enables proactive
management of vulnerabilities, ensuring that critical updates are delivered
promptly and consistently. As a result, monitoring package statistics not only
streamlines update deployment but also significantly enhances the overall
security posture by reducing the risk of unpatched systems being exploited.

![Server Home](./server-home.png)

### Track server restarts

Server restarts are crucial for applying updates and ensuring system stability.
By tracking when a server was last restarted, administrators can determine if
the latest updates have been applied successfully. This information is vital for
maintaining operational efficiency and security, as it helps identify any
pending restarts that may be necessary to complete the update process. By
keeping a record of server restarts, organizations can ensure that their systems
are running the most current software versions, thereby minimizing
vulnerabilities and enhancing overall performance.

![Server Restart](./server-restart.png)

### Access the API documentation through Swagger UI

The Txlog Server provides a comprehensive API for interacting with transaction
logs and statistics. You can access the API documentation through Swagger UI at
`http://<server-address>:8080/swagger`. This interface allows developers to
explore available endpoints, understand request and response formats, and test
API calls directly from the browser.

![Server API](./server-api.png)
