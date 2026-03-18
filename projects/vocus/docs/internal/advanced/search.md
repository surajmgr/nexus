---
sidebar_position: 5
---

# Search

Search functionality for threads and comments.

## Implementation Status

**Current:** Not implemented

**Planned:** Postgres tsvector with optional Algolia provider

## Postgres Search (Planned)

### Schema

```prisma
model Thread {
  // ...
  @@index([projectId])
}
```

### Query

```typescript
const results = await prisma.thread.findMany({
  where: {
    projectId,
    search: {
      title_description: query,
    },
  },
});
```

## Algolia Provider (Planned)

### Configuration

```typescript
interface SearchProvider {
  index: (thread: Thread) => Promise<void>;
  search: (query: string, projectId: string) => Promise<Thread[]>;
  remove: (threadId: string) => Promise<void>;
}
```

### Usage

```typescript
const results = await searchProvider.search('bug', projectId);
```

## Timeline

Search is planned for Phase 5 (Polish).
