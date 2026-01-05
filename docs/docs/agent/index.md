# Txlog Agent Documentation

The Txlog Agent is a specialized utility designed to compile transactional data
from RPM-based systems and securely transmit it to a centralized server. By
automating the collection and reporting of system changes, it enables
comprehensive monitoring and analytics, providing administrators with a unified
view of their infrastructure's state and history.

## TL;DR

```bash
# Install
sudo dnf localinstall -y https://rpm.rda.run/repo.rpm
sudo dnf install -y txlog

# Configure (update server URL)
sudo nano /etc/txlog.yaml

# Run
txlog build
```

## 1. [Tutorials](tutorials/getting_started.md)

*Learning-oriented lessons for beginners.*

* **[Getting Started](tutorials/getting_started.md)**: A hands-on guide to
    installing, configuring, and running the agent for the first time.
* **[MCP Getting Started](tutorials/mcp_getting_started.md)**: Set up the MCP
    server to use AI assistants with your infrastructure.

## 2. [How-to Guides](how-to/configure_authentication.md)

*Task-oriented guides for specific goals.*

* **[Configure Authentication](how-to/configure_authentication.md)**: Set up
    API Keys or Basic Auth.
* **[Verify Data Integrity](how-to/verify_data_integrity.md)**: Ensure local
    and server data match.
* **[Run in CI/CD](how-to/run_in_cicd.md)**: Use the agent in automated
    pipelines with `NO_COLOR`.
* **[Secure Configuration](how-to/secure_configuration.md)**: Protect your
    credentials.
* **[Configure MCP with SSE](how-to/configure_mcp_sse.md)**: Run the MCP server
    with SSE transport for web clients.

## 3. [Reference](reference/cli_commands.md)

*Information-oriented technical descriptions.*

* **[CLI Commands](reference/cli_commands.md)**: `build`, `verify`,
    `version`.
* **[MCP Tools](reference/mcp_tools.md)**: Available tools and prompts for AI
    assistants.
* **[Configuration](reference/configuration.md)**: `txlog.yaml` parameters.
* **[Environment Variables](reference/environment_variables.md)**: `NO_COLOR`
    and others.

## 4. [Explanation](explanation/architecture_overview.md)

*Understanding-oriented background knowledge.*

* **[Architecture Overview](explanation/architecture_overview.md)**: How the
    system works.
* **[Data Synchronization](explanation/data_synchronization.md)**: The logic
    behind the sync process.
* **[Design Choices](explanation/design_choices.md)**: Why we chose Go,
    Cobra, and Regex.
* **[MCP Integration](explanation/mcp_integration.md)**: How and why the Model
    Context Protocol was integrated.

## Quick Links

* **Project Repository**: [github.com/txlog/agent](https://github.com/txlog/agent)
* **Issue Tracker**: [github.com/txlog/agent/issues](https://github.com/txlog/agent/issues)
