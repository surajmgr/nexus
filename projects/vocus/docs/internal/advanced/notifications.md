---
sidebar_position: 4
---

# Notifications

Email notifications for user activity (planned feature).

## Overview

Notifications keep users engaged with:
- Thread reply notifications
- Mention notifications
- Status change updates

## Implementation Status

**Current:** Stub implementation (`noopNotificationService`)

**Planned:**
- Email notifications
- In-app notifications
- Notification preferences
- Digest emails

## Configuration (Planned)

### Email Provider

```typescript
interface EmailProvider {
  send: (to: string, subject: string, html: string) => Promise<void>;
}
```

### Notification Preferences

```typescript
interface NotificationPrefs {
  emailOnReply: boolean;
  emailOnMention: boolean;
  emailOnStatusChange: boolean;
  digestFrequency: 'never' | 'daily' | 'weekly';
}
```

## API (Planned)

### Get Preferences

```typescript
GET /api/notifications/preferences
```

### Update Preferences

```typescript
PATCH /api/notifications/preferences
{
  "emailOnReply": true,
  "emailOnMention": false,
  "digestFrequency": "weekly"
}
```

## Timeline

Notifications are planned for Phase 5 (Polish).
