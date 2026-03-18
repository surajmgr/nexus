---
sidebar_position: 3
---

# Moderation

Tools for managing content and users in Vocus.

## User Banning

Ban users who violate community guidelines.

### Ban External User

```typescript
await prisma.externalUser.update({
  where: { id: externalUserId },
  data: { banned: true },
});
```

### Ban Platform User

```typescript
await prisma.user.update({
  where: { id: userId },
  data: { banned: true },
});
```

### Effect of Ban

Banned users receive `USER_BANNED` error on all write operations:

```json
{
  "error": "User is banned",
  "code": "USER_BANNED"
}
```

## Rate Limiting

Automatic rate limiting prevents spam:

- Thread creation: 20/minute
- Comment creation: 40/minute
- Voting: 60/minute

## Content Deletion

Delete inappropriate content:

```typescript
await prisma.comment.delete({
  where: { id: commentId },
});
```

## Best Practices

1. **Document guidelines** - Clear community rules
2. **Warn before banning** - Give warnings first
3. **Keep audit log** - Track moderation actions
4. **Be consistent** - Apply rules uniformly
