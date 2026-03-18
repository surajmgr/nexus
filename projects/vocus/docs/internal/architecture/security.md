---
sidebar_position: 5
---

# Security

Vocus implements multiple layers of security to protect data and prevent abuse.

## Authentication Security

### JWT Validation

**Algorithm:** HS256 (HMAC with SHA-256)

```typescript
// packages/server/lib/hostJWT.ts

export const verifyHostJwt = async (token: string, secretKey: string) => {
  const key = new TextEncoder().encode(secretKey);

  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"], // Only HS256 allowed
    issuer: process.env.VOCUS_HOST_JWT_ISSUER,
    audience: process.env.VOCUS_HOST_JWT_AUDIENCE,
  });

  return payload;
};
```

**Validation Checks:**

1. Algorithm verification (HS256 only)
2. Signature validation
3. Expiration check (automatic)
4. Issuer check (if configured)
5. Audience check (if configured)

### Best Practices for JWT

**Host Application:**

```typescript
// Recommended: Use strong secret keys
const secretKey = crypto.randomBytes(32);

// Recommended: Set reasonable expiration
.setExpirationTime('24h')

// Recommended: Include issuer and audience
.setIssuer('your-app')
.setAudience('vocus')

// Avoid: Use weak secrets
const secretKey = 'password123';  // BAD!

// Avoid: Use long expiration
.setExpirationTime('365d')  // BAD!

// Avoid: Include sensitive data
{
  sub: userId,
  password: userPassword  // NEVER!
}
```

### Key Generation

Project keys use cryptographically secure random bytes:

```typescript
// packages/server/lib/keys.ts

import { randomBytes } from "node:crypto";

export const generateProjectKeys = (): ProjectKeys => {
  const publicKey = `pk_${randomBytes(16).toString("hex")}`;
  const secretKey = `sk_${randomBytes(32).toString("hex")}`;

  return { publicKey, secretKey };
};
```

**Key Properties:**

- `publicKey`: 32 hex chars + prefix (safe for client)
- `secretKey`: 64 hex chars + prefix (server only)
- Collision resistance: ~2^128 for secret keys

### Key Management

**Storage:**

```bash
# Recommended: Use environment variables
VOCUS_PROJECT_SECRET_KEY="sk_xxx"

# Avoid: Hardcode in source
const secretKey = "sk_xxx";  // BAD!
```

**Rotation:**

```typescript
// Generate new keys
const { publicKey, secretKey } = generateProjectKeys();

// Update project
await projectRepository.update(projectId, {
  secretKey,
  // publicKey stays the same
});

// Notify host applications to update JWT signing
```

## Authorization

### Identity Resolution

Strict identity validation for write operations:

```typescript
// packages/server/domain/identity.ts

export const resolveWriteIdentity = async (input) => {
  // PLATFORM_AUTH: Require session
  if (authMode === AuthMode.PLATFORM_AUTH) {
    if (!session) {
      throw unauthorized("Platform session required");
    }
    return { identity: { kind: "platform", userId: session.user.id } };
  }

  // HOST_SSO: Require valid JWT
  if (authMode === AuthMode.HOST_SSO) {
    if (!token) {
      throw unauthorized("Host SSO token required");
    }
    const externalUser = await upsertExternalUserFromToken({ token });
    if (externalUser.banned) {
      throw forbidden("User is banned");
    }
    return { identity: { kind: "external", externalUserId: externalUser.id } };
  }

  // ... other modes
};
```

### Banned User Check

```typescript
if (externalUser.banned) {
  throw forbidden("User is banned", "USER_BANNED");
}
```

**Moderation Flow:**

1. Admin sets `banned = true` on user
2. Next request throws `USER_BANNED` error
3. Widget displays error message
4. User cannot create threads/comments/votes

## Rate Limiting

### Bucket Algorithm

