# Implementation Summary: LDAP Authentication

I'm pleased to share that we've successfully integrated LDAP authentication into
the Txlog Server. This update allows us to support standard username and
password logins alongside our existing OIDC system, providing a lot more
flexibility for different infrastructure needs. Want to know how we approached
it? Let's walk through the details.

## Core Changes and New Additions

To keep the codebase clean, I decided to isolate the LDAP logic into a few
specific areas.

First, we've got a new service in `auth/ldap.go`. This file is where the real
work happens. It handles everything from establishing secure
connections—supporting both plain LDAP and LDAPS—to performing the "bind"
operations needed for authentication. It also manages group membership checks
and ensures that user profiles are correctly synchronized with our local
database. Since we wanted to avoid hardcoding any environment-specific details,
I've made sure that every aspect is configurable through environment variables.

I've also put together a dedicated guide in `LDAP_AUTHENTICATION.md`. Why go
through the trouble? Well, LDAP configuration can be notoriously finicky. This
document includes setup examples for various servers, a troubleshooting guide
for common pitfalls, and the security best practices we've followed to keep
things tight.

## Modifications to Existing Logic

We couldn't just add new code; we had to adapt our existing controllers and
middleware to recognize this new authentication path.

In `controllers/auth_controller.go`, I've updated the `GetLogin()` handler so it
can dynamically detect which authentication methods are enabled. It then serves
a login page that shows only the relevant options. I also added a specific
handler for LDAP login requests and ensured that our logout logic gracefully
handles sessions from both OIDC and LDAP providers.

Our `middleware/auth.go` also needed an update. Both the standard authentication
and admin middlewares now check for valid sessions across both systems.
Interestingly, if neither OIDC nor LDAP is configured, the system simply
bypasses authentication altogether. This makes local development and initial
setup much easier, wouldn't you agree?

Finally, I've updated `main.go` to initialize the LDAP service and register the
necessary routes. We've also included some clear startup logs so you'll know
exactly which authentication modes are active the moment the server starts.

## How the Authentication Flow Works

The process is designed to be as seamless as possible for the end-user. Here’s
what happens behind the scenes:

1. The user submits their credentials via the login form.
2. The server connects to the configured LDAP host.
3. If a service account is provided, we bind with those credentials first to
    locate the user's distinguished name (DN).
4. Once found, we attempt to bind directly as that user using the password they
    provided. If the LDAP server accepts the bind, we know the credentials are
    valid.
5. Next, we verify if the user belongs to the required "Admin" or "Viewer"
    groups. If they don't have the right permissions, the login is rejected.
    After all, what good is authentication without proper authorization?
6. If everything checks out, we update the user record in our database,
    establish a session, and redirect them to the dashboard.

## Configuration and Compatibility

I’ve ensured that the implementation is highly configurable. You have full
control over the host, port, base DN, and search filters. We also support TLS
for encrypted communication and provide options to skip certificate verification
if you're working in a development environment with self-signed certificates.

One of the best parts about this implementation is its compatibility. We’re
using the same underlying session management and database schema for both OIDC
and LDAP users. To prevent any identity conflicts, LDAP users are stored with a
unique `ldap:` prefix in their identifier. This means you can run both systems
side-by-side without any issues.

## Current Limitations

While this implementation is robust, there are a couple of things to keep in
mind. For now, we only support direct group membership—nested groups aren't
supported yet. We're also letting the LDAP server handle things like password
complexity and account lockouts rather than managing them within the
application. Finally, since LDAP doesn't typically provide profile images, those
users will simply have a default avatar in the UI.

I've put this through its paces with several test cases, and it’s looking solid.
Do you have any questions about how this might fit into your specific
deployment, or is there a particular part of the code you'd like to dive into?
