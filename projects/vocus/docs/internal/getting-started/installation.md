---
sidebar_position: 3
---

# Installation

This guide covers detailed installation instructions for Vocus in various environments.

## System Requirements

- **Node.js**: 18.0 or higher
- **Package Manager**: pnpm 8.0+
- **Database**: PostgreSQL 14+
- **Memory**: 512MB minimum (1GB recommended)
- **Storage**: 1GB minimum

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/vocus/vocus.git
cd vocus
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Create a `.env` file:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vocus?schema=public"

# JWT Configuration (optional for local dev)
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
pnpm prisma migrate dev --name init

# (Optional) Seed the database
pnpm prisma db seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your Vocus instance.

## Production Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t vocus .
docker run -p 3000:3000 \
  -e DATABASE_URL=your_database_url \
  -e VOCUS_HOST_JWT_ISSUER=your_issuer \
  -e VOCUS_HOST_JWT_AUDIENCE=your_audience \
  vocus
```

### Environment Variables for Production

```bash
# Required
DATABASE_URL="postgresql://user:password@host:5432/vocus"
NEXT_PUBLIC_APP_URL="https://vocus.yourdomain.com"

# Recommended
VOCUS_HOST_JWT_ISSUER="your-app"
VOCUS_HOST_JWT_AUDIENCE="vocus"
PORT="3000"

# Optional
LOG_LEVEL="info"
RATE_LIMIT_ENABLED="true"
```

## Database Setup

### PostgreSQL Installation

#### macOS (Homebrew)

```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install postgresql-14 postgresql-contrib
sudo systemctl start postgresql
```

#### Docker

```bash
docker run -d \
  --name vocus-postgres \
  -e POSTGRES_USER=vocus \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=vocus \
  -p 5432:5432 \
  postgres:14
```

### Create Database

```bash
psql -U postgres
```

```sql
CREATE DATABASE vocus;
CREATE USER vocus_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE vocus TO vocus_user;
```

## Verification

After installation, verify everything is working:

### 1. Check Database Connection

```bash
pnpm prisma db pull
```

### 2. Test API Health

```bash
curl http://localhost:3000/api/widget/health
# Expected: {"ok":true}
```

### 3. Create Test Project

```bash
curl -X POST http://localhost:3000/api/admin/projects \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "test-workspace",
    "name": "Test Project",
    "slug": "test-project",
    "authMode": "HYBRID",
    "allowAnonymous": true
  }'
```

## Upgrade Instructions

### From Previous Versions

```bash
# Pull latest changes
git pull origin main

# Install updated dependencies
pnpm install

# Run new migrations
pnpm prisma migrate deploy

# Regenerate Prisma client
pnpm prisma generate

# Restart the application
pnpm build
pnpm start
```

## Uninstallation

### Remove Database

```bash
pnpm prisma migrate reset
# Or manually drop the database
psql -U postgres -c "DROP DATABASE vocus;"
```

### Remove Application

```bash
rm -rf vocus/
```

## Next Steps

- **[Configuration](./configuration.md)**: Customize your installation
- **[Quickstart](./quickstart.md)**: Get started with Vocus
- **[Architecture](../architecture/overview.md)**: Understand the system
