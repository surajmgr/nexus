---
sidebar_position: 5
---

# Deployment

Deploy Vocus to production.

## Prerequisites

- PostgreSQL database
- Domain name
- SSL certificate
- Environment variables configured

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

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

### Build and Run

```bash
docker build -t vocus .
docker run -p 3000:3000 \
  -e DATABASE_URL=your_database_url \
  -e VOCUS_HOST_JWT_ISSUER=your_issuer \
  -e VOCUS_HOST_JWT_AUDIENCE=your_audience \
  vocus
```

### Docker Compose

```yaml
version: "3.8"

services:
  vocus:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/vocus
      - VOCUS_HOST_JWT_ISSUER=vocus
      - VOCUS_HOST_JWT_AUDIENCE=vocus
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=vocus
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Environment Variables

### Required

```bash
DATABASE_URL="postgresql://user:password@host:5432/vocus"
NEXT_PUBLIC_APP_URL="https://vocus.yourdomain.com"
```

### Recommended

```bash
VOCUS_HOST_JWT_ISSUER="your-app"
VOCUS_HOST_JWT_AUDIENCE="vocus"
PORT="3000"
NODE_ENV="production"
```

### Optional

```bash
LOG_LEVEL="info"
RATE_LIMIT_ENABLED="true"
```

## Database Migration

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy
```

## SSL Configuration

### With Nginx

```nginx
server {
  listen 80;
  server_name vocus.yourdomain.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name vocus.yourdomain.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Monitoring

### Health Check

```bash
curl https://vocus.yourdomain.com/api/widget/health
# Expected: {"ok":true}
```

### Logs

```bash
# View logs
docker logs vocus-container

# Follow logs
docker logs -f vocus-container
```

## Backup

### Database Backup

```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Scaling

### Horizontal Scaling

1. Deploy multiple instances
2. Use load balancer
3. Share database
4. Use Redis for sessions (planned)

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Add database indexes

## Security Checklist

- [ ] SSL certificate installed
- [ ] Database password strong
- [ ] Environment variables secure
- [ ] CORS restricted to your domains
- [ ] Rate limiting enabled
- [ ] JWT issuer/audience configured
- [ ] Regular backups scheduled
- [ ] Monitoring configured

## Troubleshooting

### Port Already in Use

```bash
# Change port
PORT=3001 docker run ...
```

### Database Connection Error

```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1"
```

### Migration Error

```bash
# Reset and migrate
pnpm prisma migrate reset
pnpm prisma migrate deploy
```

## Next Steps

- **[Security](../architecture/security.md)**: Security practices
- **[Observability](../advanced/observability.md)**: Monitoring and observability
- **[Rate Limiting](../advanced/rate-limiting.md)**: Rate limiting configuration
