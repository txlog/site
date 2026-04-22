# Reference: Environment Variables

Configuring Txlog Server is straightforward because I’ve designed it to be
entirely environment-driven. Whether you're running it in a Docker container or
directly on a Linux host, these variables are the levers you'll use to tune the
system to your needs. Let's look at the options available to you.

## General Settings

These are the basic knobs that control the server's identity and how it talks to
you through logs.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `INSTANCE` | - | The name of your environment (e.g., "Production"). It’s displayed in the UI, so why not make it clear for your team? |
| `LOG_LEVEL` | `INFO` | How much detail do you want in the logs? Choose from `DEBUG`, `INFO`, `WARN`, or `ERROR`. |
| `GIN_MODE` | `release` | Setting this to `release` mode isn't just for performance; it also ensures that session cookies are automatically marked as `Secure`. |
| `PORT` | `8080` | The HTTP port I'll listen on. |

## Database Configuration

We use PostgreSQL for everything, and these variables tell the server exactly
how to find and talk to your database instance.

| Variable | Required | Description |
| :--- | :--- | :--- |
| `PGSQL_HOST` | Yes | Your database hostname or IP address. |
| `PGSQL_PORT` | Yes | The database port (usually `5432`). |
| `PGSQL_USER` | Yes | Your database username. |
| `PGSQL_PASSWORD` | Yes | Your database password. |
| `PGSQL_DB` | Yes | The name of the database I should use. |
| `PGSQL_SSLMODE` | Yes | SSL mode (`disable`, `require`, `verify-full`). In production, I’d strongly suggest `verify-full` for maximum security. |

## Authentication (OIDC)

If you're using a modern identity provider like Google, Okta, or Authentik, OIDC
is the way to go.

| Variable | Required | Description |
| :--- | :--- | :--- |
| `OIDC_ISSUER_URL` | No | Your OIDC Provider URL (e.g., `https://accounts.google.com`). |
| `OIDC_CLIENT_ID` | No | The Client ID provided by your identity provider. |
| `OIDC_CLIENT_SECRET` | No | The Client Secret associated with your ID. |
| `OIDC_REDIRECT_URL` | No | The callback URL. Make sure this exactly matches what you’ve configured in your provider’s dashboard! |

## Authentication (LDAP)

For those of you still relying on a classic directory service, I’ve included
robust LDAP support.

| Variable | Required | Description |
| :--- | :--- | :--- |
| `LDAP_HOST` | No | Your LDAP server hostname. |
| `LDAP_PORT` | No | The LDAP port (usually `389` or `636`). |
| `LDAP_USE_TLS` | No | Set this to `true` if you're using LDAPS. |
| `LDAP_BIND_DN` | No | The DN for your service account. |
| `LDAP_BIND_PASSWORD` | No | The password for that service account. |
| `LDAP_BASE_DN` | No | Where should I start searching for users? |
| `LDAP_USER_FILTER` | No | The filter I’ll use for logins (e.g., `(uid=%s)`). |
| `LDAP_ADMIN_GROUP` | No | The DN of the group that gets full admin access. |
| `LDAP_VIEWER_GROUP` | No | The DN of the group that only gets read-only access. |
| `LDAP_GROUP_FILTER` | `(member=%s)` | The LDAP filter I'll use to check for group membership. |

## Scheduler & Data Retention

Txlog Server handles a lot of housekeeping in the background. You can use these
variables to control how long we keep your history and exactly when these
background jobs run.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `CRON_RETENTION_DAYS` | `7` | How many days of execution history should we keep? |
| `CRON_RETENTION_EXPRESSION` | `0 2 * * *` | When should I run the cleanup job? (Standard CRON expression). |
| `CRON_STATS_EXPRESSION` | `0 * * * *` | How often should I recalculate the dashboard statistics? |
| `CRON_OSV_EXPRESSION` | `0 4 * * *` | When should I sync the OSV vulnerability data? |
