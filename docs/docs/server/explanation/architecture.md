# Architecture Overview

I've designed the Txlog Server to be the central hub of our logging operations.
Its primary role is to collect, store, and visualize data from our distributed
agents. Why did we choose a centralized approach? It's simply the most efficient
way to maintain a cohesive view of everything happening across the entire fleet.

## High-Level Architecture

The system relies on a classic **Client-Server** model. It's a proven
architecture that ensures reliability without adding unnecessary complexity:

1. **Agents (Clients)**: These are installed on our servers (specifically Linux
    RPM-based systems). They're responsible for collecting DNF/YUM transaction
    history and system metadata, which they then push to the server via
    HTTP/JSON.
2. **Server**: A monolithic Go application. It's the component that receives
    the data, processes it, and ensures it's stored safely in our relational
    database.
3. **Database**: We use PostgreSQL as the single source of truth for all our
    data.

## Key Design Decisions

### 1. Asset Management (Logical vs. Physical Identity)

One of the key challenges I wanted to address was how we distinguish between a
*logical* server (like "web-01") and its actual *physical* hardware.

- **The Problem**: If a server like "web-01" is re-imaged, it generates a
    brand new `/etc/machine-id`. In a simpler system, this would look like a
    completely new server, which would unfortunately break your history.
- **The Solution**: We developed the `AssetManager` to handle this. It uses
    specific logic to link the `hostname` (the logical ID) with the `machine_id`
    (the physical ID).
  - When a new `machine_id` reports with an existing `hostname`, the system
   recognizes the change and automatically deactivates the old asset while
   starting a new one.
  - This approach lets us keep the history of "web-01" intact, even across
   full re-installations.

### 2. Distributed Scheduler

We've included a built-in scheduler for essential background tasks, such as
cleaning up old data or calculating statistics.

- **The Challenge**: If you're running this in a high-availability
    environment—like Kubernetes with multiple replicas—how do you prevent every
    instance from running the same job at once?
- **The Solution**: We've implemented **Distributed Locking via the
    Database**.
  - Before any instance starts a job, it must acquire a named lock in our
   `cron_lock` table.
  - Only the instance that successfully secures the lock proceeds with the
   job. It's a simple, robust solution that doesn't require us to manage
   extra dependencies like Redis.

### 3. Authentication Strategy

We wanted to offer enough flexibility to cover several different deployment
scenarios:

- **OIDC/LDAP**: This is the standard for human users. It integrates directly
    with your enterprise identity providers for secure web access.
- **No-Auth Mode**: This is primarily intended for local development or
    isolated networks. It's there to remove friction when you're just getting
    started with a new setup.

## Security Principles

Security isn't something we take lightly. I've implemented several layers of
hardening to ensure the system remains secure:

1. **Cookie Security**: All session cookies use the `SameSite=Lax` policy.
    Furthermore, when the server is running in production mode, we enforce the
    `Secure` flag on all cookies.
2. **CSRF Mitigation**: Any operation that modifies state must use a `POST`
    request. Combined with our cookie policies, this provides a solid defense
    against CSRF attacks.
3. **Strict Error Handling**: We're quite careful about what information we
    expose. API responses use generic messages, ensuring that sensitive database
    or internal details remain only in the server logs.
4. **Mandatory TLS**: We don't allow "skip verify" modes for external
    connections. The server always verifies TLS certificates when connecting to
    OIDC or LDAP providers.
5. **RBAC**: Destructive operations—like deleting assets or running
    migrations—are strictly limited to the Administrator role.
6. **Credential Masking**: Any sensitive configuration values are masked in the
    UI with fixed-length strings. This prevents anyone from even guessing the
    length of your credentials.

### The Ingestion Pipeline

When an agent sends data, it follows a clear path:

1. The **Agent** sends a JSON payload to our `/v1/executions` endpoint.
2. The **Controller** performs a quick validation to ensure the data is
    well-formed.
3. The **Asset Manager** updates the state of the asset.
4. The **Transaction Manager** records the new transactions and links them
    appropriately.
5. The **Server** responds with a 200 OK once the process is complete.
