# Guide: Running Tests

I've always believed that a solid codebase is built on a foundation of rigorous
testing. For Txlog Server, I've put together a comprehensive test suite that
covers everything from our core models to full integration scenarios. Whether
you're contributing code or just want to verify your local setup, knowing how to
run these tests is essential. Ready to see if everything is working as it
should?

## Running the Suite

If you want to run every test in the project, it’s just a single command. It’s
the best way to ensure no regressions have crept in across the entire codebase.

```bash
go test ./...
```

### Focusing on Specific Areas

Sometimes you're only working on a specific part of the system—maybe you've just
tweaked a database model. In those cases, there's no need to wait for the entire
suite. You can target a specific package or even a single test function to get
faster feedback.

```bash
# Run only the model tests
go test ./models -v

# Run a specific test function
go test ./models -v -run TestAssetManager_UpsertAsset
```

## Setting Up Your Test Database

Most of our tests require a real PostgreSQL database to run against. By default,
they’re looking for a database named `txlog_test` on your local machine.

1. **Create the Database**: You can use the standard Postgres tools to get this
    ready.

    ```bash
    createdb txlog_test
    ```

2. **Connection Details**: We use a standard connection string (`host=localhost
    port=5432 user=postgres password=postgres dbname=txlog_test
    sslmode=disable`). If your local setup is different—maybe you’re using a
    different port or user—you’ll need to adjust the `setupTestDB` helper in the
    test files to match your environment.

## Integration Tests

In the `tests/` directory, I've included scenarios that simulate full,
end-to-end user workflows. These are a bit slower than our unit tests because
they exercise the entire system, but they’re invaluable for catching those
subtle bugs that only appear when different components start talking to each
other.

```bash
go test ./tests -v
```

Once you've got your tests passing, you can be much more confident that your
changes haven't introduced any unintended side effects. Have you had a chance to
look at our full [testing strategy](../explanation/testing-strategy.md) yet?
It’s a great way to understand the "why" behind the way we've structured our
suite.
