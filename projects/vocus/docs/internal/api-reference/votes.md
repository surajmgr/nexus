---
sidebar_position: 5
---

# Votes API

Vote on threads (upvote/downvote toggle).

## Toggle Vote

Vote or remove vote on a thread.

**Endpoint:** `POST /api/embed/votes`

**Authentication:** Required (based on auth mode)

**Request:**
```json
{
  "projectKey": "pk_xxx",
  "threadId": "thread_xxx"
}
```

**Headers:**
- `Authorization: Bearer <JWT>` (for HOST_SSO)
- `X-Browser-Id: <UUID>` (for ANONYMOUS)
- Cookie with session (for PLATFORM_AUTH)

**Response - Vote Created:**
```json
{
  "voted": true
}
```

**Response - Vote Removed:**
```json
{
  "voted": false
}
```

**Behavior:**
- If user hasn't voted: Creates vote, returns `voted: true`
- If user has voted: Removes vote, returns `voted: false`
- Toggle behavior allows users to undo votes

**Rate Limit:** 60 votes per minute per identity

**Vote Identity:**

The vote is associated with exactly one identity type:

Platform user:
```typescript
{
  userId: "user_xxx",
  externalUserId: null,
  browserId: null
}
```

External user (SSO):
```typescript
{
  userId: null,
  externalUserId: "ext_xxx",
  browserId: null
}
```

Anonymous user:
```typescript
{
  userId: null,
  externalUserId: null,
  browserId: "550e8400-e29b-41d4-a716-446655440000"
}
```

**Database Constraint:**

Unique constraint ensures one vote per identity per thread:
```prisma
@@unique([threadId, userId, externalUserId, browserId])
```

**Error Responses:**

Thread not found:
```json
{
  "error": "Thread not found",
  "code": "THREAD_NOT_FOUND"
}
```

Invalid identity:
```json
{
  "error": "Vote identity is invalid",
  "code": "VOTE_IDENTITY_INVALID"
}
```

User banned:
```json
{
  "error": "User is banned",
  "code": "USER_BANNED"
}
```

## Vote Counting

Get vote count for a thread:

**Endpoint:** `GET /api/embed/threads/:threadId`

Vote count included in thread response:
```json
{
  "thread": {
    "id": "thread_xxx",
    "votesCount": 15,
    ...
  }
}
```

**Note:** Individual votes are not exposed via API, only the count.
