---
sidebar_position: 5
---

# Widget SDK

Documentation for the Vocus Widget SDK.

## Overview

The Widget SDK is a lightweight JavaScript library for embedding Vocus feedback widgets into your application.

**Package:** `@vocus/widget-sdk`  
**Size:** < 10KB gzipped  
**Dependencies:** None

## Installation

### From CDN (Recommended)

```html
<script src="https://vocus.yourdomain.com/vocus-embed.js"></script>
```

### From Local Build

```bash
cd packages/widget-sdk
pnpm build
```

Output: `dist/index.js`

## Usage

### Basic Initialization

```javascript
window.VocusWidget?.init({
  publicKey: "pk_your_project_key",
  container: "#vocus-widget",
  apiBase: "https://vocus.yourdomain.com"
});
```

### With Authentication

```javascript
window.VocusWidget?.init({
  publicKey: "pk_your_project_key",
  container: "#vocus-widget",
  userToken: "jwt_token_here",
  apiBase: "https://vocus.yourdomain.com"
});
```

## API Reference

### init(options)

Initialize and mount the widget.

**Parameters:**

```typescript
interface InitOptions {
  /** Project public key (required) */
  publicKey: string;
  
  /** Container selector or element (required) */
  container: string | HTMLElement;
  
  /** API base URL (optional) */
  apiBase?: string;
  
  /** Host JWT for SSO (optional) */
  userToken?: string;
}
```

**Returns:** Widget instance

**Example:**

```javascript
const widget = window.VocusWidget?.init({
  publicKey: "pk_xxx",
  container: "#feedback-widget"
});
```

## Widget Instance Methods

### mount()

Manually mount the widget.

```javascript
const widget = new VocusWidget(options);
await widget.mount();
```

### fetchProject()

Fetch project configuration.

```javascript
const project = await widget.fetchProject();
console.log(project);
// { id, name, slug, publicKey, authMode, categories, tags }
```

### fetchThreads()

Fetch threads list.

```javascript
const threads = await widget.fetchThreads();
console.log(threads);
// Array of thread objects
```

### createThread(payload)

Create a new thread.

```javascript
const thread = await widget.createThread({
  title: "Feature Request",
  description: "I'd like to suggest..."
});
```

## Data Types

### Project

```typescript
interface Project {
  id: string;
  name: string;
  slug: string;
  publicKey: string;
  authMode: AuthMode;
  allowAnonymous: boolean;
  categories: Category[];
  tags: Tag[];
}
```

### Thread

```typescript
interface Thread {
  id: string;
  title: string;
  description: string;
  status: ThreadStatus;
  votesCount: number;
  commentsCount: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
}
```

### Comment

```typescript
interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
}
```

### Author

```typescript
interface Author {
  id: string;
  type: 'platform' | 'external';
  name: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}
```

## Browser ID Management

The SDK automatically manages browser ID for anonymous users:

```typescript
// Internal implementation
const STORAGE_KEY = "vocus_browser_id";

function getBrowserId() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    
    const value = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, value);
    return value;
  } catch (error) {
    return `anon_${Math.random().toString(36).slice(2)}`;
  }
}
```

## Error Handling

The SDK handles errors internally:

```javascript
try {
  await widget.createThread({ title, description });
} catch (error) {
  // Error displayed in widget UI
  console.error('Widget error:', error);
}
```

## Events (Planned)

Future version will support custom events:

```javascript
document.addEventListener('vocus:thread-created', (event) => {
  console.log('Thread created:', event.detail);
});

document.addEventListener('vocus:vote', (event) => {
  console.log('Vote cast:', event.detail);
});
```

## TypeScript Support

Type definitions included:

```typescript
import { VocusWidget, InitOptions } from '@vocus/widget-sdk';

const options: InitOptions = {
  publicKey: "pk_xxx",
  container: "#widget"
};

const widget = new VocusWidget(options);
```

## Building from Source

### Setup

```bash
cd packages/widget-sdk
pnpm install
```

### Build

```bash
pnpm build
```

### Output

```
packages/widget-sdk/
├── dist/
│   ├── index.js        # Compiled JavaScript
│   └── index.d.ts      # TypeScript definitions
├── src/
│   └── index.ts        # Source code
└── package.json
```

### Development

```bash
pnpm build --watch
```

## Versioning

The SDK follows semantic versioning:

- **Major:** Breaking changes
- **Minor:** New features (backward compatible)
- **Patch:** Bug fixes

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## Performance

### Bundle Size

- **Gzipped:** < 10KB
- **Uncompressed:** ~25KB

### Loading Strategies

**After Interactive:**
```html
<script src="/vocus-embed.js" strategy="afterInteractive" />
```

**Lazy Loading:**
```javascript
button.addEventListener('click', () => {
  const script = document.createElement('script');
  script.src = '/vocus-embed.js';
  document.body.appendChild(script);
});
```

## Migration Guide

### From v0.0.1 to Current

No breaking changes in initial version.

## Troubleshooting

### Widget Not Loading

**Check:**
1. Script loaded correctly
2. No console errors
3. Container exists
4. publicKey is valid

### Authentication Issues

**Check:**
1. JWT is valid
2. Secret key matches
3. Token not expired

### CORS Errors

**Fix:**
Ensure CORS is enabled on server:
```typescript
cors({
  origin: "*",
  credentials: true
})
```

## Next Steps

- **[Embed Setup](./embed-setup.md)**: Setup guide
- **[Customization](./customization.md)**: Customize widget
- **[API Reference](../api-reference/overview.md)**: Backend API
