---
sidebar_position: 1
---

# Widget Integration Overview

Embed the Vocus widget into your application in minutes.

## What is the Vocus Widget?

The Vocus widget is a lightweight, customizable JavaScript component that embeds a feedback board directly into your application.

**Features:**

- Responsive design
- Multiple auth modes support
- Fast and lightweight (< 10KB)
- Mobile-friendly
- CORS-enabled for any domain

## Quick Integration

### Step 1: Add Container

```html
<div id="vocus-widget"></div>
```

### Step 2: Load Script

```html
<script src="https://vocus.yourdomain.com/vocus-embed.js"></script>
```

### Step 3: Initialize

```html
<script>
  window.VocusWidget?.init({
    publicKey: "pk_your_project_key",
    container: "#vocus-widget",
    apiBase: "https://vocus.yourdomain.com",
  });
</script>
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App with Feedback</title>
    <style>
      .feedback-container {
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="feedback-container">
      <h2>Community Feedback</h2>
      <div id="vocus-widget"></div>
    </div>

    <script src="https://vocus.yourdomain.com/vocus-embed.js"></script>
    <script>
      window.VocusWidget?.init({
        publicKey: "pk_xxx",
        container: "#vocus-widget",
        apiBase: "https://vocus.yourdomain.com",
      });
    </script>
  </body>
</html>
```

## Integration Methods

### Method 1: Basic Integration (Anonymous)

Best for public feedback boards.

```html
<script>
  window.VocusWidget?.init({
    publicKey: "pk_xxx",
    container: "#vocus-widget",
  });
</script>
```

**Auth Mode:** ANONYMOUS or HYBRID with `allowAnonymous: true`

### Method 2: SSO Integration

Best for authenticated users.

```html
<script>
  // Server-generated JWT
  const userToken = "<%= generateUserToken(currentUser) %>";

  window.VocusWidget?.init({
    publicKey: "pk_xxx",
    container: "#vocus-widget",
    userToken: userToken,
  });
</script>
```

**Auth Mode:** HOST_SSO or HYBRID

### Method 3: React Integration

```jsx
import { useEffect, useRef } from "react";

export function FeedbackWidget() {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (window.VocusWidget && widgetRef.current) {
      window.VocusWidget.init({
        publicKey: process.env.REACT_APP_VOCUS_PUBLIC_KEY,
        container: widgetRef.current,
        apiBase: process.env.REACT_APP_VOCUS_API_URL,
        userToken: auth.user?.token,
      });
    }
  }, [auth.user]);

  return <div ref={widgetRef} />;
}
```

### Method 4: Vue Integration

```vue
<template>
  <div ref="widgetContainer"></div>
</template>

<script>
export default {
  name: "FeedbackWidget",
  props: {
    userToken: String,
  },
  mounted() {
    if (window.VocusWidget && this.$refs.widgetContainer) {
      window.VocusWidget.init({
        publicKey: process.env.VUE_APP_VOCUS_PUBLIC_KEY,
        container: this.$refs.widgetContainer,
        userToken: this.userToken,
      });
    }
  },
};
</script>
```

### Method 5: Next.js Integration

```tsx
"use client";

import { useEffect, useRef } from "react";

export default function FeedbackWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.VocusWidget &&
      widgetRef.current
    ) {
      window.VocusWidget.init({
        publicKey: process.env.NEXT_PUBLIC_VOCUS_PUBLIC_KEY!,
        container: widgetRef.current,
        apiBase: process.env.NEXT_PUBLIC_VOCUS_API_URL,
      });
    }
  }, []);

  return <div ref={widgetRef} />;
}
```

## Configuration Options

| Option      | Type   | Required | Description                 |
| ----------- | ------ | -------- | --------------------------- |
| `publicKey` | string | Yes      | Project public key          |
| `container` | string | Yes      | CSS selector or DOM element |
| `apiBase`   | string | No       | API base URL (default: "")  |
| `userToken` | string | No       | Host JWT for SSO            |

## Widget Features

### Thread Creation

Users can create new feedback threads:

- Title (required, max 200 chars)
- Description (required)
- Category (optional)

### Voting

Users can vote on threads:

- One vote per user per thread
- Toggle to remove vote
- Vote count displayed

### Comments

Users can comment on threads:

- Rich text support (planned)
- Author attribution
- Chronological order

### Filtering

Filter threads by:

- Category
- Status (planned)
- Search (planned)

## Styling

### Default Styles

The widget includes default styles that work out of the box.

### Custom CSS

Override widget styles:

```css
.vocus-widget {
  font-family: "Your Font", sans-serif;
}

.vocus-widget__header {
  background-color: #your-color;
}

.vocus-widget__thread {
  border-radius: 8px;
}
```

### Theme Customization (Planned)

```javascript
window.VocusWidget?.init({
  publicKey: "pk_xxx",
  container: "#vocus-widget",
  theme: {
    primaryColor: "#2563eb",
    fontFamily: "Inter, sans-serif",
    borderRadius: "8px",
  },
});
```

## Browser ID Management

For anonymous users, the widget manages browser ID:

```javascript
// Automatic browser ID generation
const browserId = localStorage.getItem("vocus_browser_id");

// Stored persistently across sessions
// Used for anonymous authentication
// Rate limited per browser
```

## Error Handling

The widget handles errors gracefully:

```javascript
// Internal error handling
try {
  await createThread(data);
} catch (error) {
  // Show error in widget
  showError(error.message);
}
```

## Performance

### Loading Strategies

**After Interactive (Recommended):**

```html
<script src="/vocus-embed.js" strategy="afterInteractive" />
```

**Lazy Loading:**

```javascript
// Load on user interaction
button.addEventListener("click", () => {
  const script = document.createElement("script");
  script.src = "/vocus-embed.js";
  document.body.appendChild(script);
});
```

### Bundle Size

- **Gzipped:** < 10KB
- **Uncompressed:** ~25KB
- **No dependencies**

## Browser Support

| Browser | Version |
| ------- | ------- |
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |
| Opera   | 76+     |

## Accessibility

- Keyboard navigation
- Screen reader support
- ARIA labels
- Focus management

## Next Steps

- **[Embed Setup](./embed-setup.md)**: Detailed setup guide
- **[SSO Integration](./sso-integration.md)**: Set up authentication
- **[Customization](./customization.md)**: Customize appearance
- **[Widget SDK](./widget-sdk.md)**: SDK documentation
