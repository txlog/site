# Search Keywords Reference

The search bar in the Assets page supports "magic keywords" that allow for
advanced filtering directly from the text input. These keywords can be typed
manually in the search field.

## Available Keywords

| Keyword | Description |
| :--- | :--- |
| `copyfail:true` | Filters assets vulnerable to **CVE-2026-31431 (Copy Fail)**. |
| `restart:true` | Filters assets that require a system restart. |
| `inactive:true` | Filters assets that have been inactive for more than 15 days. |

## Usage Examples

### Find vulnerable assets

Search for: `copyfail:true`

### Find assets that need restart

Search for: `restart:true`

### Find inactive assets

Search for: `inactive:true`

### Combine keywords with text

Search for: `prod-server copyfail:true`

This will find assets with a hostname containing "prod-server" that are also
vulnerable to CVE-2026-31431.

## Related Documentation

- [How to Search and Filter Assets](../how-to/search-and-filter-assets.md) - Practical
  guide for using search and filters
- [How Search Works](../explanation/how-search-works.md) - Understanding the
  search and filtering mechanism
  