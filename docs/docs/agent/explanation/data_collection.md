# Data Collection: What I Gather and Why

When you run an agent on your servers, the first thing you should ask is:
"Exactly what is this thing sending home?" I'm a big believer in transparency,
so I want to be crystal clear about the data I collect from your RPM-based
systems. I've designed the Txlog Agent to grab just enough to be useful for
auditing and troubleshooting, without turning into a privacy nightmare.

## What I'm Looking For

I've categorized the data I collect into three main buckets.

### 1. System Identification

To make sense of the data on the server side, I need to know which machine is
which.

* **Machine ID**: I read this from `/etc/machine-id`. It's a persistent
  identifier that stays the same even if you change the hostname or reinstall
  the OS (assuming you preserve the ID). This is how I track a single server's
  history over time.
* **Hostname**: I pull this using the standard `hostname` command. It's mostly
  for you—so you can see "web-server-01" in the dashboard instead of a random
  UUID.

### 2. Package & Transaction Data

This is the core of what I do. I'm essentially "listening" to what DNF and yum
are doing.

* **Transaction History**: I capture the full details of every transaction,
  including the timestamp and the specific command line used.
* **The "Who"**: I record which user executed the command. Essential for
  compliance.
* **The "What"**: I list every package affected—name, version, architecture, and
  whether it was installed, upgraded, or removed.
* **Scriptlet Output**: I even grab the output from the package installation
  scripts. If a post-install script fails, you'll see exactly why in the logs.

### 3. System Health & Metadata

Finally, I grab a few bits of metadata to help with context.

* **OS Details**: I check `/etc/os-release` to know exactly which distro and
  version you're running.
* **Restart Status**: I track whether the system needs a reboot after those
  updates (something we all forget too often).
* **Agent Version**: Just so I can ensure compatibility with the server
  features.

## Why Bother?

I didn't build this to spy on you. I built it because I've been in the trenches
where a production server starts acting up and nobody knows who changed what
package three days ago.

By collecting this data, I enable:

* **Compliance Auditing**: You have a permanent record of every change.
* **Security Monitoring**: You can instantly see which servers are running
  vulnerable package versions.
* **Fast Troubleshooting**: You can correlate a spike in errors with a specific
  package update in seconds.

## A Note on Privacy

We have to be honest: some of this data counts as PII (Personally Identifiable
Information) depending on your local laws. Machine IDs, hostnames, and
especially usernames can identify individuals or internal network structures.

I've made sure to keep the data collection focused, but you should definitely
review your organization's data protection policies before you roll this out
across your entire fleet.
