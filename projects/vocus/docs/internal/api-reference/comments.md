---
sidebar_position: 4
---

# Comments API

Create and retrieve thread comments.

## List Comments

Retrieve all comments for a thread.

**Endpoint:** `GET /api/embed/threads/:threadId`

**Authentication:** Not required

**Response:** (included in thread response)
```json
{
  "thread": { ... },
  "comments": [
    {
      "id": "comment_xxx",
      "content": "Great idea! I'd also like to suggest...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": "user_xxx",
        "type": "external",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

## Create Comment

Add a comment to a thread.

**Endpoint:** `POST /api/embed/comments`

**Authentication:** Required (based on auth mode)

**Request:**
```json
{
  "projectKey": "pk_xxx",
  "threadId": "thread_xxx",
  "content": "Great idea! I'd also like to suggest adding a toggle in the settings."
}
```

**Headers:**
- `Authorization: Bearer <JWT>` (for HOST_SSO)
- `X-Browser-Id: <UUID>` (for ANONYMOUS)
- Cookie with session (for PLATFORM_AUTH)

**Response:**
```json
{
  "comment": {
    "id": "comment_xxx",
    "content": "Great idea! I'd also like to suggest...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": "user_xxx",
      "type": "platform",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

**Rate Limit:** 40 comments per minute per identity

**Author Types:**

Platform user:
```json
{
  "author": {
    "id": "user_xxx",
    "type": "platform",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

External user (SSO):
```json
{
  "author": {
    "id": "ext_xxx",
    "type": "external",
    "name": "John Smith",
    "email": "john@example.com"
  }
}
```

Anonymous user:
```json
{
  "author": {
    "id": "ext_anon",
    "type": "external",
    "name": "Anonymous"
  }
}
```

**Error Responses:**

Thread not found:
```json
{
  "error": "Thread not found",
  "code": "THREAD_NOT_FOUND"
}
```

User banned:
```json
{
  "error": "User is banned",
  "code": "USER_BANNED"
}
```
