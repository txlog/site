# How to Search and Filter Assets

This guide explains how to use the search and filtering capabilities in the
Txlog Server dashboard to quickly locate specific assets and identify vulnerable
or inactive systems.

## Overview

The Assets page provides a central search bar and quick filters to help you
manage large fleets of servers. You can search by hostname, machine ID, or use
special keywords to find systems based on their status.

## Finding Specific Assets

### Basic Search

1. Navigate to the **Assets** page from the main dashboard.
2. In the search bar at the top, type the **hostname** or **Machine ID** of the
   asset you're looking for.
3. Press **Enter** or click the search icon.

### Using Quick Filters

You can use the toggle icons next to the search bar for immediate filtering:

- **Needs Restart** (Golden Icon): Shows only assets that require a reboot after
  updates.
- **Inactive** (Coral Icon): Shows only assets that haven't synchronized data in
  the last 15 days.

### Using Search Keywords

You can also use "magic keywords" directly in the search bar for advanced
filtering. For example, to find assets vulnerable to CVE-2026-31431, type
`copyfail:true` in the search field.

See the [Search Keywords Reference](../reference/search-keywords.md) for a complete
list of available keywords and how to use them.

> [!TIP] You can combine text with keywords. For example, searching `prod-server
> copyfail:true` will find production servers that are vulnerable.

## Related Documentation

- [Search Keywords Reference](../reference/search-keywords.md) - Complete list of
  available search keywords
- [How Search Works](../explanation/how-search-works.md) - Understanding the
  search and filtering mechanism