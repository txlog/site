# Reference: LDAP Cheatsheet

Setting up LDAP can sometimes feel like you’re trying to solve a puzzle with
missing pieces. I’ve put together this quick reference to help you get the
authentication flow working as quickly as possible. Whether you're using a
standard OpenLDAP setup or a restricted Active Directory environment, you’ll
find the configuration snippets you need right here. Ready to connect your
directory?

## Minimal Configuration WITHOUT Service Account

If your LDAP server allows anonymous searches, you can keep things incredibly
simple. This is common in many OpenLDAP environments.

```bash
# Simplest setup - works if LDAP allows anonymous search
LDAP_HOST=ldap.example.com
LDAP_BASE_DN=ou=users,dc=example,dc=com
LDAP_ADMIN_GROUP=cn=admins,ou=groups,dc=example,dc=com
LDAP_VIEWER_GROUP=cn=viewers,ou=groups,dc=example,dc=com
```

## Minimal Configuration WITH Service Account

For more restricted environments—like Active Directory—you’ll usually need a
service account to perform the initial user search.

```bash
# For restricted LDAP servers (like Active Directory)
LDAP_HOST=ldap.example.com
LDAP_BASE_DN=ou=users,dc=example,dc=com
LDAP_BIND_DN=cn=readonly,dc=example,dc=com
LDAP_BIND_PASSWORD=your_password
LDAP_ADMIN_GROUP=cn=admins,ou=groups,dc=example,dc=com
LDAP_VIEWER_GROUP=cn=viewers,ou=groups,dc=example,dc=com
```

## Common Server Snippets

Not all LDAP servers are created equal. Do you know which flavor you're running?

### Active Directory

```bash
LDAP_USER_FILTER=(sAMAccountName=%s)
LDAP_GROUP_FILTER=(member=%s)
```

### OpenLDAP (standard)

```bash
LDAP_USER_FILTER=(uid=%s)
LDAP_GROUP_FILTER=(member=%s)
```

### OpenLDAP (posixGroup)

```bash
LDAP_USER_FILTER=(uid=%s)
LDAP_GROUP_FILTER=(memberUid=%s)
```

## Variable Reference

Here’s a quick breakdown of all the variables you can use to fine-tune your
connection.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `LDAP_HOST` | Yes | - | Your LDAP server's hostname or IP. |
| `LDAP_PORT` | No | 389/636 | The port to connect to. |
| `LDAP_USE_TLS` | No | false | Should we use an encrypted connection? |
| `LDAP_SKIP_TLS_VERIFY` | No | false | Only use this for testing with self-signed certs! |
| `LDAP_BIND_DN` | No | - | The DN for your service account. |
| `LDAP_BIND_PASSWORD` | No | - | The service account's password. |
| `LDAP_BASE_DN` | Yes | - | Where should I start searching for users? |
| `LDAP_USER_FILTER` | No | (uid=%s) | The filter I'll use to find the user. |
| `LDAP_ADMIN_GROUP` | Yes* | - | The group DN for administrators. |
| `LDAP_VIEWER_GROUP` | Yes* | - | The group DN for read-only viewers. |
| `LDAP_GROUP_FILTER` | No | (member=%s) | How should I check for group membership? |

*\* You’ve got to provide at least one of these two groups.*

### A Note on Service Accounts

You don't *always* need `LDAP_BIND_DN` and `LDAP_BIND_PASSWORD`. If you leave
them out:

- I'll use an anonymous bind to search for users.
- I'll use the user’s own authenticated session to check their group membership.
- This works great for OpenLDAP, but Active Directory almost always insists on a
  service account.

## User Roles & Permissions

What can your users actually do once they're logged in?

### Admins

- View all data across the entire system.
- Manage assets, packages, and users.
- Access the full admin panel and create API keys.

### Viewers

- Browse transaction data, assets, and insights.
- **No access** to the admin panel or any destructive actions.

## Quick Troubleshooting

Something not working? Don't worry, it happens to the best of us. Let's run
through these common checks:

1. **Connection Refused?** Double-check your `LDAP_HOST` and `LDAP_PORT`. Is
   there a firewall in the way?
2. **User Not Found?** Your `LDAP_BASE_DN` or `LDAP_USER_FILTER` might be
   slightly off.
3. **Invalid Credentials?** It’s worth double-checking the password—we’ve all
   been there.
4. **Not Authorized?** Make sure the user is actually a member of the groups
   you’ve defined.
5. **Group Checks Failing?** Your service account might not have the permissions
   it needs to read the group objects.

### Testing with `ldapsearch`

If you’re stuck, try running this from your terminal to see what the LDAP server
is returning:

```bash
ldapsearch -H ldap://ldap.example.com:389 \
  -D "cn=admin,dc=example,dc=com" \
  -w "password" \
  -b "ou=users,dc=example,dc=com" \
  "(uid=testuser)"
```

## How the Flow Works

I've designed the authentication flow to be as robust as possible. Here’s what
happens under the hood when someone tries to log in.

### Without a Service Account

1. You enter your username and password.
2. I connect to the LDAP server and search for your DN using an anonymous bind.
3. Once I find you, I attempt to bind to the server using *your* credentials.
4. If that works, I use your session to check if you're in the required groups.
5. Finally, I create your session and let you into the dashboard.

### With a Service Account

1. You enter your username and password.
2. I connect and bind immediately using the service account.
3. I find your user DN and then verify your password with a second bind.
4. I switch back to the service account to perform the group membership checks.
5. If everything clears, you're in!
