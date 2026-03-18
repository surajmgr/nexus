---
sidebar_position: 1
---

# API Reference Overview

Vocus provides a RESTful API for all operations. This reference covers all endpoints, authentication, and error handling.

## Base URL

```
Production: https://vocus.yourdomain.com/api
Development: http://localhost:3000/api
```

## API Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/embed/*` | GET, POST | Public embed API for widgets |
| `/widget/*` | GET, POST | Legacy widget API |
| `/admin/*` | GET, POST | Admin operations |
| `/auth/*` | GET, POST | Authentication endpoints |

## Authentication

### Public Endpoints

No authentication required:
- `GET /embed/project/:publicKey`
- `GET /embed/threads`
- `GET /embed/threads/:threadId`

### Protected Endpoints

Require authentication based on project's auth mode:
- `POST /embed/threads`
- `POST /embed/comments`
- `POST /embed/votes`

**Authentication Methods:**

1. **Platform Session** (Cookie)
```bash
curl -X POST https://vocus.example.com/api/embed/threads \
  -H "Content-Type: application/json" \
  -b "session_token=xxx" \
  -d '{"projectKey": "pk_xxx", "title": "Test", "description": "Desc"}'
```

2. **Host JWT** (Bearer Token)
```bash
curl -X POST https://vocus.example.com/api/embed/threads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"projectKey": "pk_xxx", "title": "Test", "description": "Desc"}'
```

3. **Browser ID** (Header)
```bash
curl -X POST https://vocus.example.com/api/embed/threads \
  -H "Content-Type: application/json" \
  -H "X-Browser-Id: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{"projectKey": "pk_xxx", "title": "Test", "description": "Desc"}'
```

## Common Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes (POST) | `application/json` |
| `Authorization` | Sometimes | `Bearer <JWT>` for Host SSO |
| `X-Browser-Id` | Sometimes | Browser ID for anonymous |
| `Cookie` | Sometimes | Platform session cookie |

## Response Format

### Success Response

```json
{
  "thread": {
    "id": "thread_xxx",
    "title": "Feature Request",
    "description": "I'd like to suggest...",
    "status": "OPENED",
    "votesCount": 5,
    "commentsCount": 2,
    "author": {
      "id": "user_xxx",
      "type": "platform",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "error": "Project not found",
  "code": "PROJECT_NOT_FOUND"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid input |
| `INVALID_BODY` | 400 | Invalid JSON body |
| `INVALID_QUERY` | 400 | Invalid query parameters |
| `UNAUTHORIZED` | 401 | Authentication required |
| `PLATFORM_AUTH_REQUIRED` | 401 | Platform session required |
| `HOST_TOKEN_REQUIRED` | 401 | Host JWT required |
| `FORBIDDEN` | 403 | Access denied |
| `USER_BANNED` | 403 | User is banned |
| `RATE_LIMITED` | 429 | Too many requests |
| `NOT_FOUND` | 404 | Resource not found |
| `PROJECT_NOT_FOUND` | 404 | Project not found |
| `THREAD_NOT_FOUND` | 404 | Thread not found |
| `CATEGORY_NOT_FOUND` | 404 | Category not found |
| `CONFLICT` | 409 | Resource conflict |
| `INTERNAL_ERROR` | 500 | Server error |

## Pagination

List endpoints support pagination:

```bash
GET /api/embed/threads?projectKey=pk_xxx&page=1&limit=20
```

**Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 50)

**Response:**
```json
{
  "threads": [
    { "id": "thread_1", ... },
    { "id": "thread_2", ... }
  ]
}
```

## Rate Limiting

All write endpoints are rate-limited:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Thread creation | 20 | 1 minute |
| Comment creation | 40 | 1 minute |
| Voting | 60 | 1 minute |

**Rate Limit Response:**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED"
}
```

## CORS

All embed endpoints support CORS for cross-origin widget requests:

```typescript
{
  "origin": "*",
  "allowHeaders": ["Content-Type", "Authorization", "X-Browser-Id"],
  "allowMethods": ["GET", "POST", "OPTIONS"],
  "exposeHeaders": ["Content-Length"],
  "maxAge": 600,
  "credentials": true
}
```

## Next Steps

- **[Projects API](./projects.md)**: Project management
- **[Threads API](./threads.md)**: Thread operations
- **[Comments API](./comments.md)**: Comment operations
- **[Votes API](./votes.md)**: Voting system
- **[Errors](./errors.md)**: Error handling
