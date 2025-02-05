# Txlog Server

Txlog Server is a robust transaction log management system designed to handle
and process business transactions in a reliable and efficient manner. It serves
as a centralized platform for recording, monitoring, and managing transaction
logs across different services and applications. The server is particularly
useful in distributed systems where maintaining a consistent and accurate record
of transactions is crucial for data integrity and system reliability.

The primary purpose of Txlog Server is to provide a dependable mechanism for
tracking transaction states, ensuring data consistency, and facilitating error
recovery in case of system failures. It acts as a single source of truth for
transaction history, making it an essential component for businesses that
require precise transaction tracking and audit capabilities.

## System Requirements

Before running Txlog Server, ensure you have access to a PostgreSQL database
server that will store the transaction logs and related data. You need to
initialize the database with the following structure:

```sql
CREATE TABLE "transactions" (
  "transaction_id" INTEGER,
  "machine_id" TEXT,
  "hostname" TEXT,
  "begin_time" TIMESTAMP WITH TIME ZONE,
  "end_time" TIMESTAMP WITH TIME ZONE,
  "actions" TEXT,
  "altered" TEXT,
  "user" TEXT,
  "return_code" TEXT,
  "release_version" TEXT,
  "command_line" TEXT,
  "comment" TEXT,
  "scriptlet_output" TEXT,
  PRIMARY KEY ("transaction_id", "machine_id")
);

CREATE TABLE "transaction_items" (
  "item_id" SERIAL PRIMARY KEY,
  "transaction_id" INTEGER,
  "machine_id" TEXT,
  "action" TEXT,
  "package" TEXT,
  "version" TEXT,
  "release" TEXT,
  "epoch" TEXT,
  "arch" TEXT,
  "repo" TEXT,
  "from_repo" TEXT
);

ALTER TABLE "transaction_items" ADD FOREIGN KEY ("transaction_id", "machine_id") REFERENCES "transactions" ("transaction_id", "machine_id");
```

## Installation

The Txlog server can be easily deployed using Docker or using kuberentes. First, pull the container image from the GitHub Container Registry:



::: code-group

```bash [Docker]
docker run -d -p 8080:8080 \
  -e GIN_MODE=release \
  -e PGSQL_HOST=postgres.example.com \
  -e PGSQL_PORT=5432 \
  -e PGSQL_USER=txlog \
  -e PGSQL_DB=txlog \
  -e PGSQL_PASSWORD=your_db_password \
  -e PGSQL_SSLMODE=require \
  ghcr.rda.run/txlog/server:v0.1
```

```yaml [Kubernetes]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: txlog-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: txlog-server
  template:
    metadata:
      labels:
        app: txlog-server
    spec:
      containers:
      - name: txlog-server
        image: ghcr.rda.run/txlog/server:v0.1
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /v1/health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /v1/health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        env:
        - name: GIN_MODE
          value: "release"
        - name: PGSQL_HOST
          value: "postgres.example.com"
        - name: PGSQL_PORT
          value: "5432"
        - name: PGSQL_USER
          value: "txlog"
        - name: PGSQL_DB
          value: "txlog"
        - name: PGSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: txlog-secrets
              key: db-password
        - name: PGSQL_SSLMODE
          value: "require"
```

:::

If you want to use the latest development (unstable) version, replace the
version number `v0.1` with `main` in the Docker commands and Kubernetes
configuration.
