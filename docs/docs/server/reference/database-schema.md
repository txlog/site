# Reference: Database Schema

If you're curious about how we store all that transaction data or want to build
your own custom queries, you’ll need to understand our database schema. I’ve
designed it to be as clean and logical as possible, keeping the physical
hardware IDs separate from the logical hostnames. Let's take a look at the
tables that keep Txlog Server running.

## The Core Tables

These are the tables you'll probably interact with the most. They track your
assets and the history of everything that happens on them.

### `assets`

This is our central registry for every machine we manage. I’ve designed it to
track asset replacements by linking a logical `hostname` with a physical
`machine_id`. This way, if you replace a server but keep the same name, we can
still tell the difference. Clever, don't you think?

### `executions`

Think of this as our heartbeat log. Every time an agent runs, it leaves a record
here. We track whether the check-in succeeded and capture the environment
details at that specific moment.

### `transactions`

This is where the heavy lifting happens. We store the high-level details of
every RPM transaction. Recently, I've expanded this table to include a lot of
security-related metrics—why not have your vulnerability data right where the
changes happen?

### `transaction_items`

If `transactions` is the "what," then this table is the "how much." It lists
every single package that was touched during a transaction.

## Security & Vulnerabilities

These tables power our security dashboards, linking known vulnerabilities to the
packages installed on your assets.

### `vulnerabilities`

This table mirrors the Google OSV database for the ecosystems you use. It’s
where we store the details of every CVE that might affect your systems.

### `package_vulnerabilities`

This is a junction table that maps specific package versions to the
vulnerabilities they contain. It’s how we know exactly which of your assets are
at risk.

## Authentication & Admin

These tables manage who can access the Txlog Server and how agents authenticate
when they check in.

### `users`

We store our admin panel users here. Whether they’re coming from OIDC or LDAP,
this is where we manage their identities and permissions.

### `user_sessions`

If you’re using OIDC, we track your active dashboard sessions here. It allows us
to manage session expiry and revocations smoothly.

### `api_keys`

Our agents need a secure way to authenticate, and this table manages those keys.
We never store the plain-text keys—only a secure hash.

## Internal System Tables

These tables are mostly used for internal housekeeping, but they're still good
to know about if you're diving deep into the system.

### `statistics`

We store pre-calculated metrics here to keep the dashboard snappy. Instead of
running heavy aggregations every time you load a page, we just read from this
table.

### `cron_lock`

Since the server can run in a cluster, we need a way to make sure background
jobs (like OSV syncing) don't run on multiple nodes at the same time. This table
acts as a simple distributed lock.

### `schema_migrations`

This is a standard table used by our migration tool. It keeps track of which
schema updates have been applied so we don't try to run them twice.
