# txlog.rda.run

This repository contains Cloudflare Workers functions to dynamically fetch and
display the latest version badges for the Txlog Agent and Server components on
the [txlog.rda.run](https://txlog.rda.run) website.

## Setup Instructions

### 0. Install dependencies

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
npm add -D vitepress@next
```

### 1. Create GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "txlog-version-badge"
4. Select expiration (recommend 1 year)
5. **No scopes needed** - leave all checkboxes unchecked (we only need public repo access)
6. Click "Generate token"
7. Copy the token immediately (it won't be shown again)

### 2. Configure Environment Variable for Cloudflare Pages/Workers

```bash
# Set environment variable in Cloudflare dashboard
GITHUB_TOKEN=ghp_your_token_here
```

### 3. Optional: KV Cache Setup

For even better performance, you can set up a KV store:

1. Create a KV namespace called "txlog-cache"
2. Bind it to the `CACHE` environment variable in your Pages settings

## Fallback Behavior

Even without the token, the functions now have improved fallback behavior:

- Returns hardcoded versions when API fails (v1.6.3 for agent, v1.12.1 for server)
- Implements client-side caching with Cache-Control headers
- Graceful degradation instead of error messages

## Current Hardcoded Fallback Versions

- Agent: `v1.6.3`
- Server: `v1.12.1`

Update these in the functions if newer versions are released and the API is still failing.

## Run dev server locally

```bash
npx vitepress dev docs
```
