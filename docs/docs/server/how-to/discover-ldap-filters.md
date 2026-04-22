# Guide: Discovering LDAP Filters for Your Environment

One of the most common hurdles I've seen when setting up LDAP is figuring out
exactly which filters to use. Every directory is a little different, and what
works for OpenLDAP might not work for Active Directory. I've put together this
guide to help you explore your own directory structure and find the precise
values you need for `LDAP_USER_FILTER` and `LDAP_GROUP_FILTER`. Ready to get
your hands dirty with some discovery?

## Getting the Right Tools

Before we start querying your server, you'll need a way to talk to it. I usually
reach for `ldapsearch` on the command line—it's fast, direct, and available on
almost every system.

### On Linux or Mac

You can get the standard utilities with a quick install:

```bash
# Debian/Ubuntu
sudo apt-get install ldap-utils

# Red Hat/CentOS/AlmaLinux
sudo yum install openldap-clients

# Mac
brew install openldap
```

### On Windows

If you prefer a GUI, **Apache Directory Studio** is my top recommendation. It’s
a powerful tool for visual explorers. If you're on a Windows Server, you likely
already have **ldp.exe** installed and ready to go.

---

## Step 1: Connecting to Your Server

First things first: can we even talk to the server? Let's run a quick connection
test to verify your host, port, and credentials.

### Using the Command Line

Try a basic search for all objects at the root. It’s the fastest way to confirm
your bind credentials are correct.

```bash
# Basic connection (no TLS)
ldapsearch -H ldap://your-ldap-server.com:389 \
  -x -b "dc=example,dc=com" \
  -D "cn=admin,dc=example,dc=com" \
  -W "(objectClass=*)" dn
```

If you're using LDAPS (which you should be in production!), just swap the
protocol and port:

```bash
ldapsearch -H ldaps://your-ldap-server.com:636 \
  -x -b "dc=example,dc=com" \
  -D "cn=admin,dc=example,dc=com" \
  -W "(objectClass=*)" dn
```

### Using a GUI

If you're using Apache Directory Studio, just create a new connection, plug in
your hostname and port, and use **Simple Authentication** with your Bind DN and
password. Use the "Check Network Parameter" button—it’s a lifesaver for catching
connection issues early.

---

## Step 2: Mapping Out the Structure

Now that we're in, we need to find where everything lives. Is your directory
organized by `ou=users` or `ou=people`? A quick search for organizational units
will reveal the layout.

```bash
ldapsearch -H ldap://your-ldap-server.com:389 \
  -x -b "dc=example,dc=com" \
  -D "cn=admin,dc=example,dc=com" \
  -W -LLL "(objectClass=organizationalUnit)" dn
```

I usually look for a structure that looks something like this:

```text
dc=example,dc=com
├── ou=users          ← This is likely where your team lives
└── ou=groups         ← And this is where their permissions are defined
```

---

## Step 3: Finding Your Users

This is a crucial step. We need to identify the specific attribute that should
be used for logins. Is it `uid`, `sAMAccountName`, or maybe an email address?

### Let's look at a real user record

```bash
ldapsearch -H ldap://your-ldap-server.com:389 \
  -x -b "dc=example,dc=com" \
  -D "cn=admin,dc=example,dc=com" \
  -W -LLL "(uid=john.doe)"
```

When you look at the output, what do you see?

- **OpenLDAP/FreeIPA**: You'll likely see `uid: john.doe`.
- **Active Directory**: You'll see `sAMAccountName: john.doe`.

Whatever attribute holds the username your team expects to type into the login
form is the one we'll use for your filter.

---

## Step 4: Exploring Your Groups

Next, we need to understand how your groups track membership. Why does this
matter? Because we need to know if we're looking for a full user DN or just a
simple username.

### Search for a specific group

```bash
ldapsearch -H ldap://your-ldap-server.com:389 \
  -x -b "dc=example,dc=com" \
  -D "cn=admin,dc=example,dc=com" \
  -W -LLL "(cn=admins)"
```

Take a close look at the membership attributes:

- **`member`**: Usually contains the user's full DN (Common in AD and standard
    OpenLDAP).
- **`uniqueMember`**: Similar to `member`, used in `groupOfUniqueNames`.
- **`memberUid`**: Usually contains just the username, not the full DN (Common
    in `posixGroup`).

---

## Step 5: Putting the Filters Together

Now that we've seen the data, we can define our filters. Remember, the `%s` in
these strings is a placeholder that Txlog Server will fill in automatically.

### `LDAP_USER_FILTER`

| If your login attribute is... | Use this filter |
| :--- | :--- |
| `uid` | `(uid=%s)` |
| `sAMAccountName` | `(sAMAccountName=%s)` |
| `mail` | `(mail=%s)` |

### `LDAP_GROUP_FILTER`

| If your member attribute is... | Use this filter |
| :--- | :--- |
| `member` | `(member=%s)` |
| `uniqueMember` | `(uniqueMember=%s)` |
| `memberUid` | `(memberUid=%s)` |

---

## Practical Examples I've Encountered

I've seen many different setups in the field. Here are the three most common
ones you're likely to run into.

### Standard OpenLDAP

```bash
LDAP_USER_FILTER=(uid=%s)
LDAP_GROUP_FILTER=(member=%s)
```

### Active Directory

```bash
LDAP_USER_FILTER=(sAMAccountName=%s)
LDAP_GROUP_FILTER=(member=%s)
```

### Linux-style `posixGroup`

```bash
LDAP_USER_FILTER=(uid=%s)
LDAP_GROUP_FILTER=(memberUid=%s)
```

---

## Final Verification

Before you commit these to your configuration, why not test them one last time?

- **Testing the user filter**: Replace `%s` with a real username in an
    `ldapsearch` call. Does it return exactly one user? Perfect.
- **Testing the group filter**: Replace `%s` with a user's full DN. Does it
    return the group? You're good to go.

If things aren't working as expected, the most common culprit is a small typo in
the `LDAP_BASE_DN` or a slight mismatch in the filter syntax.
