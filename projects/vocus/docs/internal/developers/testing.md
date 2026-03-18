---
sidebar_position: 4
---

# Testing

Testing strategies for Vocus applications.

## Test Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── forumService.test.ts
│   │   └── projectService.test.ts
│   └── domain/
│       └── identity.test.ts
├── integration/
│   └── api/
│       ├── threads.test.ts
│       └── votes.test.ts
└── e2e/
    └── widget-flow.test.ts
```

## Unit Testing

### Service Tests

```typescript
// tests/unit/services/forumService.test.ts

import { createThread } from '@/packages/server/services/forumService';
import { threadRepository } from '@/packages/server/repositories/threadRepository';

describe('createThread', () => {
  it('should create thread with correct data', async () => {
    // Mock repository
    vi.spyOn(threadRepository, 'create').mockResolvedValue({
      id: 'thread_1',
      title: 'Test',
      createdByUser: null,
      createdByExternal: null,
      _count: { votes: 0, comments: 0 },
    });
    
    // Call service
    const result = await createThread({
      projectId: 'proj_1',
      title: 'Test',
      description: 'Test desc',
      identity: { kind: 'platform', userId: 'user_1' },
    });
    
    // Assert
    expect(result.title).toBe('Test');
    expect(result.votesCount).toBe(0);
  });
});
```

### Identity Resolution Tests

```typescript
// tests/unit/domain/identity.test.ts

describe('resolveWriteIdentity', () => {
  it('should resolve platform identity', async () => {
    const result = await resolveWriteIdentity({
      authMode: AuthMode.PLATFORM_AUTH,
      projectId: 'proj_1',
      secretKey: 'sk_1',
      allowAnonymous: false,
      headers: new Headers({ cookie: 'session_token=xxx' }),
    });
    
    expect(result.identity.kind).toBe('platform');
    expect(result.identity.userId).toBeDefined();
  });
  
  it('should resolve external identity from JWT', async () => {
    const result = await resolveWriteIdentity({
      authMode: AuthMode.HOST_SSO,
      projectId: 'proj_1',
      secretKey: 'sk_1',
      allowAnonymous: false,
      headers: new Headers({ authorization: 'Bearer valid_jwt' }),
    });
    
    expect(result.identity.kind).toBe('external');
    expect(result.identity.externalUserId).toBeDefined();
  });
});
```

## Integration Testing

### API Route Tests

```typescript
// tests/integration/api/threads.test.ts

describe('POST /api/embed/threads', () => {
  it('should create thread with valid data', async () => {
    const response = await fetch('/api/embed/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        projectKey: 'pk_test',
        title: 'Test Thread',
        description: 'Test description',
      }),
    });
    
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.thread).toMatchObject({
      title: 'Test Thread',
      votesCount: 0,
    });
  });
  
  it('should reject missing authentication', async () => {
    const response = await fetch('/api/embed/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectKey: 'pk_test',
        title: 'Test',
        description: 'Test',
      }),
    });
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.code).toBe('AUTH_REQUIRED');
  });
});
```

## E2E Testing

### Widget Flow Test

```typescript
// tests/e2e/widget-flow.test.ts

describe('Widget Flow', () => {
  it('should complete full widget flow', async () => {
    // 1. Load page with widget
    await page.goto('/test-page');
    
    // 2. Wait for widget to load
    await page.waitForSelector('.vocus-widget');
    
    // 3. Create thread
    await page.fill('input[name="title"]', 'E2E Test Thread');
    await page.fill('textarea[name="description"]', 'E2E description');
    await page.click('button[type="submit"]');
    
    // 4. Verify thread created
    await page.waitForSelector('.vocus-widget__thread', { state: 'visible' });
    expect(await page.textContent('.vocus-widget__thread h4')).toContain('E2E Test Thread');
    
    // 5. Vote on thread
    await page.click('.vote-button');
    await page.waitForSelector('.votes-count', { state: 'visible' });
    
    // 6. Add comment
    await page.fill('textarea[name="comment"]', 'E2E comment');
    await page.click('button[type="submit"][data-action="comment"]');
    
    // 7. Verify comment
    await page.waitForSelector('.comment', { state: 'visible' });
    expect(await page.textContent('.comment')).toContain('E2E comment');
  });
});
```

## Test Utilities

### Test Database

```typescript
// tests/utils/testDb.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  // Clean database
  await prisma.vote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.thread.deleteMany();
  // ... clean all tables
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

### Test Factories

```typescript
// tests/utils/factories.ts

export const createTestProject = async (overrides = {}) => {
  return prisma.project.create({
    data: {
      workspaceId: 'test-ws',
      name: 'Test Project',
      slug: `test-${Date.now()}`,
      publicKey: `pk_test_${Date.now()}`,
      secretKey: `sk_test_${Date.now()}`,
      authMode: 'HYBRID',
      allowAnonymous: true,
      ...overrides,
    },
  });
};

export const createTestUser = async (overrides = {}) => {
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      ...overrides,
    },
  });
};
```

## Running Tests

### Command Line

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test forumService

# Run with coverage
pnpm test --coverage

# Run in watch mode
pnpm test --watch
```

### CI/CD

```yaml
# .github/workflows/test.yml

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm prisma migrate dev
      - run: pnpm test
```

## Test Coverage Goals

| Component | Target |
|-----------|--------|
| Services | 80% |
| Repositories | 70% |
| Domain Logic | 90% |
| API Routes | 60% |
| Overall | 75% |

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests independent**
4. **Clean up after tests**
5. **Mock external dependencies**
6. **Test edge cases**
7. **Use factories for test data**
