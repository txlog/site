# Guide: Deploying to Kubernetes

Kubernetes is the go-to for scaling modern applications, and Txlog Server is
designed to fit right into your cluster. I've put together a standard manifest
to help you get up and running with a highly available setup. Ready to see those
pods spinning up? Let's get to it.

## Prerequisites

Before we start applying manifests, make sure your cluster is ready. Do you have
`kubectl` configured and a PostgreSQL database that's reachable from within your
namespace? Having those squared away first will save you a lot of debugging
later.

## Deployment Manifest

I've combined the Deployment and Service definitions into a single file to keep
things simple. Save this as `txlog-server.yaml`. You'll notice I've set it to
run two replicas—because who wants a single point of failure?—and included a
liveness probe to ensure the server stays healthy.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: txlog-server
spec:
  replicas: 2
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
        image: ghcr.io/txlog/server:main
        ports:
        - containerPort: 8080
        env:
        - name: INSTANCE
          value: "Production Cluster"
        - name: LOG_LEVEL
          value: "INFO"
        - name: PGSQL_HOST
          value: "postgres-service"
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
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 15
---
apiVersion: v1
kind: Service
metadata:
  name: txlog-server
spec:
  selector:
    app: txlog-server
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP
```

## Steps to Deploy

Now for the fun part. It only takes two commands to get the server running.

### 1. Create Your Secrets

I always recommend using Kubernetes Secrets for sensitive data like database
passwords. Keeping them out of your manifest files is just common sense, isn't
it?

```bash
kubectl create secret generic txlog-secrets --from-literal=db-password='your_actual_password'
```

### 2. Apply the Manifest

Once your secrets are in place, just tell Kubernetes to create the resources:

```bash
kubectl apply -f txlog-server.yaml
```

### 3. Verify the Deployment

Give it a few seconds and then check to see if your pods are running:

```bash
kubectl get pods -l app=txlog-server
```

## Exposing Your Service

To access the server from outside the cluster, you'll typically want to use an
Ingress. I've put together a sample resource that you can adapt for your own
domain.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: txlog-ingress
spec:
  rules:
  - host: txlog.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: txlog-server
            port:
              number: 80
```

Once you've applied this, you should be able to reach your Txlog Server at your
specified host. If you're using a specific Ingress controller like Nginx or
Traefik, you might need to add a few annotations, but this basic setup should
get you moving.
