---
sidebar_position: 2
---

# Quickstart

Get Vocus up and running in 5 minutes with this quickstart guide.

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Git

## Step 1: Clone and Install

```bash
git clone https://github.com/vocus/vocus.git
cd vocus
pnpm install
```

## Step 2: Configure Environment

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vocus?schema=public"

# Authentication (optional for development)
VOCUS_HOST_JWT_ISSUER="your-app"
VOCUS_HOST_JWT_AUDIENCE="vocus"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 3: Setup Database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev
```

## Step 4: Start Development Server

```bash
pnpm dev
```

Your Vocus instance will be available at `http://localhost:3000`.

## Step 5: Create Your First Project

Use the admin API to create a project:

```bash
curl -X POST http://localhost:3000/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_session_token" \
  -d '{
    "workspaceId": "your_workspace_id",
    "name": "My Feedback Board",
    "slug": "my-feedback",
    "authMode": "HYBRID",
    "allowAnonymous": true
  }'
```

Save the returned `publicKey` and `secretKey`.

## Step 6: Embed the Widget

Add the widget to your application:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App with Vocus</title>
</head>
<body>
  <h1>My Application</h1>
  
  <!-- Widget Container -->
  <div id="vocus-widget"></div>
  
  <!-- Load Widget Script -->
  <script src="http://localhost:3000/vocus-embed.js"></script>
  
  <!-- Initialize Widget -->
  <script>
    window.VocusWidget?.init({
      publicKey: "pk_your_project_public_key",
      container: "#vocus-widget",
      apiBase: "http://localhost:3000"
    });
  </script>
</body>
</html>
```

## Step 7: Test It Out

1. Navigate to your page with the embedded widget
2. Create a new thread with title and description
3. Vote on threads
4. Add comments

## What's Next?

- **[Configuration](./configuration.md)**: Customize Vocus for your needs
- **[SSO Integration](../widgets/sso-integration.md)**: Set up single sign-on
- **[API Reference](../api-reference/overview.md)**: Explore the full API
- **[Architecture](../architecture/overview.md)**: Understand the system design

## Troubleshooting

### Database Connection Errors

Ensure your PostgreSQL server is running and the `DATABASE_URL` is correct:

```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Port Already in Use

If port 3000 is occupied, use a different port:

```bash
PORT=3001 pnpm dev
```

### Prisma Client Errors

Regenerate the Prisma client:

```bash
pnpm prisma generate
```
