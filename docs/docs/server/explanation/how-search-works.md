# How Search Works

This document explains the internal logic and mechanisms behind the search and
filtering system in the Txlog Server dashboard.

## Matching Logic

When you enter a search term, the server processes it through a multi-stage
pipeline:

### 1. Keyword Interception

The server first checks if the query contains any special keywords (like
`restart:true` or `inactive:true`). If found, it applies the specific database
filter for that keyword.

### 2. Text Matching

If no keywords are present (or for the remaining text after keyword extraction),
the server performs text matching:

- **Hostname**: Case-insensitive partial match
- **Machine ID**: Exact match

This means that searching for "prod" will match hostnames like "prod-server-01"
and "production-db", but will only match the exact Machine ID if you search for
the full identifier.

## Visual Status Indicators

Assets in the list display a colored badge on their OS icon to indicate their
state:

- **Golden Pulse**: System restart required

## Related Documentation

- [How to Search and Filter Assets](../how-to/search-and-filter-assets.md) - Practical
  guide for using search and filters
- [Search Keywords Reference](../reference/search-keywords.md) - Complete list of
  available search keywords