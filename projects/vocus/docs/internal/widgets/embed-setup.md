---
sidebar_position: 2
---

# Embed Setup

Step-by-step guide to embedding the Vocus widget.

## Prerequisites

1. Vocus instance running
2. Project created with `publicKey`
3. Web application to embed into

## Basic Setup

### Step 1: Create Project

```bash
curl -X POST http://localhost:3000/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_session_token" \
  -d '{
    "workspaceId": "workspace_xxx",
    "name": "My Feedback Board",
    "slug": "my-feedback",
    "authMode": "HYBRID",
    "allowAnonymous": true
  }'
```

Save the `publicKey` from the response.

### Step 2: Add HTML Container

```html
<div id="vocus-widget"></div>
```

### Step 3: Load Widget Script

```html
<script src="http://localhost:3000/vocus-embed.js"></script>
```

### Step 4: Initialize Widget

```html
<script>
  window.VocusWidget?.init({
    publicKey: "pk_your_project_key",
    container: "#vocus-widget",
    apiBase: "http://localhost:3000"
  });
</script>
```

## Full HTML Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App - Feedback</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .feedback-section {
      margin-top: 40px;
    }
    
    #vocus-widget {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>My Application</h1>
  
  <div class="feedback-section">
    <h2>Community Feedback</h2>
    <div id="vocus-widget"></div>
  </div>
  
  <script src="http://localhost:3000/vocus-embed.js"></script>
  <script>
    window.VocusWidget?.init({
      publicKey: "pk_abc123def456",
      container: "#vocus-widget",
      apiBase: "http://localhost:3000"
    });
  </script>
</body>
</html>
```

## Framework Integrations

### React

```jsx
import { useEffect, useRef } from 'react';

function FeedbackWidget() {
  const widgetRef = useRef(null);
  
  useEffect(() => {
    // Load script dynamically
    const script = document.createElement('script');
    script.src = 'http://localhost:3000/vocus-embed.js';
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      if (window.VocusWidget && widgetRef.current) {
        window.VocusWidget.init({
          publicKey: process.env.REACT_APP_VOCUS_PUBLIC_KEY,
          container: widgetRef.current,
          apiBase: process.env.REACT_APP_VOCUS_API_URL
        });
      }
    };
    
    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  return <div ref={widgetRef} />;
}

export default FeedbackWidget;
```

### Vue 3

```vue
<template>
  <div class="feedback-widget">
    <div ref="widgetContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const widgetContainer = ref(null);
let scriptElement = null;

onMounted(() => {
  scriptElement = document.createElement('script');
  scriptElement.src = 'http://localhost:3000/vocus-embed.js';
  scriptElement.async = true;
  document.body.appendChild(scriptElement);
  
  scriptElement.onload = () => {
    if (window.VocusWidget && widgetContainer.value) {
      window.VocusWidget.init({
        publicKey: import.meta.env.VITE_VOCUS_PUBLIC_KEY,
        container: widgetContainer.value,
        apiBase: import.meta.env.VITE_VOCUS_API_URL
      });
    }
  };
});

onBeforeUnmount(() => {
  if (scriptElement && document.body.contains(scriptElement)) {
    document.body.removeChild(scriptElement);
  }
});
</script>

<style scoped>
.feedback-widget {
  margin-top: 2rem;
}
</style>
```

### Next.js (App Router)

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface FeedbackWidgetProps {
  publicKey: string;
  apiBase?: string;
}

export default function FeedbackWidget({ publicKey, apiBase }: FeedbackWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `${apiBase || ''}/vocus-embed.js`;
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      if (window.VocusWidget && widgetRef.current) {
        window.VocusWidget.init({
          publicKey,
          container: widgetRef.current,
          apiBase
        });
      }
    };
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [publicKey, apiBase]);
  
  return <div ref={widgetRef} />;
}
```

### Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  
  export let publicKey;
  export let apiBase = '';
  
  let widgetContainer;
  
  onMount(() => {
    const script = document.createElement('script');
    script.src = `${apiBase}/vocus-embed.js`;
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      if (window.VocusWidget && widgetContainer) {
        window.VocusWidget.init({
          publicKey,
          container: widgetContainer,
          apiBase
        });
      }
    };
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  });
</script>

<div bind:this={widgetContainer}></div>
```

## Environment Variables

### React (.env)

```bash
REACT_APP_VOCUS_PUBLIC_KEY=pk_xxx
REACT_APP_VOCUS_API_URL=http://localhost:3000
```

### Vue (.env)

```bash
VITE_VOCUS_PUBLIC_KEY=pk_xxx
VITE_VOCUS_API_URL=http://localhost:3000
```

### Next.js (.env.local)

```bash
NEXT_PUBLIC_VOCUS_PUBLIC_KEY=pk_xxx
NEXT_PUBLIC_VOCUS_API_URL=http://localhost:3000
```

## Testing

### Local Testing

1. Start Vocus: `pnpm dev`
2. Open your test page
3. Create a thread
4. Vote on threads
5. Add comments

### Verify Integration

```javascript
// Check widget loaded
console.log(window.VocusWidget);

// Check widget initialized
const widget = document.querySelector('#vocus-widget');
console.log(widget.innerHTML);
```

## Troubleshooting

### Widget Not Loading

**Check:**
1. Script loaded correctly
2. No console errors
3. Container element exists
4. publicKey is correct

**Debug:**
```javascript
console.log('Widget:', window.VocusWidget);
console.log('Container:', document.querySelector('#vocus-widget'));
```

### CORS Errors

**Fix:**
```typescript
// Ensure CORS is enabled in Vocus
// packages/server/hono/routes/embed.ts
cors({
  origin: "*",  // Or your domain
  credentials: true
})
```

### Authentication Issues

**Check:**
1. Auth mode matches configuration
2. JWT is valid (for HOST_SSO)
3. Browser ID present (for ANONYMOUS)
4. Session cookie present (for PLATFORM_AUTH)

## Next Steps

- **[SSO Integration](./sso-integration.md)**: Set up authentication
- **[Customization](./customization.md)**: Customize appearance
- **[Widget SDK](./widget-sdk.md)**: SDK documentation
