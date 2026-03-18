---
sidebar_position: 2
---

# Rate Limiting

Vocus includes built-in rate limiting to prevent abuse.

## How It Works

Rate limiting uses a bucket algorithm:

```typescript
type Bucket = {
  count: number;      // Requests in current window
  resetAt: number;    // Window reset timestamp
};
```

## Default Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Thread creation | 20 | 1 minute |
| Comment creation | 40 | 1 minute |
| Voting | 60 | 1 minute |
| Feedback (legacy) | 10 | 1 minute |

## Configuration

Rate limits are keyed by project and identity:

```typescript
const key = `write:thread:${projectId}:${userId}`;
const key = `write:thread:${projectId}:${externalUserId}`;
const key = `write:thread:${projectId}:${browserId}`;
```

## Customizing Limits

Modify in `packages/server/services/rateLimit.ts`:

```typescript
enforceRateLimit(`write:thread:${projectId}:${identityKey}`, {
  windowMs: 60_000,  // 1 minute
  max: 20,           // 20 requests
});
```

## Rate Limit Response

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED",
  "retryAfter": 45000
}
```

## Best Practices

1. **Monitor limits** - Track rate limit hits
2. **Adjust for your needs** - Higher limits for trusted users
3. **Communicate limits** - Show users when they're limited
