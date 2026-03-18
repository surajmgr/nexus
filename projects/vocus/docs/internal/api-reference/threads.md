---
sidebar_position: 3
---

# Threads API

Create and retrieve feedback threads.

## List Threads

Retrieve all threads for a project.

**Endpoint:** `GET /api/embed/threads`

**Authentication:** Not required

**Query Parameters:**
- `projectKey` (required): Project public key
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)
- `status` (optional): Filter by status
- `categoryId` (optional): Filter by category

**Example:**
```bash
GET /api/embed/threads?projectKey=pk_xxx&page=1&limit=20
```

**Response:**
```json
{
  "threads": [
    {
      "id": "thread_xxx",
      "title": "Add dark mode",
      "description": "It would be great to have a dark mode option...",
      "status": "OPENED",
      "votesCount": 15,
      "commentsCount": 3,
      "author": {
        "id": "user_xxx",
        "type": "platform",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Get Thread

Retrieve a single thread with comments.

**Endpoint:** `GET /api/embed/threads/:threadId`

**Authentication:** Not required

**Query Parameters:**
- `projectKey` (required): Project public key

**Response:**
```json
{
  "thread": {
    "id": "thread_xxx",
    "title": "Add dark mode",
    "description": "It would be great to have a dark mode option...",
    "status": "OPENED",
    "votesCount": 15,
    "commentsCount": 3,
    "author": {
      "id": "user_xxx",
      "type": "platform",
      "name": "Jane Doe"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "comments": [
    {
      "id": "comment_xxx",
      "content": "Great idea! +1",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": "user_yyy",
        "type": "external",
        "name": "John Smith"
      }
    }
  ]
}
```

## Create Thread

Create a new thread.

**Endpoint:** `POST /api/embed/threads`

**Authentication:** Required (based on auth mode)

**Request:**
```json
{
  "projectKey": "pk_xxx",
  "title": "Feature Request: Dark Mode",
  "description": "It would be great to have a dark mode option for the application. This would help reduce eye strain...",
  "categoryId": "cat_xxx"
}
```

**Headers:**
- `Authorization: Bearer <JWT>` (for HOST_SSO)
- `X-Browser-Id: <UUID>` (for ANONYMOUS)
- Cookie with session (for PLATFORM_AUTH)

**Response:**
```json
{
  "thread": {
    "id": "thread_xxx",
    "title": "Feature Request: Dark Mode",
    "description": "It would be great to have a dark mode option...",
    "status": "OPENED",
    "votesCount": 0,
    "commentsCount": 0,
    "author": {
      "id": "user_xxx",
      "type": "platform",
      "name": "Jane Doe"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Rate Limit:** 20 threads per minute per identity

**Error Responses:**

Missing authentication:
```json
{
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

Rate limited:
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED"
}
```
