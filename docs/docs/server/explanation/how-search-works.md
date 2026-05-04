# How Search Works

This document explains the internal logic and mechanisms behind the search and
filtering system in the Txlog Server dashboard.

## Matching Logic

When you enter a search term, the server processes it through a multi-stage
pipeline:

### 1. Keyword Interception

The server first checks if the query contains any special keywords (like
`copyfail:true`, `restart:true`, or `inactive:true`). If found, it applies the
specific database filter for that keyword.

### 2. Text Matching

If no keywords are present (or for the remaining text after keyword extraction),
the server performs text matching:

- **Hostname**: Case-insensitive partial match
- **Machine ID**: Exact match

This means that searching for "prod" will match hostnames like "prod-server-01"
and "production-db", but will only match the exact Machine ID if you search for
the full identifier.

## Visual Status Indicators

Assets in the list display colored badges on their OS icon to indicate their
state:

### Badge Types

- **Coral Pulse**: Critical vulnerability detected (**CVE-2026-31431**)
- **Golden Pulse**: System restart required

### Precedence Rules

If an asset has multiple conditions that would trigger different badges, the
system follows a priority order:

1. **Coral (Vulnerability)** badge - Highest priority
2. **Golden (Restart)** badge - Lower priority

This means that if an asset is both vulnerable to CVE-2026-31431 and needs a
restart, only the Coral badge is shown, as vulnerabilities require higher
priority attention.

## Related Documentation

- [How to Search and Filter Assets](../how-to/search-and-filter-assets.md) - Practical
  guide for using search and filters
- [Search Keywords Reference](../reference/search-keywords.md) - Complete list of
  available search keywords