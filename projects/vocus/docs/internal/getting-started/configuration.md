---
sidebar_position: 4
---

# Configuration

Configure Vocus to match your application's needs.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/vocus` |
| `NEXT_PUBLIC_APP_URL` | Public URL of your Vocus instance | `https://feedback.yourapp.com` |

### Authentication Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VOCUS_HOST_JWT_ISSUER` | Expected JWT issuer | - | No* |
| `VOCUS_HOST_JWT_AUDIENCE` | Expected JWT audience | - | No* |

*Required for HOST_SSO and HYBRID auth modes in production.

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `LOG_LEVEL` | Logging verbosity | `info` |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `true` |

## Project Configuration

### Auth Modes

Configure authentication per project when creating it:

#### HOST_SSO Mode

Best for applications with existing user authentication.

```json
{
  "authMode": "HOST_SSO",
  "allowAnonymous": false
}
```

**Requirements:**
- Host application must sign JWTs with the project's `secretKey`
- JWT must include user identification (sub, id, or externalId)

#### PLATFORM_AUTH Mode

Use Vocus's built-in authentication system.

```json
{
  "authMode": "PLATFORM_AUTH",
  "allowAnonymous": false
}
```

**Requirements:**
- Users must log in through Vocus
- Session management handled by Vocus

#### HYBRID Mode

Accept both platform and host authentication (recommended).

```json
{
  "authMode": "HYBRID",
  "allowAnonymous": true
}
```

**Behavior:**
- Prefers platform session if both present
- Falls back to host JWT
- Allows anonymous if enabled

#### ANONYMOUS Mode

Allow feedback without authentication.

```json
{
  "authMode": "ANONYMOUS",
  "allowAnonymous": true
}
```

**Requirements:**
- Browser ID required for write operations
- Limited functionality compared to authenticated modes

### Anonymous Access

Control whether anonymous users can participate:

```json
{
  "allowAnonymous": true
}
```

When enabled:
- Users are tracked by browser ID
- Browser ID stored in localStorage
- Fallback to random ID if localStorage unavailable

## Widget Configuration

### Basic Configuration

```javascript
window.VocusWidget?.init({
  publicKey: "pk_your_project_key",
  container: "#vocus-widget",
  apiBase: "https://vocus.yourapp.com",
  userToken: "optional_jwt_token"
});
```

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `publicKey` | string | Yes | Project public key |
| `container` | string | Yes | CSS selector for widget container |
| `apiBase` | string | No | API base URL (default: "") |
| `userToken` | string | No | Host JWT for SSO |

### Advanced Widget Options

```javascript
window.VocusWidget?.init({
  publicKey: "pk_your_key",
  container: "#widget",
  apiBase: "https://vocus.example.com",
  userToken: jwtToken,
  // Custom configuration
  theme: {
    primaryColor: "#2563eb",
    fontFamily: "Inter, sans-serif"
  },
  features: {
    voting: true,
    comments: true,
    categories: true
  }
});
```

## Rate Limiting

Configure rate limits per endpoint type:

### Default Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Thread creation | 20 | 1 minute |
| Comment creation | 40 | 1 minute |
| Voting | 60 | 1 minute |
| Feedback (legacy) | 10 | 1 minute |

### Customize Rate Limits

Modify in `packages/server/services/rateLimit.ts`:

```typescript
enforceRateLimit(`write:thread:${projectId}:${identityKey}`, {
  windowMs: 60_000,  // 1 minute
  max: 20,           // 20 requests per window
});
```

## CORS Configuration

Configure cross-origin requests for the widget:

```typescript
// In embed routes
cors({
  origin: "*",  // Restrict in production
  allowHeaders: ["Content-Type", "Authorization", "X-Browser-Id"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
})
```

### Production CORS Settings

```typescript
cors({
  origin: ["https://yourapp.com", "https://www.yourapp.com"],
  allowHeaders: ["Content-Type", "Authorization", "X-Browser-Id"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  credentials: true,
})
```

## Database Configuration

### Connection Pooling

For production, configure connection pooling:

```bash
DATABASE_URL="postgresql://user:pass@host:5432/vocus?connection_limit=10&pool_timeout=30"
```

### SSL Configuration

```bash
DATABASE_URL="postgresql://user:pass@host:5432/vocus?sslmode=require"
```

## Logging Configuration

### Log Levels

```bash
LOG_LEVEL="debug"  # debug, info, warn, error
```

### Structured Logging

Vocus uses structured logging for better observability:

```json
{
  "level": "info",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Thread created",
  "projectId": "proj_123",
  "threadId": "thread_456",
  "authMode": "HYBRID"
}
```

## Security Best Practices

### 1. Secret Key Management

- Never expose `secretKey` to clients
- Rotate keys periodically
- Use environment variables for key storage

### 2. JWT Configuration

Always configure issuer and audience in production:

```bash
VOCUS_HOST_JWT_ISSUER="your-app-name"
VOCUS_HOST_JWT_AUDIENCE="vocus-feedback"
```

### 3. Rate Limiting

Enable rate limiting to prevent abuse:

```typescript
// Always enforce rate limits
enforceRateLimit(key, config);
```

### 4. CORS Restrictions

Restrict CORS to your domains in production:

```typescript
origin: ["https://yourapp.com"]
```

## Next Steps

- **[Architecture](../architecture/overview.md)**: System design
- **[SSO Integration](../widgets/sso-integration.md)**: Set up authentication
- **[API Reference](../api-reference/overview.md)**: Full API documentation
