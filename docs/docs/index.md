# Txlog Architecture Overview

Txlog consists of two main components:

## Server Version

The server component serves as a centralized system that manages the PostgreSQL
database server, functioning as a repository for transaction data while
efficiently handling incoming information from multiple agent instances
throughout the network.

To install and configure, follow the instructions on the [Server Installation
and Configuration](server) page.

## Agent Version

The agent version is a lightweight client component designed to run on
RHEL-compatible Linux workstations. It monitors and collects transaction data
from the DNF (Dandified YUM) package manager, then securely transmits this
information to the Txlog server for centralized storage and management.

To install and configure, follow the instructions on the [Agent Installation and
Configuration](agent) page.

## Data Flow

The data flow in Txlog follows these key steps:

1. The Txlog agent continuously monitors DNF activities on workstations,
   capturing all package management transactions as they occur.
2. Each transaction's metadata is parsed and structured, including package
   names, versions, operation types, and timestamps.
3. Using secure network protocols, the processed transaction data is encrypted
   and transmitted from each agent to the central Txlog server.
4. The Txlog server validates incoming data and permanently stores it in a
   structured format within the PostgreSQL database for analysis and auditing.

## Disclaimer

* RPM is a trademark of Red Hat, Inc., registered in the United States and other countries.
* Logbook icon created by [smashingstocks](https://www.flaticon.com/authors/smashingstocks), available on Flaticon.
