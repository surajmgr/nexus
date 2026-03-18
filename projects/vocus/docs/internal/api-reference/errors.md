---
sidebar_position: 6
---

# Error Handling

All API errors follow a consistent format.

## Error Response Format

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

## HTTP Status Codes

| Status | Meaning               | Common Codes                                                               |
| ------ | --------------------- | -------------------------------------------------------------------------- |
| 400    | Bad Request           | `BAD_REQUEST`, `INVALID_BODY`, `INVALID_QUERY`                             |
| 401    | Unauthorized          | `UNAUTHORIZED`, `PLATFORM_AUTH_REQUIRED`, `HOST_TOKEN_REQUIRED`            |
| 403    | Forbidden             | `FORBIDDEN`, `USER_BANNED`, `RATE_LIMITED`, `ANON_DISABLED`                |
| 404    | Not Found             | `NOT_FOUND`, `PROJECT_NOT_FOUND`, `THREAD_NOT_FOUND`, `CATEGORY_NOT_FOUND` |
| 409    | Conflict              | `CONFLICT`, `PROJECT_SLUG_CONFLICT`, `KEY_GENERATION_FAILED`               |
| 429    | Too Many Requests     | `RATE_LIMITED`                                                             |
| 500    | Internal Server Error | `INTERNAL_ERROR`                                                           |

## Error Codes Reference

### Authentication Errors

**UNAUTHORIZED** (401)

```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

**PLATFORM_AUTH_REQUIRED** (401)

```json
{
  "error": "Platform session required",
  "code": "PLATFORM_AUTH_REQUIRED"
}
```

**HOST_TOKEN_REQUIRED** (401)

```json
{
  "error": "Host SSO token required",
  "code": "HOST_TOKEN_REQUIRED"
}
```

**MISSING_TOKEN** (401)

```json
{
  "error": "Missing user token",
  "code": "MISSING_TOKEN"
}
```

**INVALID_TOKEN** (400)

```json
{
  "error": "Invalid user token",
  "code": "INVALID_TOKEN"
}
```

### Validation Errors

**BAD_REQUEST** (400)

```json
{
  "error": "Invalid request body",
  "code": "BAD_REQUEST"
}
```

**INVALID_BODY** (400)

```json
{
  "error": "Invalid request body",
  "code": "INVALID_BODY"
}
```

**INVALID_QUERY** (400)

```json
{
  "error": "Invalid query parameters",
  "code": "INVALID_QUERY"
}
```

**VOTE_IDENTITY_INVALID** (400)

```json
{
  "error": "Vote identity is invalid",
  "code": "VOTE_IDENTITY_INVALID"
}
```

**TOKEN_MISSING_SUBJECT** (400)

```json
{
  "error": "Token is missing subject",
  "code": "TOKEN_MISSING_SUBJECT"
}
```

**BROWSER_ID_REQUIRED** (400)

```json
{
  "error": "browserId is required for anonymous writes",
  "code": "BROWSER_ID_REQUIRED"
}
```

### Authorization Errors

**FORBIDDEN** (403)

```json
{
  "error": "Access denied",
  "code": "FORBIDDEN"
}
```

**USER_BANNED** (403)

```json
{
  "error": "User is banned",
  "code": "USER_BANNED"
}
```

**RATE_LIMITED** (429)

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED"
}
```

**ANON_DISABLED** (403)

```json
{
  "error": "Anonymous access is disabled",
  "code": "ANON_DISABLED"
}
```

### Not Found Errors

**NOT_FOUND** (404)

```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

**PROJECT_NOT_FOUND** (404)

```json
{
  "error": "Project not found",
  "code": "PROJECT_NOT_FOUND"
}
```

**THREAD_NOT_FOUND** (404)

```json
{
  "error": "Thread not found",
  "code": "THREAD_NOT_FOUND"
}
```

**CATEGORY_NOT_FOUND** (404)

```json
{
  "error": "Category not found",
  "code": "CATEGORY_NOT_FOUND"
}
```

### Conflict Errors

**CONFLICT** (409)

```json
{
  "error": "Resource conflict",
  "code": "CONFLICT"
}
```

**PROJECT_SLUG_CONFLICT** (409)

```json
{
  "error": "Project slug already exists",
  "code": "PROJECT_SLUG_CONFLICT"
}
```

**KEY_GENERATION_FAILED** (409)

```json
{
  "error": "Failed to generate unique project keys",
  "code": "KEY_GENERATION_FAILED"
}
```

### Server Errors

**INTERNAL_ERROR** (500)

```json
{
  "error": "Internal Server Error",
  "code": "INTERNAL_ERROR"
}
```

## Handling Errors in Widget

```javascript
try {
  const response = await fetch("/api/embed/threads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectKey, title, description }),
  });

  const data = await response.json();

  if (!response.ok) {
    switch (data.code) {
      case "RATE_LIMITED":
        showError("Too many requests. Please wait a moment.");
        break;
      case "USER_BANNED":
        showError("Your account has been banned.");
        break;
      case "AUTH_REQUIRED":
        showError("Please log in to create threads.");
        break;
      default:
        showError(data.error);
    }
    return;
  }

  // Success handling
} catch (error) {
  showError("Network error. Please try again.");
}
```

## Handling Errors in Host Application

```typescript
async function createThread(data) {
  try {
    const response = await fetch("/api/embed/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.code === "RATE_LIMITED") {
        // Implement backoff
        await sleep(result.retryAfter);
        return createThread(data); // Retry
      }

      throw new ApiError(result.error, result.code);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle known errors
      logError(error.code, error.message);
    } else {
      // Handle network errors
      logError("NETWORK_ERROR", error.message);
    }
    throw error;
  }
}
```

## Error Logging

Server-side error logging:

```typescript
// packages/server/hono/middleware/error.ts

export const handleError = (err, c) => {
  if (err instanceof AppError) {
    // Log application errors
    console.error({
      level: "error",
      code: err.code,
      message: err.message,
      status: err.status,
      timestamp: new Date().toISOString(),
    });

    return c.json({ error: err.message, code: err.code }, err.status);
  }

  // Log unexpected errors
  console.error({
    level: "error",
    code: "INTERNAL_ERROR",
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  return c.json(
    { error: "Internal Server Error", code: "INTERNAL_ERROR" },
    500,
  );
};
```

## Best Practices

### 1. Always Check Response Status

```javascript
// Avoid: Assume success
const data = await response.json();

// Recommended: Check status first
if (!response.ok) {
  const error = await response.json();
  handleError(error);
  return;
}
const data = await response.json();
```

### 2. Handle Rate Limits Gracefully

```javascript
if (error.code === "RATE_LIMITED") {
  // Implement exponential backoff
  const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
  await sleep(delay);
  return retry();
}
```

### 3. Show User-Friendly Messages

```javascript
const errorMessages = {
  RATE_LIMITED: "Too many attempts. Please wait a moment.",
  USER_BANNED: "Your account has been restricted.",
  AUTH_REQUIRED: "Please log in to continue.",
  INTERNAL_ERROR: "Something went wrong. Please try again.",
};

const message = errorMessages[error.code] || error.error;
showError(message);
```

### 4. Log Error Codes

```typescript
// Track error codes for monitoring
analytics.track("API Error", {
  code: error.code,
  endpoint: "/api/embed/threads",
  method: "POST",
  projectId: projectKey,
});
```

## Next Steps

- **[Widget Integration](../widgets/overview.md)**: Embed the widget
- **[Security](../architecture/security.md)**: Security practices
- **[Advanced](../advanced/overview.md)**: Advanced topics
