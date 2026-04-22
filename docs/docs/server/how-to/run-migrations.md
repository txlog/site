# Guide: Running Database Migrations

Whenever we release a new version of Txlog Server that includes schema changes,
you'll need to run database migrations. I’ve made this process as safe as
possible to ensure you don't run into any nasty surprises during an upgrade.
Let's walk through how you can keep your database schema in sync with the latest
code.

## Why We Don't Automate This by Default

Currently, the server does **not** automatically run migrations on startup. Why?
Because in a production environment, I think you should always have a person at
the wheel when the database schema is changing. It prevents those "oops" moments
that can happen when a new container version spins up unexpectedly and starts
modifying your tables without warning.

## Running Migrations via the Admin Panel

This is by far the safest and easiest way to apply changes. It’s the method I
recommend for almost every setup.

1. Log in to your **Admin Panel** (usually at `/admin`).
2. Look for the **Migration Status** section. You'll see your "Current Version"
    and a list of any "Pending Migrations."
3. If your database is behind, a **Run Migrations** button will be right there
    waiting for you.
4. Click the button—the server will take care of the rest.
5. Once the page reloads, you should see that all migrations are "Applied."

## Troubleshooting the "Dirty Database"

If a migration happens to fail halfway through—maybe due to a lost connection or
a constraint violation—your database might be marked as "dirty." This is a
safety mechanism to prevent the server from trying to run more migrations on an
inconsistent schema.

In these rare cases, you'll need to jump into your SQL console to manually fix
the underlying issue or update the `schema_migrations` table to clear the dirty
flag. Have you ever had to deal with a dirty database before? It’s not a fun way
to spend an afternoon, but it’s there to protect your data from further
corruption.

If you're stuck, let's take a look at your migration logs together to see
exactly where things went wrong.
