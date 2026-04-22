# Reference: LDAP Filters

LDAP filters can look like a mess of parentheses and attributes when you first
see them, can’t they? Don’t worry, they’re actually quite logical once you break
them down. I’ve written this guide to help you find the exact strings you need
to plug into your `.env` file so authentication just works. Ready to find your
filters?

## Discovering Your Filters

How do I find these filters? Well, I’ve actually written a script to make this
whole process a lot easier for you. If you’re not in the mood for manual
searching, just run the discovery script and follow the prompts.

### Method 1: The Easy Way (Recommended)

Just run my automatic script and it'll guide you through the process
step-by-step.

```bash
./ldap-discovery.sh
```

### Method 2: The Manual Way

If you prefer to get your hands dirty with the command line, `ldapsearch` is
your best friend. Here are the commands I use to identify user and group
attributes.

**1. Find your users:**

```bash
ldapsearch -H ldap://your-server:389 -x -D "cn=admin,dc=example,dc=com" -W -b "dc=example,dc=com" "(uid=username)"
```

**2. View specific user attributes:**

```bash
ldapsearch -H ldap://your-server:389 -x -D "cn=admin,dc=example,dc=com" -W -b "dc=example,dc=com" "(uid=john)" dn uid cn sAMAccountName
```

**3. View your groups:**

```bash
ldapsearch -H ldap://your-server:389 -x -D "cn=admin,dc=example,dc=com" -W -b "dc=example,dc=com" "(cn=admins)" dn member uniqueMember memberUid
```

---

## Common Filters by Server Type

Different servers use different attribute names. Do you know which one you're
running? Here are the defaults I usually start with.

### OpenLDAP (Standard)

```bash
LDAP_USER_FILTER=(uid=%s)
LDAP_GROUP_FILTER=(member=%s)
```

### Active Directory

```bash
LDAP_USER_FILTER=(sAMAccountName=%s)
LDAP_GROUP_FILTER=(member=%s)
```

### OpenLDAP with posixGroup

```bash
LDAP_USER_FILTER=(uid=%s)
LDAP_GROUP_FILTER=(memberUid=%s)
```

*Note: `posixGroup` is a bit special because it uses only the `uid` (like
`john`) instead of the full DN. I've handled this in the code, so it should work
out of the box.*

---

## Quick Reference Tables

### User Filters

| System | Attribute | Filter |
| --- | --- | --- |
| OpenLDAP | `uid` | `(uid=%s)` |
| Active Directory | `sAMAccountName` | `(sAMAccountName=%s)` |
| AD (email login) | `userPrincipalName` | `(userPrincipalName=%s)` |
| FreeIPA | `uid` | `(uid=%s)` |
| Legacy Systems | `cn` | `(cn=%s)` |
| Email login | `mail` | `(mail=%s)` |

### Group Filters

| ObjectClass | Member Attribute | Filter | Expected Value |
| --- | --- | --- | --- |
| `groupOfNames` | `member` | `(member=%s)` | Full DN |
| `groupOfUniqueNames` | `uniqueMember` | `(uniqueMember=%s)` | Full DN |
| `posixGroup` | `memberUid` | `(memberUid=%s)` | uid only |
| `group` (AD) | `member` | `(member=%s)` | Full DN |

---

## How Do I Know Which One to Use?

If you're not sure, don't guess! I'll show you how to find out exactly what your
server expects.

### Step 1: Identify the User Login Attribute

Search for a person in your directory and look for the field that contains their
login name. In OpenLDAP, it’s usually `uid`. In Active Directory, it’s almost
always `sAMAccountName`.

### Step 2: Identify the Group Member Attribute

Search for a group and see how the members are listed. Does it show their full
DN (like `uid=john,ou=users...`) or just their username? If it’s the full DN,
use `(member=%s)`. If it’s just the username, you’re likely looking at a
`posixGroup` and should use `(memberUid=%s)`.

---

## Testing Before You Commit

I always recommend testing your filters manually before plugging them into the
server. It saves so much time in the long run.

### Test 1: Can I find the user?

Run this and make sure it returns exactly one user. If it returns nothing, your
filter or your base DN is probably wrong.

```bash
ldapsearch -x -D "cn=admin,dc=example,dc=com" -W -b "dc=example,dc=com" "(uid=john.doe)"
```

### Test 2: Is the user in the group?

Replace the group and user DNs with your own. If the command returns the group
object, then your filter is working perfectly.

```bash
ldapsearch -x -D "cn=admin,dc=example,dc=com" -W \
  -b "cn=admins,ou=groups,dc=example,dc=com" \
  -s base \
  "(member=uid=john.doe,ou=users,dc=example,dc=com)"
```

## Wrapping Up

The most important thing is to match the attribute name in your filter with what
your server actually uses. Once you've got that down, you're golden. If you’re
still feeling stuck, just use the `ldap-discovery.sh` script I mentioned
earlier. It’s saved me more times than I can count!

```bash
chmod +x ldap-discovery.sh
./ldap-discovery.sh
```
