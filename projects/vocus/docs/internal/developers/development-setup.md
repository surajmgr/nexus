---
sidebar_position: 1
---

# Development Setup

Get your local development environment running.

## Prerequisites

- **Node.js**: 18.0 or higher
- **Package Manager**: pnpm 8.0+
- **Database**: PostgreSQL 14+
- **Git**: For version control

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/vocus/vocus.git
cd vocus
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment

Create `.env` file:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vocus?schema=public"

# JWT Configuration
VOCUS_HOST_JWT_ISSUER="vocus-dev"
VOCUS_HOST_JWT_AUDIENCE="vocus"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PORT="3000"
```

### 4. Setup Database

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Seed database
pnpm prisma db seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`.

## Project Structure

```
vocus/
├── app/                      # Next.js application
│   ├── (client-sdk)/        # Client SDK routes
│   ├── embed/               # Embed pages
│   └── api/                 # API routes
├── packages/
│   ├── server/              # Server-side code
│   │   ├── domain/          # Domain logic
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access
│   │   ├── lib/             # Utilities
│   │   └── hono/            # Hono routes
│   └── widget-sdk/          # Widget SDK
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── docs/                    # Documentation
└── public/                  # Static assets
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## Database Management

### Create Migration

```bash
pnpm prisma migrate dev --name add_new_field
```

### Reset Database

```bash
pnpm prisma migrate reset
```

### Open Prisma Studio

```bash
pnpm prisma studio
```

### Seed Database

```bash
pnpm prisma db seed
```

## Debugging

### Enable Debug Logging

```bash
LOG_LEVEL="debug" pnpm dev
```

### Prisma Query Logging

```typescript
// packages/server/lib/db.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### VS Code Debug Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Next.js",
      "type": "node",
      "request": "launch",
      "runtimeArgs": ["--inspect-brk", "-r", "tsconfig-paths/register"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

## Testing

### Run Tests

```bash
pnpm test
```

### Run Specific Test

```bash
pnpm test forumService
```

### Test Coverage

```bash
pnpm test --coverage
```

## Code Quality

### Lint

```bash
pnpm lint
```

### Format

```bash
pnpm format
```

### Type Check

```bash
pnpm type-check
```

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `NEXT_PUBLIC_APP_URL` | App URL | `http://localhost:3000` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `VOCUS_HOST_JWT_ISSUER` | JWT issuer | - |
| `VOCUS_HOST_JWT_AUDIENCE` | JWT audience | - |
| `PORT` | Server port | `3000` |
| `LOG_LEVEL` | Log level | `info` |

## Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 pnpm dev
```

### Prisma Client Errors

```bash
# Regenerate client
pnpm prisma generate
```

### Database Connection Errors

```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL (macOS)
brew services restart postgresql@14
```

## Next Steps

- **[Project Structure](./project-structure.md)**: Detailed structure
- **[Services & Repositories](./services-repositories.md)**: Architecture
- **[Testing](./testing.md)**: Testing guide
- **[Deployment](./deployment.md)**: Deploy to production
