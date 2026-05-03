# Guide: Managing OSV Vulnerabilities

Keeping your systems secure means staying on top of the latest vulnerabilities,
and I've integrated Google's Open Source Vulnerabilities (OSV) database directly
into Txlog Server to help you do just that. While the server automatically pulls
the latest CVEs on a schedule, I know there are times when you need more
control—whether that’s forcing an immediate update or completely rebuilding your
local database from scratch. Let's look at how you can manage this critical
data.

## Getting the Latest Data: Manual Updates

If you've just heard about a new zero-day and don't want to wait for the next
scheduled sync, you can trigger a manual update with a single click.

1. Log in to your **Admin** panel.
2. Find the OSV section and look for the **Run Manually Now** button.
3. Once you confirm, the server kicks off a background process that fetches the
    latest ecosystem mappings and checks them against the Google OSV API.
4. You can keep an eye on the server logs to watch the progress, or simply
    monitor the `vulnerabilities` table to see the new records coming in.

## Starting Fresh: Reset and Rebuild

Sometimes things get a little messy; maybe you’ve added a new Linux environment
or you suspect some data might be out of sync. In those cases, I've provided an
option to wipe the slate clean and rebuild everything from zero.

1. In the **Admin** panel, look for **Reset All Data & Rebuild**.
2. **Warning**: This is a serious operation. We’ll truncate your vulnerability
    tables and reset all your historical tracking scores to zero. Why would we
    do this? To ensure that every single CVSS score is repopulated correctly
    from a clean state.
3. After you confirm, the database is wiped and an intensive fetch job begins.
4. Depending on the size of your network, it might take a few moments. You can
    watch the scores regenerate incrementally on the `Analytics > Security`
    dashboard.

### What’s happening under the hood?

When you trigger a reset, we don't just delete rows. We zero out scoreboard
counters like `vulns_fixed` and `risk_score_mitigated`. Then, our Go workers
group your packages by their exact OS ecosystem (like *AlmaLinux:9* or *RHEL:9*)
and perform bulk API queries. Finally, we re-evaluate every historical package
installation to map those mitigating actions accurately back to your dashboard.

## How We Count Vulnerabilities

I wanted to make sure our security metrics were as meaningful as possible, so
I've implemented some specific logic for how we track and display this data.

### The Security Patch Badge

When a transaction is identified as a security patch, you'll see a red shield
badge next to its ID. We classify a transaction as a patch when it results in a
**net reduction** of known vulnerabilities. In other words: did the packages you
removed or upgraded have more CVEs than the ones you just installed?

### Our Counting Logic

We count each advisory (like an ALSA or RHSA) exactly **once**, regardless of
how many packages it affects. If a single kernel advisory affects five different
sub-packages, we count it as one vulnerability fix, not five. Why inflate the
numbers when what you really care about is the advisory itself?

We calculate the delta like this:

```text
vulns_fixed = (unique CVEs in old packages) − (unique CVEs in new packages)
```

## Fixed vs. Introduced

- **Fixed**: A vulnerable package was removed or upgraded. Those CVEs are no
    longer on your system.
- **Introduced**: This is what we want to avoid. It happens when a package with
    known vulnerabilities is installed or downgraded to.

## Severity and Details

We pull severity levels directly from OSV metadata whenever possible. If it’s
missing, I’ve added a fallback system that tries to infer the severity from
keywords in the summary.

Want to see exactly which CVEs were involved in a transaction? Just use the
dropdown on the transaction row in the asset details page. It’ll open a modal
listing every associated CVE, its severity, and whether it was fixed or
introduced. If there’s no vulnerability data for a transaction, we’ll simply
disable that option to keep the UI clean.

## Special Case: CVE-2026-31431 (Copy Fail)

Unlike standard vulnerabilities that I pull from the OSV database based on
package names and versions, **CVE-2026-31431** is handled differently.

Because this specific kernel bug can be present even in seemingly "patched"
versions due to configuration or backports, the Txlog Agent performs a **live,
behavioral test** on each system.

1. **Detection**: The agent attempts a non-destructive write to the page cache
   to verify if the vulnerability exists.
2. **Reporting**: This status is sent to the server independently of the OSV
   package sync.
3. **Visualization**: Systems vulnerable to Copy Fail are marked with a distinct
   **🚨 Critical (Coral Pulse)** badge on the dashboard, as they represent a
   higher risk (privilege escalation) than standard package vulnerabilities.
