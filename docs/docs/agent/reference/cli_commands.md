<!-- markdownlint-disable MD033 MD013 -->
# CLI Command Reference

This document provides a technical reference for the `txlog` command-line
interface.

## Global Flags

The following flags apply to all commands:

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--config` | string | `/etc/txlog.yaml` | Path to the configuration file. |

## Commands

### `txlog build`

Compiles transaction information from the local DNF history and synchronizes it
with the configured Txlog Server.

**Usage:**

```bash
txlog build [flags]
```

**Exit Codes:**

| Code | Description |
| :--- | :--- |
| `0` | Success. All transactions processed and sent<br>(or already up-to-date). |
| `1` | Error. Failed to retrieve transactions, connect to server,<br>or save data. |

### `txlog verify`

Verifies data integrity between the local DNF history and the server's records.
Checks for missing transactions and package mismatches.

**Usage:**

```bash
txlog verify [flags]
```

**Exit Codes:**

| Code | Description |
| :--- | :--- |
| `0` | Success. Data is fully synchronized and verified. |
| `1` | Failure. Integrity issues detected (missing transactions,<br>extra items, missing items) or execution error. |

### `txlog version`

Displays the current version of the Txlog Agent and the connected Txlog Server.
Also checks for available updates.

**Usage:**

```bash
txlog version [flags]
```

**Exit Codes:**

| Code | Description |
| :--- | :--- |
| `0` | Success. |
| `1` | Error checking versions. |

### `txlog copyfail`

Performs a diagnostic check for the CVE-2026-31431 (Copy Fail) vulnerability on
the local system.

**Usage:**

```bash
txlog copyfail [flags]
```

**Output:**

- **GREEN**: System is NOT vulnerable (kernel is patched).
- **RED**: System IS vulnerable. It will also indicate if a privilege escalation
  path was confirmed (Phase 2).

**Exit Codes:**

| Code | Description |
| :--- | :--- |
| `0` | Success. The check was performed successfully (regardless of vulnerability status). |
| `1` | Error. Failed to perform the diagnostic check (e.g., restricted permissions or missing system capabilities). |
