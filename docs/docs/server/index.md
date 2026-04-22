# Txlog Server Documentation

I've built the Txlog Server to be the heart of the entire platform. It's where
the magic happens: handling authentication, keeping your transaction logs safe,
and providing the REST API that both our agents and UIs depend on. Think of it
as the conductor of an orchestra, making sure every service stays in sync, data
remains intact, and your security policies are actually followed.

## TL;DR

Ready to get moving? You'll need a database first.

```sql
-- Create the database
CREATE DATABASE txlog;
```

Once that's sorted, you can fire up the server with a single Docker command.

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

If you're just starting out, I've put together some lessons to help you find
your feet.

- **[Setup Development Environment](tutorials/setup-dev-environment.md)**:
  I'll walk you through setting up the server locally.
- **[First API Request](tutorials/first-api-request.md)**: Learn how to make
  requests to the API.

## 2. How-to Guides

Got a specific problem to solve? These guides are designed to help you get
things done.

### Authentication & Security

- **[Configure OIDC Authentication](how-to/configure-oidc.md)**: Need to connect
  with Google or Keycloak? I've got you covered.
- **[Configure LDAP Authentication](how-to/configure-ldap.md)**: If you're using
  Active Directory or OpenLDAP, start here.
- **[Configure Anonymous LDAP](how-to/configure-ldap-anonymous.md)**: Sometimes
  you don't have a service account, and that's okay.
- **[Discover LDAP Filters](how-to/discover-ldap-filters.md)**: Finding the
  right query filter can be a pain, but it doesn't have to be.
- **[Manage API Keys](how-to/manage-api-keys.md)**: Here is how you create and
  revoke keys for your agents.

### Operations

- **[Configure Data Retention](how-to/configure-data-retention.md)**: Don't let
  your database grow forever. Let's set some cleanup policies.
- **[Manage OSV Vulnerabilities](how-to/manage-osv-vulnerabilities.md)**:
  Keeping threat data fresh is crucial, isn't it?
- **[Run Database Migrations](how-to/run-migrations.md)**: Changing your schema
  shouldn't be scary.
- **[Deploy to Kubernetes](how-to/deploy-kubernetes.md)**: When you're ready for
  the big leagues, use this manifest.

### Reports

- **[Detect Transaction Anomalies](how-to/detect-anomalies.md)**: Spotting
  unusual patterns before they become problems is key.

### Development

- **[Run Tests](how-to/run-tests.md)**: Let's make sure everything actually
  works before we ship it.

## 3. Reference

Looking for the nitty-gritty details? You'll find all the technical specs right
here.

### System

- **[API Reference](reference/api-reference.md)**: A high-level look at what the
  API can do.
- **[Database Schema](reference/database-schema.md)**: Every table, column, and
  relationship mapped out.
- **[Environment Variables](reference/environment-variables.md)**: The full list
  of everything you can configure.

### LDAP Specifics

- **[LDAP Cheatsheet](reference/ldap-cheatsheet.md)**: A quick reference for
  when you just need a variable name.
- **[LDAP Error Codes](reference/ldap-error-codes.md)**: Troubleshooting codes
  like 32, 49, or 50? I've been there.
- **[LDAP Filters Reference](reference/ldap-filters.md)**: Common patterns for
  the most popular directory services.

## 4. Explanation

Curious about why things work the way they do? I've written these to give you
some background.

### Architecture

- **[System Architecture](explanation/architecture.md)**: The "why" behind the
  design, the tech stack, and our distributed scheduler.
- **[OSV Integration Details](explanation/osv-integration.md)**: How do we
  actually fetch and score vulnerabilities? It's all in here.
- **[Data Model](explanation/data-model.md)**: A closer look at the entities and
  how they relate to each other.

### Deep Dives

- **[LDAP Authentication Deep Dive](explanation/ldap-deep-dive.md)**: A thorough
  look at how we handle LDAP under the hood.
- **[LDAP Implementation Details](explanation/ldap-implementation-details.md)**:
  The actual structure of the code itself.
- **[LDAP Service Accounts FAQ](explanation/ldap-service-account-faq.md)**: Best
  practices for managing those bind accounts.

## 5. API Documentation

Once your server is up and running, you can explore the API interactively at:
`http://localhost:8080/swagger/index.html`

I've generated this from the code comments in `docs/docs.go`. If you make
changes, just run `make doc` to keep everything up to date.
