# Guide: Configuring LDAP Authentication

Setting up LDAP can sometimes feel like a daunting task, but I've designed our
configuration process to be as straightforward as possible. Whether you're
connecting to Active Directory or a standard OpenLDAP server, the goal is to get
your team authenticated and authorized with minimal friction. Let's walk through
how you can get this running in just a few minutes.

## Prerequisites

Before we get into the variables, you'll need a few things handy. Do you have
access to your LDAP server? You'll also likely need:

- **A Service Account**: This is your Bind DN and Password. You'll need this if
  your server requires authentication just to perform a search.
- **Group DNs**: You'll need the specific Distinguished Names for the groups you
  want to map to our Admin and Viewer roles.

## Configuration Steps

I've kept the configuration centered around your environment variables. It’s the
most reliable way to manage these settings across different deployments.

### 1. Open Your Environment File

First, crack open your `.env` file. This is where we'll define all the
connection details.

### 2. Set the Connection Variables

You'll need to tell the server exactly where to find your directory and how to
talk to it.

```bash
# Connection details
LDAP_HOST=ldap.example.com
LDAP_PORT=389 # Use 636 if you're going with LDAPS
LDAP_USE_TLS=false # Flip this to true for LDAPS
```

If your server requires authentication for searches, you'll also need to provide
your service account credentials:

```bash
LDAP_BIND_DN=cn=admin,dc=example,dc=com
LDAP_BIND_PASSWORD=your_secret_password
```

> [!IMPORTANT] I should mention a quick note on security: if you're using TLS,
> we take certificate verification very seriously. We don't allow skipping
> verification because, honestly, why would you want to leave your credentials
> exposed? Ensure your server's certificate is valid and trusted by your host.

### 3. Define Your Search and Group Logic

Now we need to tell the server where to look for users and how to decide what
they're allowed to do.

```bash
# Where should we start the search?
LDAP_BASE_DN=ou=users,dc=example,dc=com

# How do we find a user by their username?
LDAP_USER_FILTER=(uid=%s) 
# Note: For Active Directory, you'll usually want (sAMAccountName=%s)
```

Finally, map your LDAP groups to our internal roles. You need to provide at
least one of these:

```bash
LDAP_ADMIN_GROUP=cn=txlog-admins,ou=groups,dc=example,dc=com
LDAP_VIEWER_GROUP=cn=txlog-viewers,ou=groups,dc=example,dc=com

# And how do we check if a user is in those groups?
LDAP_GROUP_FILTER=(member=%s)
```

### 4. Restart the Server

Once you've saved your changes, give the server a quick restart to pick up the
new configuration.

## Troubleshooting Pitfalls

If things don't work on the first try, don't worry. Most issues I've seen come
down to a few common causes:

- **"Invalid Credentials"**: Double-check your `LDAP_BIND_DN` and password. Even
  a small typo can break the whole flow.
- **"Not Authorized"**: If a user is found but can't log in, they might not be
  in the groups you've defined. Check that your `LDAP_GROUP_FILTER` matches your
  directory's schema (e.g., `member` vs `memberUid`).

## Moving Further

Need more detail on specific filters or Active Directory quirks? I've put
together a few other guides that dive deeper into those topics:

- [LDAP Authentication Deep Dive](../explanation/ldap-deep-dive.md)
- [Service Account FAQ](../explanation/ldap-service-account-faq.md)
