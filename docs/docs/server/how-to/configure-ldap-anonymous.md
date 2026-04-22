# Practical Guide: LDAP Configuration Without a Service Account

I've often found that the simplest way to get LDAP up and running is to skip the
service account entirely. While it's not the right choice for every environment,
it's a great way to reduce complexity if your directory allows it. Let's look at
how you can pull this off and whether it's the right fit for your setup.

## When Should You Use This?

In my experience, going **WITHOUT a service account** is a solid option when:

- ✅ Your LDAP server allows anonymous binds for initial user searches.
- ✅ Authenticated users have the permission to read their own group
    memberships.
- ✅ You're using a standard OpenLDAP setup with default configurations.
- ✅ You just want a leaner configuration with fewer credentials to manage.

## When Should You Avoid It?

Sometimes, you just can't get around needing a service account. You'll likely
need one if:

- ❌ You're dealing with Active Directory (it almost always requires
    authentication for searches).
- ❌ Your LDAP has strict ACLs that block anonymous binds.
- ❌ You're in a high-security production environment with rigid policies.
- ❌ Your LDAP server doesn't allow users to see their own groups by default.

## Examples to Get You Started

### Minimal OpenLDAP Setup

If you're looking for the absolute minimum, this is it. Only four variables!
It's clean, direct, and avoids any unnecessary overhead.

```bash
LDAP_HOST=ldap.mycompany.com
LDAP_BASE_DN=ou=users,dc=mycompany,dc=com
LDAP_ADMIN_GROUP=cn=admins,ou=groups,dc=mycompany,dc=com
LDAP_VIEWER_GROUP=cn=viewers,ou=groups,dc=mycompany,dc=com
```

### Adding a Layer of Security with TLS

Even without a service account, you shouldn't skip encryption. I always
recommend using TLS if your server supports it.

```bash
LDAP_HOST=ldap.mycompany.com
LDAP_PORT=636
LDAP_USE_TLS=true
LDAP_BASE_DN=ou=people,dc=mycompany,dc=com
LDAP_USER_FILTER=(uid=%s)
LDAP_ADMIN_GROUP=cn=txlog-admins,ou=groups,dc=mycompany,dc=com
LDAP_VIEWER_GROUP=cn=txlog-users,ou=groups,dc=company,dc=com
```

## Testing Before You Deploy

Before you commit to this approach, I'd suggest running a couple of quick tests.
It’s better to find out now if your directory will play along, right?

### Test 1: Can we search anonymously?

Try to find a user without providing any credentials:

```bash
ldapsearch -H ldap://ldap.mycompany.com:389 \
  -x \
  -b "ou=users,dc=mycompany,dc=com" \
  "(uid=myuser)"
```

If this returns the user record, you're halfway there! If you get an
"Insufficient access" error, you'll definitely need that service account.

### Test 2: Can a user read their own groups?

Now, let's see if the user can actually see the group they're supposed to be in:

```bash
ldapsearch -H ldap://ldap.mycompany.com:389 \
  -D "uid=myuser,ou=users,dc=mycompany,dc=com" \
  -w "mypassword" \
  -b "cn=admins,ou=groups,dc=mycompany,dc=com" \
  "(member=uid=myuser,ou=users,dc=mycompany,dc=com)"
```

If you see the group in the output, you're all set.

## Weighing the Pros and Cons

I like to think of the choice between using a service account or not as a
trade-off between simplicity and robustness.

### The Lean Approach (No Service Account)

- **Pros**: It’s much faster to set up and there are fewer moving parts to
    break. You don't have to worry about rotated service account passwords or
    creating extra objects in your directory.
- **Cons**: It’s less flexible. It won't work with Active Directory and might
    hit a wall if your security team decides to tighten up anonymous access.

### The Robust Approach (With Service Account)

- **Pros**: This is the "industry standard" for a reason. It works with almost
    every directory, including AD, and gives you much more granular control over
    what the application can see.
- **Cons**: It’s more work. You've got more environment variables to track and
    a whole extra set of credentials to secure.

## Understanding the Authentication Flow

I've mapped out how the server actually handles the login process in both
scenarios. Seeing it side-by-side usually makes the difference much clearer.

### Without a Service Account

1. A user sends their credentials.
2. The server connects to LDAP anonymously.
3. It searches for the user's DN.
4. Once found, it tries to "bind" (log in) using the user's actual password.
5. If that works, it uses that same session to check the user's groups.
6. The user is logged in!

### With a Service Account

1. A user sends their credentials.
2. The server connects and binds using the **service account** first.
3. It uses that account to find the user's DN.
4. It then attempts a separate bind with the user's credentials to verify the
    password.
5. Finally, it goes back to the service account to verify the user's group
    memberships.
6. The user is logged in!

## Common Pitfalls and Solutions

Even with a simple setup, things can go wrong. If you're running into "User not
found" errors, my first step is always to verify anonymous search with
`ldapsearch`. If that fails, your directory is likely locked down more than you
thought, and it's time to bring in a service account.

If you can find the user but group membership checks fail, it usually means the
user doesn't have the right permissions to see the group objects. You can either
fix the ACLs on your LDAP server or, again, switch to using a service account
that already has those permissions.
