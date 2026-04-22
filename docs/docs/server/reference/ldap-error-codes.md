# Reference: LDAP Error Codes

Dealing with LDAP errors can sometimes feel like shouting into a void and only
getting a number back in return. I’ve put together this troubleshooting guide to
help you translate those cryptic result codes into actionable solutions. Whether
you're seeing a "No Such Object" error or a "Invalid Credentials" warning, I’ve
got the steps to help you find exactly what’s wrong. Let's decode these errors
together.

## Result Code 32: No Such Object

This is easily the most common error you’ll run into. It simply means I’m
looking for something—a user, a group, or even the base directory—that the LDAP
server says doesn’t exist. It’s like trying to find a file in a folder that
isn't there. Usually, it’s just a small typo in your `.env` file.

### Where is it happening?

I've found that this error typically crops up in one of four places:

#### 1. Your Base DN is slightly off

If `LDAP_BASE_DN` points to an OU that doesn't exist, the whole search fails
before it even starts.

```bash
# ❌ WRONG
LDAP_BASE_DN=ou=users,dc=example,dc=com

# ✅ CORRECT
LDAP_BASE_DN=dc=example,dc=com
```

**How do I verify this?** Try running a base search with `ldapsearch`. If it
returns error 32, you know the base path is the culprit.

```bash
ldapsearch -H ldap://server:389 -x -D "cn=admin,dc=example,dc=com" -W \
  -b "dc=example,dc=com" -s base "(objectClass=*)"
```

#### 2. The Bind DN (Service Account) is missing

If you’re using a service account and I can't find its DN, you’ll see this error
immediately during the bind phase.

#### 3. One of your Groups is incorrect

Are your `LDAP_ADMIN_GROUP` or `LDAP_VIEWER_GROUP` strings exactly right? Even a
single missing comma will cause the server to report that the object doesn't
exist.

#### 4. The user is outside the Base DN

Sometimes the user exists, but they’re in an OU that isn't covered by your
`LDAP_BASE_DN`. I can't find what I'm not allowed to see!

---

## How to Diagnose the Issue

When things go sideways, here is the process I follow to get the server back on
track.

### Step 1: Turn on the lights

First, I set my `LOG_LEVEL` to `DEBUG` in the `.env` file. This lets me see
exactly which DN I’m trying to access when the error occurs. Have you checked
your logs lately? They’re usually the best place to start.

### Step 2: Identify the broken DN

Look at the logs and match the error message to your configuration:

- If it fails during "LDAP user search," check your `LDAP_BASE_DN`.
- If it fails during "Binding with service account," check your `LDAP_BIND_DN`.
- If it fails during "group membership check," check your group DNs.

### Step 3: Verify manually

I always keep a template for `ldapsearch` handy. It’s the fastest way to verify
if a DN actually exists without restarting the server every time.

```bash
ldapsearch -H ldap://SERVER:PORT \
  -x -D "BIND_DN" -W \
  -b "SUSPICIOUS_DN" -s base "(objectClass=*)"
```

---

## Other Common Result Codes

While Code 32 is the usual suspect, you might run into these other characters
from time to time.

### Code 34: Invalid DN Syntax

This means the format of your DN is broken. Did you forget a comma or include an
extra space where it shouldn't be?

### Code 49: Invalid Credentials

The username or password is wrong. This could be for the user trying to log in,
or it could be the service account credentials in your `.env`. I always check if
the service account has expired if I’m sure the password is correct.

### Code 50: Insufficient Access Rights

I found the object, but the account I’m using doesn't have permission to read
it. Make sure your service account has at least read access to the users and
groups you’ve configured.

### Code 52: Unavailable

The LDAP server is down or I can't reach it over the network. Is there a
firewall blocking port 389 or 636? A quick `telnet` test can usually confirm
this.

---

## Summary Table

| Code | Name | What it means | My first fix |
| --- | --- | --- | --- |
| 32 | No Such Object | DN does not exist | Check the DNs in your `.env`. |
| 34 | Invalid DN Syntax | Format is broken | Check for missing commas. |
| 49 | Invalid Credentials | Wrong password | Check service account credentials. |
| 50 | Insufficient Access | No permission | Adjust your LDAP ACLs. |
| 52 | Unavailable | Server is down | Check network and firewall. |
