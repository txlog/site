# Guide: Configuring OIDC Authentication

OpenID Connect (OIDC) is my favorite way to handle authentication. It’s secure,
modern, and saves everyone the headache of managing yet another set of
passwords. Whether you're using Google, Keycloak, or Okta, the process of
integrating your Identity Provider (IdP) with Txlog Server is fairly
straightforward. Let's walk through the steps to get you up and running.

## Prerequisites

Before we start editing files, you'll need a few pieces of information from your
IdP. Have you already created your client and retrieved your **Client ID** and
**Client Secret**?

You'll also need to make sure your **Redirect URL**—the place where the IdP
sends users back after they've logged in—is correctly registered in your
provider's console. For local development, this is usually
`http://localhost:8080/auth/callback`, but in production, you'll obviously want
to use your actual domain.

## Configuration Steps

Most of the work happens in your `.env` file. I've kept the required variables
to a minimum to reduce the chance of errors.

### 1. Open Your Environment File

Pop open your `.env` file or wherever you manage your environment variables.

### 2. Set the OIDC Variables

Just drop in the details you gathered from your IdP:

```bash
# The base URL of your Identity Provider
OIDC_ISSUER_URL=https://accounts.google.com

# Your Client ID and Secret
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret

# The callback URL (this must exactly match what you registered)
OIDC_REDIRECT_URL=http://localhost:8080/auth/callback
```

> [!IMPORTANT] I should remind you that we take security seriously: we always
> verify the TLS certificate of your issuer. If your provider's certificate
> isn't valid or trusted, we won't allow the connection. We don't support
> "skip-verify" modes because, let's be honest, why would you want to compromise
> your users' security?

### 3. Restart the Server

Give the server a quick restart to pick up the new settings.

### 4. Verify the Flow

Head over to your login page (usually `/login`). If everything is set up
correctly, you'll see a "Login with OIDC" button. Give it a click—does it take
you to your provider's login screen? Once you authenticate there, you should be
redirected back and logged into Txlog Server automatically.

## Troubleshooting Pitfalls

If you run into issues, don't panic. The most common culprit is a tiny mismatch
in the issuer URL or the redirect URI.

- **"Issuer URL mismatch"**: Double-check that your `OIDC_ISSUER_URL` exactly
    matches the `issuer` field in your IdP's discovery document (usually found
    at `/.well-known/openid-configuration`).
- **"Redirect URI mismatch"**: This is a classic. Even a missing trailing
    slash or a difference between `http` and `https` will cause the flow to
    fail. Ensure the value in your `.env` is an exact match for what's in your
    IdP's settings.
