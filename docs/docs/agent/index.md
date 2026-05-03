# Txlog Agent Documentation

I've built the Txlog Agent to take the headache out of tracking system changes
on RPM-based machines. It's a specialized tool that gathers up your
transactional data and sends it over to a central server. Why bother doing this
manually? By automating the whole process, I've made it easy for you to see
exactly what's happening across your entire infrastructure from one place.

## TL;DR

If you're in a hurry, here is how you get it up and running.

```bash
# Install
sudo dnf localinstall -y https://rpm.rda.run/repo.rpm
sudo dnf install -y txlog

# Configure (update server URL)
sudo nano /etc/txlog.yaml

# Run
txlog build
```

## 1. Tutorials

Just getting started? I've put together these lessons to help you get the hang
of things.

* **[Getting Started](tutorials/getting_started.md)**: I'll walk you through the
  first installation and setup.
* **[MCP Getting Started](tutorials/mcp_getting_started.md)**: Learn how to
  connect your AI assistants to your infrastructure using the MCP server.

## 2. How-to Guides

Got a specific goal in mind? These guides will show you exactly how to reach it.

* **[Configure Authentication](how-to/configure_authentication.md)**: I'll show
  you how to set up API keys or basic auth.
* **[Verify Data Integrity](how-to/verify_data_integrity.md)**: It's important
  to know your local and server data match, isn't it?
* **[Run in CI/CD](how-to/run_in_cicd.md)**: Using the agent in automated
  pipelines is a breeze.
* **[Secure Configuration](how-to/secure_configuration.md)**: Let's make sure
  your credentials stay private.
* **[Configure MCP with SSE](how-to/configure_mcp_sse.md)**: Setting up the MCP
  server for web clients is easier than you think.
* **[Detect Copy Fail Vulnerability](how-to/detect-copy-fail-vulnerability.md)**:
  Diagnose CVE-2026-31431 on your servers using a safe, non-destructive tool.

## 3. Reference

Looking for the technical details? You'll find everything you need right here.

* **[CLI Commands](reference/cli_commands.md)**: A complete list of commands
  like `build`, `verify`, and `version`.
* **[MCP Tools](reference/mcp_tools.md)**: All the tools and prompts available
  for your AI assistants.
* **[Configuration](reference/configuration.md)**: Every parameter you can tweak
  in `txlog.yaml`.
* **[Environment Variables](reference/environment_variables.md)**: From
  `NO_COLOR` to more advanced settings.

## 4. Explanation

Ever wonder why we built things the way we did? These pages go behind the
scenes.

* **[Architecture Overview](explanation/architecture_overview.md)**: A look at
  how the whole system fits together.
* **[Data Collection](explanation/data_collection.md)**: A candid look at exactly
  what data we gather from your systems and why it matters.
* **[Data Synchronization](explanation/data_synchronization.md)**: I've
  documented the logic we use to keep everything in sync.
* **[Design Choices](explanation/design_choices.md)**: Why we chose Go, Cobra,
  and Regex for this project.
* **[MCP Integration](explanation/mcp_integration.md)**: The "why" and "how" of
  our Model Context Protocol integration.
* **[Copy Fail Detection Logic](explanation/copy-fail-detection.md)**: A deep
  dive into how we safely detect kernel vulnerabilities like CVE-2026-31431.

## Quick Links

* **Project Repository**:
  [github.com/txlog/agent](https://github.com/txlog/agent)
* **Issue Tracker**:
  [github.com/txlog/agent/issues](https://github.com/txlog/agent/issues)
