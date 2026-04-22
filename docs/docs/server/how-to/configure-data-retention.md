# Guide: Configuring Data Retention

Data is valuable, but let's be honest: keeping everything forever is a recipe
for a bloated database and sluggish performance. That’s why we've built a
housekeeping scheduler into Txlog Server. It’s designed to automatically sweep
away old execution data so you can focus on what’s relevant right now. Ready to
keep your database lean? Let's walk through the setup.

## The Controls

We've simplified the retention policy down to just two environment variables.
It’s a straightforward way to balance your history needs with your storage
constraints.

### 1. `CRON_RETENTION_DAYS`

This is where you tell the server exactly how many days of data you want to keep
around.

- **Default**: `7` (A week is a good starting point for most).
- **Example**: Want to keep a month’s worth of history? Just set this to `30`.

### 2. `CRON_RETENTION_EXPRESSION`

This defines **when** the cleanup job actually kicks off using standard Cron
syntax.

- **Default**: `0 2 * * *` (Every day at 2:00 AM, when things are usually
    quiet).
- **Format**: `Minute Hour Day Month DayOfWeek`.

## How to Set It Up

Configuring this only takes a moment. Just follow these quick steps:

1. Open your `.env` file (or wherever you manage your deployment secrets).
2. Add or update these two variables to match your needs:

```bash
# Let's keep data for 30 days
CRON_RETENTION_DAYS=30

# And we'll run the cleanup every Sunday at 3:00 AM
CRON_RETENTION_EXPRESSION=0 3 * * 0
```

1. Give the server a quick restart to pick up the new policy.

## Verifying the Work

Wondering if the housekeeper is actually doing its job? You don't have to
guess—just check your server logs for the "Housekeeping" task. You should see
entries that look something like this:

```text
[INFO] Housekeeping: executing task...
[INFO] Housekeeping: executions older than 30 days are deleted.
```
