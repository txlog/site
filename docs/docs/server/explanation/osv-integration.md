# How We Integrated OSV for Vulnerability Tracking

We've integrated Txlog Server tightly with Google's **Open Source
Vulnerabilities (OSV)** database to provide real-time data on any
vulnerabilities affecting the packages installed across your fleet. Why did we
choose OSV? It's a robust, open standard that allows us to query precisely
what's happening in your systems without reinventing the wheel. Let's look at
how we've implemented this behind the scenes.

## Navigating Ecosystem Isolation

One of the first things I had to account for is that OSV isn't just one giant
bucket of data. It maintains separate databases—or "ecosystems"—for each Linux
distribution. This is crucial because a vulnerability in a package like
`openssl` might be patched in AlmaLinux but still open in RHEL, or vice versa.

Here's how we map those distributions to their respective OSV ecosystems:

| Distribution | OSV Ecosystem | Advisory Prefix |
| --- | --- | --- |
| AlmaLinux | `AlmaLinux:<major>` | ALSA |
| Rocky Linux | `Rocky Linux:<major>` | RLSA |
| Red Hat Enterprise Linux | `Red Hat:<CPE>` | RHSA |

### Why these mappings matter

You might wonder why we can't just query by package name. Well, package names
are often shared across entirely different distributions. If we didn't specify
the correct ecosystem, you'd end up with "phantom" vulnerabilities—for example,
seeing AlmaLinux advisories on a Red Hat system. To avoid this, Txlog uses the
`assets.os` and `transaction_items.repo` fields to build a precise ecosystem
identifier.

We've also added some clever mapping for CentOS and Oracle Linux. Since they
don't have their own dedicated ecosystems in OSV but are binary-compatible with
RHEL, we map them to the Red Hat advisories (RHSA). It's the most accurate way
to ensure they're protected.

## Our Two-Tier Querying Strategy

Google's OSV API is powerful, but it has its quirks. Their Batch API is great
for performance, but it often truncates important fields like summaries and
descriptions. To get around this while keeping the system fast, I've implemented
a two-tier approach.

### 1. The Lightning Batch

During our scheduled scans, we send a single `POST` request to the batch
endpoint with up to 500 package combinations. This gives us a quick list of
matching advisories. However, since this initial response is stripped of
metadata, we use it primarily as a discovery phase.

### 2. The Detailed Fallback

As we process those results, we maintain an in-memory RAM cache. If we encounter
an advisory we haven't seen before, the engine automatically performs a detailed
`GET` request for that specific ID. This ensures we fetch the full, un-truncated
JSON schema, which we then cache for the remainder of the scan. It's the best of
both worlds: high performance with full data integrity.

## Determining Severity and Scores

Extracting a consistent severity score can be a bit of a moving target since
different distributions format their data differently. We've developed a
multi-tier system to handle this:

1. **CVSS Vector Parsing**: If the OSV record includes a CVSS 3.x vector
    string, we use it to compute an approximate base score.
2. **Distribution-Specific Labels**: For distributions like AlmaLinux and Rocky
    Linux, we prioritize their internal labels, such as "Critical" or
    "Important."
3. **Text-Based Fallback**: What happens if there's no structured data at all?
    In those cases, we use keyword matching within the summary and details
    fields. Since many RHEL-family advisories include severity keywords in their
    summaries, we map those to standard labels:
    - **"CRITICAL"** → `CRITICAL` (Score: 9.5)
    - **"IMPORTANT"** → `HIGH` (Score: 8.0)
    - **"MODERATE"** → `MEDIUM` (Score: 5.5)
    - **"LOW"** → `LOW` (Score: 3.0)

By storing these extracted values in our database, we're able to render the Risk
Mitigated charts and severity trackers you see on your dashboard. It's a complex
process, but it's what allows us to give you a clear, actionable view of your
security posture.
