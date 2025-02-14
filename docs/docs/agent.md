# Txlog Agent

The **txlog** agent aims to track package transactions on RPM systems, compiling
data on the number of updates and installs. Designed to enhance system
reliability, this initiative collects and centralizes information, providing
valuable insights into the evolution of packages.

## System Requirements

The **txlog** agent requires

* a RHEL-compatible Linux workstation with the `dnf`
package manager installed.
* a Txlog Server deployed in the network

## Installation

Add the RPM repository and install the agent.

```bash
sudo dnf localinstall -y https://rpm.rda.run/rpm-rda-run-1.0-1.noarch.rpm
sudo dnf install -y txlog
```

## Configuration

You need to set your Txlog Server address on `/etc/txlog.yaml` file.

::: code-group

```yaml [/etc/txlog.yaml]
server:
  url: https://txlog-server.example.com:8080
```

:::

## Basic commands

All available commands and options can be obtained calling `txlog` without
parameters, or on the manpage, using `man txlog` command.

```bash
Usage:
  txlog [command]

Available Commands:
  build        Compile transaction info
  executions   List build executions
  help         Help about any command
  items        List transactions items
  machine_id   List the machine_id of the given hostname
  transactions List compiled transactions
  version      Show agent and server version number

Flags:
      --config string   config file (default is /etc/txlog.yaml)
  -h, --help            help for txlog

Use "txlog [command] --help" for more information about a command.
```
