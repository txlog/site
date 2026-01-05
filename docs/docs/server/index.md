# Txlog Server Documentation

The Txlog Server is the core component of the platform, responsible for managing
authentication, persisting transaction logs, and exposing the REST API used by
agents and user interfaces. It orchestrates communication between services,
ensuring data integrity and enforcing configured retention and security
policies.

## TL;DR

```sql
-- Create the database
CREATE DATABASE txlog;
```

```bash
# Run the server
docker run -d --name txlog-server \
  -e PGSQL_HOST=db.example.com \
  -e PGSQL_USER=txlog \
  -e PGSQL_PASSWORD=txlog \
  -e PGSQL_DB=txlog \
  -p 8080:8080 \
  ghcr.io/txlog/server:main
```

## 1. Tutorials

*Learning-oriented lessons for beginners.*

- **[Getting Started](tutorials/getting-started.md)**: Set up the server locally with Docker.
- **[Your First API Request](tutorials/first-api-request.md)**: Learn how to interact with the API.

## 2. How-to Guides

*Task-oriented guides for specific goals.*

### Authentication & Security

- **[Configure OIDC Authentication](how-to/configure-oidc.md)**: Connect with Google, Keycloak, etc.
- **[Configure LDAP Authentication](how-to/configure-ldap.md)**: Connect with Active Directory or OpenLDAP.
- **[Configure Anonymous LDAP](how-to/configure-ldap-anonymous.md)**: For servers without service accounts.
- **[Discover LDAP Filters](how-to/discover-ldap-filters.md)**: How to find the right query filters for your directory.
- **[Manage API Keys](how-to/manage-api-keys.md)**: Create and revoke keys for agents.

### Operations

- **[Configure Data Retention](how-to/configure-data-retention.md)**: Manage database cleanup policies.
- **[Run Database Migrations](how-to/run-migrations.md)**: Apply schema changes safely.
- **[Deploy to Kubernetes](how-to/deploy-kubernetes.md)**: Production deployment manifest.

### Development

- **[Add a New Endpoint](how-to/add-endpoint.md)**: Workflow for contributors.
- **[Run Tests](how-to/run-tests.md)**: Execute the test suite.

## 3. Reference

*Information-oriented technical descriptions.*

### System

- **[API Reference](reference/api-reference.md)**: High-level API overview.
- **[Database Schema](reference/database-schema.md)**: Tables, columns, and relationships.
- **[Environment Variables](reference/environment-variables.md)**: Complete configuration reference.

### LDAP Specifics

- **[LDAP Cheatsheet](reference/ldap-cheatsheet.md)**: Quick reference for variables and common setups.
- **[LDAP Error Codes](reference/ldap-error-codes.md)**: Troubleshooting common error codes (32, 49, 50).
- **[LDAP Filters Reference](reference/ldap-filters.md)**: Common filter patterns for AD, OpenLDAP, etc.

## 4. Explanation

*Understanding-oriented background knowledge.*

### Architecture

- **[System Architecture](explanation/architecture.md)**: High-level design, stack, and distributed scheduler.
- **[Data Model](explanation/data-model.md)**: Entities and relationships explanation.

### Deep Dives

- **[LDAP Authentication Deep Dive](explanation/ldap-deep-dive.md)**: Comprehensive guide to how LDAP auth works.
- **[LDAP Implementation Details](explanation/ldap-implementation-details.md)**: Internal code structure of the LDAP module.
- **[LDAP Service Accounts FAQ](explanation/ldap-service-account-faq.md)**: Best practices for bind accounts.
- **[Testing Strategy](explanation/testing-strategy.md)**: Overview of the test suite and coverage goals.

## 5. API Documentation

When the server is running, interactive API documentation is available at:
`http://localhost:8080/swagger/index.html`

- **Source**: `docs/docs.go` (Generated from code comments)
- **Update**: Run `make doc` to regenerate.
