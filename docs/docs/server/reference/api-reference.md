# Reference: API Overview

If you're looking to integrate your own tools with Txlog Server or just want to
explore what’s possible under the hood, you’re in the right place. I’ve designed
the API to be consistent and easy to work with. While this document gives you a
high-level overview of how things are structured, I highly recommend checking
out our interactive Swagger UI at `/swagger/index.html`. It’s the best way to
see exactly what’s available and even test out some calls in real-time. Ready to
see what you can build?

## Base URL

Every request you make should start with the `/v1` prefix. It’s a standard way
for me to version the API and ensure that as we grow, your existing integrations
won't suddenly break.

## Authentication

Security is a top priority, so if you’ve enabled OIDC or LDAP on your server,
you’ll need to include your API key in the `X-API-Key` header for every request.
If you're still in local development mode without authentication configured, you
can skip this for now—but why not test with security enabled from the start?
It's always better to catch permission issues early.

## Error Responses

I've chosen to use generic error messages for the API to prevent leaking any
sensitive internal details about the system to the outside world. If something
goes wrong, you'll likely see a standard response like these:

- **500 Internal Server Error**: A catch-all for unexpected failures.
- **500 Database error**: Specifically for when the server can't talk to the
    database or a query fails.

Don't worry, though; the detailed error logs are always available on the server
for troubleshooting. Have you checked your logs lately? They’re usually the
first place I look when a request doesn't go as planned.