```typescript
// packages/server/services/rateLimit.ts

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export const checkRateLimit = (key: string, config: RateLimitConfig) => {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    // New window
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1 };
  }

  if (existing.count >= config.max) {
    // Limit exceeded
    return {
      allowed: false,
      remaining: 0,
      retryAfter: existing.resetAt - now,
    };
  }

  // Increment count
  existing.count += 1;
  return { allowed: true, remaining: config.max - existing.count };
};
```

### Default Limits

| Endpoint          | Limit | Window | Key Pattern                             |
| ----------------- | ----- | ------ | --------------------------------------- |
| Thread creation   | 20    | 1 min  | `write:thread:{projectId}:{identity}`   |
| Comment creation  | 40    | 1 min  | `write:comment:{projectId}:{identity}`  |
| Voting            | 60    | 1 min  | `write:vote:{projectId}:{identity}`     |
| Feedback (legacy) | 10    | 1 min  | `write:feedback:{projectId}:{identity}` |

### Rate Limit Key Structure

```typescript
// Identity-based key
const identityKey = `write:thread:${projectId}:${userId}`;
const identityKey = `write:thread:${projectId}:${externalUserId}`;
const identityKey = `write:thread:${projectId}:${browserId}`;
```

**Benefits:**

- Per-user limits (not global)
- Prevents single user abuse
- Allows legitimate high-volume users

### Rate Limit Response

```typescript
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED",
  "retryAfter": 45000  // milliseconds
}
```

## Input Validation

### Zod Schemas

All inputs validated with Zod:

```typescript
// packages/server/hono/routes/embed.ts

const createThreadSchema = z.object({
  projectKey: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  categoryId: z.string().optional(),
  browserId: z.string().optional(),
  userToken: z.string().optional(),
});

const body = await parseJsonBody(c, createThreadSchema);
```

**Validation Rules:**

- Required fields enforced
- String length limits
- Type coercion (where safe)
- Custom validators supported

### Validation Error Response

```typescript
{
  "error": "Invalid request body",
  "code": "INVALID_BODY",
  "details": [
    {
      "field": "title",
      "message": "String must contain at least 1 character(s)"
    }
  ]
}
```

## CORS Security

### Widget CORS

```typescript
// packages/server/hono/routes/embed.ts

widgetRoutes.use(
  "*",
  cors({
    origin: "*", // Note: Restrict in production!
    allowHeaders: ["Content-Type", "Authorization", "X-Browser-Id"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);
```

### Production CORS

```typescript
// Recommended: Restrict to your domains
cors({
  origin: [
    "https://yourapp.com",
    "https://www.yourapp.com",
    "https://app.yourapp.com",
  ],
  credentials: true,
});

// Avoid: Use wildcard in production
cors({
  origin: "*", // BAD for production!
});
```

## Data Protection

### Secret Key Handling

**Server-Side Only:**

```typescript
// Recommended: Use in server environment
const secretKey = process.env.VOCUS_SECRET_KEY;

// Avoid: Expose to client
<script>
  const secretKey = "sk_xxx";  // NEVER!
</script>
```

### Public Key Safety

```typescript
// Recommended: Safe to expose
<script>
  const publicKey = "pk_xxx";  // OK
</script>
```

### Database Security

**Connection String:**

```bash
// Recommended: Use SSL in production
DATABASE_URL="postgresql://user:pass@host:5432/vocus?sslmode=require"

// Recommended: Use strong passwords
DATABASE_URL="postgresql://user:SecureP@ssw0rd!@host:5432/vocus"

// Avoid: Commit to git
# Add .env to .gitignore
```

**Prisma Query Parameterization:**

```typescript
// Recommended: Prisma handles parameterization
const user = await prisma.user.findUnique({
  where: { email: userInput }, // Safe from SQL injection
});

// Avoid: Raw SQL without parameterization
const user = await prisma.$queryRaw`
  SELECT * FROM "user" WHERE email = ${userInput}
`; // SQL injection risk!
```

## Session Security

### Better Auth Sessions

```prisma
model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  userId    String
}
```

**Security Features:**

