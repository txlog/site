# Configure MCP with SSE Transport

This guide shows how to run the MCP server with Server-Sent Events (SSE)
transport for web clients and remote access.

## When to Use SSE

Use SSE transport when:

- You need remote access to the MCP server
- You're integrating with web-based AI clients
- You want to expose the server on a specific port

## Start in SSE Mode

Run the MCP server with SSE transport:

```bash
txlog mcp serve --transport sse --port 3000
```

The server will listen on the specified port for SSE connections.

## Custom Configuration Path

If your configuration file is not in the default location:

```bash
txlog mcp serve --transport sse --port 3000 --config /path/to/txlog.yaml
```

## Running as a Service

To run the MCP server as a systemd service, create
`/etc/systemd/system/txlog-mcp.service`:

```ini
[Unit]
Description=Txlog MCP Server
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/txlog mcp serve --transport sse --port 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable txlog-mcp
sudo systemctl start txlog-mcp
```

## Security Considerations

When exposing the MCP server over the network:

1. **Use a reverse proxy** (nginx, HAProxy) with TLS termination
2. **Restrict access** using firewall rules
3. **Consider authentication** at the proxy level

Example nginx configuration:

```nginx
server {
    listen 443 ssl;
    server_name mcp.example.com;

    ssl_certificate /etc/ssl/certs/mcp.crt;
    ssl_certificate_key /etc/ssl/private/mcp.key;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache off;
    }
}
```

## Verify Connection

Test the SSE endpoint with curl:

```bash
curl -N http://localhost:3000/sse
```

You should see the SSE connection established.

## Troubleshooting

- **Port already in use**: Change the port with `--port`
- **Connection refused**: Check firewall settings
- **Authentication errors**: Verify `txlog.yaml` credentials
