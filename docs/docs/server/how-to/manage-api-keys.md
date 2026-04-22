# Guide: Managing API Keys

When you have agents out in the field pushing data to your server, you need a
way to make sure they're authorized to do so. That’s where API keys come in.
I've designed our API key system to be both secure and easy to manage, giving
you full control over which agents can talk to your instance. Let's look at how
you can create, revoke, and delete these keys to keep your environment secure.

## Prerequisites

Before we get started, there are a couple of things you should know:

- **Admin Access**: You'll need to be logged in as an Admin (via OIDC or LDAP)
    to access the API key management tools.
- **Auth Requirement**: If you haven't enabled authentication on your server,
    your agents won't actually need a key to push data. However, I strongly
    recommend enabling auth for any setup that isn't just for local testing.

## Creating a New API Key

Creating a key only takes a few seconds. I’ve kept the process lean so you can
get your agents connected and moving quickly.

1. Log in to your Txlog Server and head over to the **Admin Panel**.
2. Find the **API Keys** section.
3. Give your new key a descriptive name.
4. Click **Create API Key**.
5. **IMPORTANT**: A modal will pop up showing your full API Key. **Copy this key
    immediately and store it somewhere safe.** We don't store the plain-text key
    in our database for security reasons, which means we can't show it to you
    ever again. If you lose it, you'll have to create a new one.

## Revoking a Key

Sometimes you need to stop a key from working but don't necessarily want to
erase its history. That's where revoking comes in handy. It’s a soft disable
that keeps the record in the database for auditing purposes.

1. Navigate to the **Admin Panel**.
2. Find the key you want to disable in the list.
3. Click the **Revoke** button.
4. The status will flip to `Inactive`. Any agent trying to use this key will
    immediately start receiving `401 Unauthorized` errors.

## Deleting a Key Permanently

If you're sure you don't need a key anymore and don't care about keeping a
record of it, you can delete it permanently.

1. In the **Admin Panel**, locate the key.
2. Click the **Delete** button.
3. Confirm the action when prompted. Remember, there's no undo button here.

## Configuring Your Agent with the Key

Now that you've got your key, you just need to tell your Txlog Agent to use it.
The easiest way to do this is by setting the `TXLOG_API_KEY` environment
variable on the host where the agent is running. Once that's set, your data
should start flowing into the server immediately.
