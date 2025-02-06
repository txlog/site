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

All available commands and options can be obtained on the manpage, using `man
txlog` command.

```bash
Usage:
  txlog [command]

Available Commands:
  build:      Compile transaction info
  completion: Generate the autocompletion script for the specified shell
  help:       Help about any command
  query:      List compiled transactions
  version:    Show version number

Flags:
      --config string   config file (default is /etc/txlog.yaml)
  -h, --help            help for txlog

Use "txlog [command] --help" for more information about a command.
```

### Query filters

You can pass filters to the **query** option to display the compiled
transactions for a given host or transaction.

```bash
query: returns transaction list from the current machine
query "machine_id: 123456789": returns transaction list from the machine in question
query "machine_id: 123456789, transaction_id: 1": returns information from transaction `1`
query "machine_id: 123456789, transaction_id: 1-5": returns information from transactions `1` through `5`
```