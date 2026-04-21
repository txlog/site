# Deep Dive: Implementing LDAP Authentication

I've spent a lot of time making sure that our LDAP integration is both flexible
and secure. While OIDC is great for many modern setups, we know that many
enterprise environments still rely heavily on LDAP for their core identity
management. Let's walk through how we've implemented this in Txlog Server and
what you need to know to get it running smoothly in your own environment.

## What We've Built

Our goal was to create an LDAP implementation that doesn't just check a box, but
actually provides a robust alternative to OIDC. Here’s what we've included:

- **Standard Authentication**: Direct username and password logins against
    your directory.
- **Group-Based Authorization**: You can define exactly who gets admin or
    viewer access based on their LDAP groups.
- **Dual Mode**: Why choose between OIDC and LDAP? You can enable both and let
    your users decide which way to log in.
- **Service Account Flexibility**: While we support service accounts for
    restricted directories, we've also made it possible to run without one in
    more permissive setups.

## Getting Started with Configuration

Setting this up requires a few environment variables. I've kept the list as
short as possible, but you'll definitely need the essentials:

```bash
LDAP_HOST=ldap.example.com          # Where is your server?
LDAP_BASE_DN=ou=users,dc=example,dc=com  # Where should we start looking for users?
```

You'll also need to define at least one group DN. After all, if we can't verify
a user's permissions, we can't let them in, right?

```bash
LDAP_ADMIN_GROUP=cn=admins,ou=groups,dc=example,dc=com      # Full access
LDAP_VIEWER_GROUP=cn=viewers,ou=groups,dc=example,dc=com    # Read-only access
```

### Optional Fine-Tuning

Depending on your server, you might need to adjust some other settings. We
support TLS/LDAPS out of the box, and you can customize your search filters if
your directory schema is a bit unconventional.

```bash
# Optional but often necessary
LDAP_PORT=636                       # Standard for LDAPS
LDAP_USE_TLS=true                   # Let's keep things encrypted
LDAP_BIND_DN=cn=svc-account,...     # For restricted searches
LDAP_USER_FILTER=(sAMAccountName=%s) # Standard for Active Directory
```

## How We Handle Authorization

We use a straightforward two-tier model. It’s simple, but it covers almost every
use case we’ve encountered.

- **Admin Group**: These users have the keys to the kingdom. They can view
    everything, manage assets, and even create API keys for other services.
- **Viewer Group**: This is for your read-only users. They can see the data
    and statistics but can't change anything.

What if a user is in both? Don't worry—if someone's in the admin group, they get
full privileges regardless of their status in the viewer group.

## Configuration Scenarios

Every LDAP setup is a little different. I've put together a few common scenarios
based on what I've seen in the field.

### Scenario 1: The Simple OpenLDAP Setup

If your directory allows anonymous binds for searching, you can keep things very
simple. We'll search for the user anonymously, authenticate them, and then check
their groups using their own session.

### Scenario 2: Active Directory

AD is a different beast entirely. It almost always requires a service account
just to perform a search. You'll need to provide a `LDAP_BIND_DN` and password,
and you'll likely want to use `(sAMAccountName=%s)` as your user filter.

### Scenario 3: Running Both OIDC and LDAP

This is one of my favorite features. By enabling both, you give your team total
flexibility. Users will see a login page that offers both a standard
username/password form and a "Login with OIDC" button. It’s perfect for
transitional periods or for supporting both internal and external teams.

## Security Considerations

I can't emphasize this enough: **always use TLS in production**. Whether you use
port 636 for LDAPS or enable STARTTLS on 389, keeping those credentials
encrypted is non-negotiable.

Also, if you're using a service account, please follow the principle of least
privilege. That account only needs to read user and group objects—nothing else.
We never store user passwords in our database; they're only held in memory long
enough to perform the bind against your server.

## Troubleshooting Pitfalls

Even with the best planning, things can go wrong. If you're running into issues,
here's where I usually start looking:

1. **"User not found"**: Is your `LDAP_BASE_DN` correct? Does your
    `LDAP_USER_FILTER` actually match your schema?
2. **"Not a member of any group"**: This is often due to a mismatch between
    your `LDAP_GROUP_FILTER` and how your groups are structured (e.g., `member`
    vs `memberUid`).
3. **Connection Failures**: Double-check your host and port. If you're using
    Docker, make sure the container actually has a route to your LDAP server.

If you're really stuck, try using `ldapsearch` from the same network. It's the
most reliable way to verify what the server is actually seeing.

## Final Thoughts on Management

Remember that users are created in our local database the first time they log
in. We sync their email and display name directly from your directory, and we
re-evaluate their admin status every single time they sign in. This ensures that
if you remove someone from a group in LDAP, their access to Txlog Server is
revoked immediately.
