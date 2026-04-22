# Guide: Detecting Transaction Anomalies

When you're managing hundreds or thousands of packages across multiple hosts,
it’s easy for something unusual to slip through the cracks. I've built anomaly
detection into Txlog Server to act as your extra pair of eyes. Whether it’s a
sudden bulk update or a suspicious version downgrade, the system is designed to
flag these patterns so you can investigate before they become real problems.
Ready to see what's happening under the hood?

## Spotting Anomalies in the UI

If you're more of a visual person, the dashboard is the best place to start.
I've made the reports intuitive so you can quickly get a handle on what's going
on.

1. Open your dashboard and head over to **Reports** > **Anomaly Detection**.
2. Use the time filter to select your analysis window. Looking at the last 7 or
    30 days is usually enough to spot a trend.
3. Feeling overwhelmed? You can filter by **Severity** (Low, Medium, or High)
    to focus on the most critical events first.
4. The results table gives you all the context you need:
    * **Host**: Which asset is acting up?
    * **Type**: Is this a `high_volume` change, a `rapid_change`, or a
        `downgrade`?
    * **Details**: I've included the specific numbers here, like how many
        packages were touched in a single transaction.

## Fetching Anomalies via the API

I know many of you prefer to automate your monitoring, so I've made sure all
this data is available through our API. It’s perfect for plugging into your
existing alerting systems.

### A Simple Query

Want to see everything that’s happened in the last week? A quick `curl` call
will give you the full list:

```bash
curl "http://localhost:8080/v1/reports/anomalies?days=7" -H "X-API-Key: YOUR_API_KEY"
```

### Focusing on High Severity

If you only care about the most serious issues from the past month, you can
easily narrow your search:

```bash
curl "http://localhost:8080/v1/reports/anomalies?days=30&severity=high" -H "X-API-Key: YOUR_API_KEY"
```

## Understanding the Different Anomaly Types

I've focused on three main patterns that usually point to something that needs
your attention.

* **`high_volume`**: This flags transactions that touch an unusually large
    number of packages. If someone updates 100 packages at once, shouldn't you
    know about it? It’s a great way to track bulk operations that might impact
    system stability.
* **`rapid_change`**: Have you ever seen a package get updated or reinstalled
    three times in a single day? That’s what we call "flapping," and it usually
    indicates a failing upgrade or a configuration fight that's going nowhere.
* **`downgrade`**: This is a big one. Why would a package go back to an older
    version? It might be a deliberate rollback, but it could also be an attempt
    to bypass a security patch. I've made sure these are flagged so you can
    verify the intent.