- Unique token per session
- Expiration tracking
- IP address logging (optional)
- User agent logging (optional)

### Session Validation

```typescript
// packages/server/lib/platformSession.ts

export const getPlatformSession = async (headers: Headers) => {
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw unauthorized("Session required");
  }

  if (session.expiresAt < new Date()) {
    throw unauthorized("Session expired");
  }

  return session;
};
```

## Vote Integrity

### Identity Guard

```typescript
// packages/server/services/forumService.ts

export const toggleVote = async (input) => {
  const voteIdentity =
    input.identity.kind === "platform"
      ? { userId: input.identity.userId, externalUserId: null, browserId: null }
      : {
          userId: null,
          externalUserId: input.identity.externalUserId,
          browserId: input.identity.browserId ?? null,
        };

  // Ensure exactly one identity field
  const identityCount = [
    voteIdentity.userId,
    voteIdentity.externalUserId,
    voteIdentity.browserId,
  ].filter(Boolean).length;

  if (identityCount !== 1) {
    throw badRequest("Vote identity is invalid");
  }

  // ... create vote
};
```

### Database Constraint

```prisma
model Vote {
  // ...
  @@unique([threadId, userId, externalUserId, browserId])
}
```

**Prevents:**

- Multiple votes from same identity
- Vote manipulation
- Duplicate votes

## Error Handling

### Centralized Error Handler

```typescript
// packages/server/hono/middleware/error.ts

export const handleError = (err, c) => {
  if (err instanceof AppError) {
    return c.json(
      {
        error: err.message,
        code: err.code,
      },
      err.status,
    );
  }

  console.error(err); // Log for debugging

  return c.json(
    {
      error: "Internal Server Error",
      code: "INTERNAL_ERROR",
    },
    500,
  );
};
```

### Error Codes

| Code             | HTTP Status | Description             |
| ---------------- | ----------- | ----------------------- |
| `BAD_REQUEST`    | 400         | Invalid input           |
| `UNAUTHORIZED`   | 401         | Authentication required |
| `FORBIDDEN`      | 403         | Access denied           |
| `NOT_FOUND`      | 404         | Resource not found      |
| `CONFLICT`       | 409         | Resource conflict       |
| `RATE_LIMITED`   | 429         | Too many requests       |
| `INTERNAL_ERROR` | 500         | Server error            |

## Logging & Monitoring

### Structured Logging

```typescript
// Example log output
{
  "level": "info",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Thread created",
  "projectId": "proj_xxx",
  "threadId": "thread_yyy",
  "authMode": "HYBRID",
  "identityType": "external"
}
```

### Security Events to Log

1. Failed authentication attempts
2. Rate limit violations
3. Banned user access attempts
4. JWT validation failures
5. Project key generation
6. Moderation actions

### Sensitive Data Redaction

```typescript
// Avoid: Log sensitive data
console.log({ secretKey, token, password });

// Recommended: Redact sensitive fields
console.log({
  projectId: project.id,
  secretKey: "[REDACTED]",
  token: "[REDACTED]",
});
```

## Security Checklist

### Pre-Deployment

- [ ] Set strong `DATABASE_URL` password
- [ ] Configure `VOCUS_HOST_JWT_ISSUER`
- [ ] Configure `VOCUS_HOST_JWT_AUDIENCE`
- [ ] Restrict CORS origins
- [ ] Enable SSL for database
- [ ] Set `NODE_ENV=production`
- [ ] Review rate limit configuration
- [ ] Test authentication flows
- [ ] Verify banned user enforcement

### Ongoing

- [ ] Monitor failed auth attempts
- [ ] Review rate limit violations
- [ ] Audit moderation actions
- [ ] Rotate project secret keys periodically
- [ ] Update dependencies
- [ ] Review error logs
- [ ] Backup database regularly

## Next Steps

- **[API Reference](../api-reference/overview.md)**: Secure API usage
- **[Moderation](../advanced/moderation.md)**: Content moderation
- **[Deployment](../developers/deployment.md)**: Secure deployment
