# Understanding the Data Model

When I started designing the data model for Txlog Server, I wanted to create
something that felt intuitive while still being robust enough to handle the
complexities of distributed asset management. After all, if the foundation isn't
solid, your visualizations and queries won't be either. Let's walk through our
core entities and how they all fit together.

## The Core Entities

We've broken down our data into four main entities. Think of them as answering
the basic questions: Who, When, What, and the granular Details.

### 1. Asset (The "Who")

An **Asset** represents a managed machine. It's the central hub to which all
other data is attached. One of the most important concepts here is how we
separate the `Hostname` from the `MachineID`.

- **Hostname**: This is your stable, human-readable name (like `db-prod-01`).
- **MachineID**: This is the unique identifier of the OS installation itself.
- **Lifecycle**: We've designed assets to be dynamic. An asset stays "Active"
    until a new MachineID reports with an old Hostname. At that point, the
    system realizes the hardware or OS has changed, and it marks the old record
    as "Inactive" to preserve history.

### 2. Execution (The "When")

An **Execution** represents a single "check-in" from the Txlog Agent. You can
think of it as a heartbeat. It captures the state of the machine at a specific
point in time, including metadata like the Agent Version and whether the run was
successful.

### 3. Transaction (The "What")

A **Transaction** corresponds to a specific DNF/YUM operation—for example,
updating five packages. Each transaction is linked back to a specific Asset via
its MachineID. We also store the exact command line that was run and the user
who initiated it.

### 4. Transaction Item (The "Details")

This is our most granular record. A **Transaction Item** tracks a single package
being changed within a larger Transaction. Want to find every server that
recently upgraded `kernel` from `5.14` to `5.15`? This is where that data lives.

## Why We Made Certain Design Choices

You might notice some specific decisions that differ from a typical relational
setup. Let's talk about the "why" behind them.

### Why Composite Keys?

If you look at the `transactions` table, you'll see we use a composite primary
key consisting of `transaction_id` and `machine_id`. Why not just a single ID?
Well, the `transaction_id` actually comes from the local RPM database on the
client machine. While it's unique on that specific server, it's definitely not
unique across your whole fleet. By combining it with the `machine_id`, we can
uniquely identify any transaction globally.

### Why Immutable History?

I've built Txlog Server primarily as an **Audit Log**. This means the data is
almost entirely append-only. Aside from updating the `last_seen` timestamp on an
Asset, we rarely modify data once it's been inserted.

Why take this approach? Because when you're dealing with security and
compliance, the integrity of your historical record is everything. If you can't
trust that your logs haven't been tampered with or overwritten, what's the point
of having them in the first place?
