# Copy Fail Detection Logic

This document explains the technical implementation of the CVE-2026-31431 (Copy
Fail) detection mechanism in the Txlog Agent.

## Overview

The CVE-2026-31431 vulnerability resides in the Linux kernel's `AF_ALG` socket
implementation, specifically within the `authencesn` (Authenticated Encryption
with Serial Number) algorithm. It allows an unprivileged user to write arbitrary
data into the page cache of files they only have read access to.

## Detection Strategy

The Txlog Agent implements a **non-destructive live detection** strategy. Unlike
version-based checks, this actually verifies the behavior of the running kernel
without modifying any system files.

### Phase 1: Proof-of-Bug (The Write Test)

The goal of this phase is to determine if the kernel incorrectly handles the
`splice()` system call when used with `AF_ALG`.

1. **Setup**: The agent creates a temporary file in `/tmp` containing a specific
   marker string.
2. **Pipeline**: It sets up an `AF_ALG` socket using `authencesn`.
3. **Splice**: It uses `splice()` to move data from the file into the socket,
   and then attempts to use `splice()` again to move data back into the file's
   page cache.
4. **Verification**: After the operation, the agent reads the file. If the
   content has changed (specifically, if the marker has been overwritten), it
   proves the kernel is vulnerable to page cache corruption.

### Phase 2: Privilege Escalation Assessment

Even if a kernel is vulnerable, the practical risk depends on whether the
attacker can target sensitive files.

1. **Target Identification**: The agent searches for common `setuid-root`
   binaries (e.g., `/usr/bin/sudo`).
2. **Open for Read**: It attempts to open these binaries for reading (which is
   allowed for unprivileged users).
3. **Pipe Validation**: It verifies if a `splice()` pipeline can be successfully
   established between the `AF_ALG` socket and the sensitive binary.
4. **Safety Guarantee**: The agent **never** calls `recv()` in this phase.
   Without the `recv()` call, the kernel never actually performs the write
   operation to the sensitive file, ensuring the test is 100% safe for
   production environments.

## Integration with Txlog Ecosystem

### Background Execution

The detection logic is integrated into the core `build` flow. Every time the
agent synchronizes transactions, it performs a quick check of the system's
vulnerability status.

### Data Reporting

The results are sent to the Txlog Server as part of the execution metadata:

- `copy_fail`: Boolean indicating if Phase 1 failed (system is vulnerable).
- `copy_fail_escalation`: Boolean indicating if Phase 2 confirmed the escalation
  path.
- `copy_fail_details`: Technical details about which binaries were tested.

## Low-Level Implementation Details

To ensure compatibility across different RHEL-based distributions, the agent
uses raw syscalls via the `golang.org/x/sys/unix` package for:

- `SYS_ACCEPT`: Standard `accept4` flags are sometimes rejected by `AF_ALG`
  sockets.
- `SYS_SETSOCKOPT`: Used to bypass standard library limitations when setting
  `ALG_SET_KEY` and `ALG_SET_AEAD_AUTHSIZE`.
- `SYS_SPLICE`: Direct control over pipe splicing.
