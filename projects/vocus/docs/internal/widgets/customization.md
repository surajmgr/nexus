---
sidebar_position: 4
---

# Widget Customization

Customize the appearance and behavior of the Vocus widget.

## Default Styling

The widget includes default styles that work out of the box:

```css
.vocus-widget {
  font-family: ui-sans-serif, system-ui, sans-serif;
  border: 1px solid #e5e7eb;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
}

.vocus-widget__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.vocus-widget__threads {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.vocus-widget__thread {
  padding: 12px;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  background: #fafafa;
}
```

## CSS Customization

### Override Widget Styles

```css
/* Change widget container */
.vocus-widget {
  font-family: "Inter", sans-serif;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Customize header */
.vocus-widget__header {
  background-color: #2563eb;
  color: white;
  padding: 16px;
  border-radius: 8px 8px 0 0;
  margin: -16px -16px 16px -16px;
}

/* Style threads */
.vocus-widget__thread {
  transition: all 0.2s ease;
  border-left: 3px solid #2563eb;
}

.vocus-widget__thread:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Customize form */
.vocus-widget__form input,
.vocus-widget__form textarea {
  border: 2px solid #e5e7eb;
  transition: border-color 0.2s;
}

.vocus-widget__form input:focus,
.vocus-widget__form textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.vocus-widget__form button {
  background-color: #2563eb;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.vocus-widget__form button:hover {
  background-color: #1d4ed8;
}
```

### Dark Mode

```css
@media (prefers-color-scheme: dark) {
  .vocus-widget {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }

  .vocus-widget__thread {
    background: #111827;
    border-color: #374151;
  }

  .vocus-widget__form input,
  .vocus-widget__form textarea {
    background: #111827;
    border-color: #374151;
    color: #f9fafb;
  }

  .vocus-widget__form button {
    background-color: #3b82f6;
  }
}
```

### Custom Theme

```css
/* Your brand colors */
:root {
  --vocus-primary: #7c3aed;
  --vocus-primary-hover: #6d28d9;
  --vocus-background: #ffffff;
  --vocus-surface: #f9fafb;
  --vocus-border: #e5e7eb;
  --vocus-text: #111827;
}

.vocus-widget {
  font-family: "Your Brand Font", sans-serif;
  background: var(--vocus-background);
  color: var(--vocus-text);
}

.vocus-widget__thread {
  background: var(--vocus-surface);
  border-color: var(--vocus-border);
}

.vocus-widget__form button {
  background-color: var(--vocus-primary);
}

.vocus-widget__form button:hover {
  background-color: var(--vocus-primary-hover);
}
```

## Layout Customization

### Compact Mode

```css
.vocus-widget--compact {
  padding: 8px;
}

.vocus-widget--compact .vocus-widget__thread {
  padding: 8px;
}

.vocus-widget--compact .vocus-widget__form textarea {
  rows: 2;
}
```

### Full Width

```css
.vocus-widget--full-width {
  max-width: 100%;
  border-radius: 0;
}
```

### Card Style

```css
.vocus-widget--card {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: none;
}
```

## JavaScript Customization

### Custom Event Handlers

```javascript
const widget = window.VocusWidget?.init({
  publicKey: "pk_xxx",
  container: "#vocus-widget",
});

// Listen for thread creation
document.addEventListener("vocus:thread-created", (event) => {
  console.log("Thread created:", event.detail);
  analytics.track("Feedback Created", event.detail);
});

// Listen for vote
document.addEventListener("vocus:vote", (event) => {
  console.log("Voted:", event.detail);
});
```

### Custom Rendering (Advanced)

```javascript
// Fetch data manually
async function fetchThreads() {
  const response = await fetch("/api/embed/threads?projectKey=pk_xxx");
  const data = await response.json();
  return data.threads;
}

// Render custom UI
function renderThreads(threads) {
  const container = document.querySelector("#custom-widget");
  container.innerHTML = threads
    .map(
      (thread) => `
    <div class="custom-thread">
      <h3>${thread.title}</h3>
      <p>${thread.description}</p>
      <span>${thread.votesCount} votes</span>
    </div>
  `,
    )
    .join("");
}
```

## Widget Configuration

### API Base URL

```javascript
window.VocusWidget?.init({
  publicKey: "pk_xxx",
  container: "#vocus-widget",
  apiBase: "https://vocus.yourdomain.com",
});
```

### Custom Browser ID

```javascript
// Generate your own browser ID
const myBrowserId = getMyBrowserId();
localStorage.setItem("vocus_browser_id", myBrowserId);

// Widget will use existing ID
window.VocusWidget?.init({
  publicKey: "pk_xxx",
  container: "#vocus-widget",
});
```

## Responsive Design

### Mobile Optimization

```css
@media (max-width: 640px) {
  .vocus-widget {
    padding: 12px;
    border-radius: 8px;
  }

  .vocus-widget__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .vocus-widget__thread {
    padding: 12px;
  }

  .vocus-widget__form button {
    width: 100%;
  }
}
```

### Tablet Optimization

```css
@media (min-width: 641px) and (max-width: 1024px) {
  .vocus-widget {
    max-width: 600px;
  }
}
```

## Accessibility

### Focus Styles

```css
.vocus-widget button:focus,
.vocus-widget input:focus,
.vocus-widget textarea:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  .vocus-widget {
    border: 2px solid #000;
  }

  .vocus-widget__thread {
    border: 2px solid #000;
  }
}
```

## Performance

### Lazy Loading

```javascript
// Load widget on user interaction
let widgetLoaded = false;

function loadWidget() {
  if (!widgetLoaded) {
    const script = document.createElement("script");
    script.src = "/vocus-embed.js";
    document.body.appendChild(script);

    script.onload = () => {
      window.VocusWidget?.init({
        publicKey: "pk_xxx",
        container: "#vocus-widget",
      });
    };

    widgetLoaded = true;
  }
}

// Load on button click
document.querySelector("#show-feedback")?.addEventListener("click", loadWidget);
```

### Conditional Loading

```javascript
// Only load on feedback page
if (window.location.pathname.includes("feedback")) {
  const script = document.createElement("script");
  script.src = "/vocus-embed.js";
  document.body.appendChild(script);
}
```

## Examples

### Minimal Widget

```css
.vocus-widget--minimal {
  border: none;
  padding: 0;
  box-shadow: none;
}

.vocus-widget--minimal .vocus-widget__thread {
  border: none;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0;
  background: transparent;
}
```

### Branded Widget

```css
.vocus-widget--branded {
  border-top: 4px solid #7c3aed;
  border-radius: 8px;
}

.vocus-widget--branded .vocus-widget__header strong {
  color: #7c3aed;
  font-weight: 700;
}

.vocus-widget--branded button {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
}
```

### Inline Widget

```css
.vocus-widget--inline {
  display: inline-block;
  width: 400px;
  vertical-align: top;
}
```

## Best Practices

### 1. Test on Multiple Devices

```bash
# Test on mobile viewport
# Test on tablet viewport
# Test on desktop viewport
```

### 2. Respect User Preferences

```css
/* Dark mode */
@media (prefers-color-scheme: dark) {
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
}

/* High contrast */
@media (prefers-contrast: high) {
}
```

### 3. Maintain Accessibility

- Keep focus indicators
- Maintain color contrast
- Support keyboard navigation
- Use semantic HTML

### 4. Performance First

- Lazy load when possible
- Minimize CSS overrides
- Avoid JavaScript customization unless needed

## Next Steps

- **[Widget SDK](./widget-sdk.md)**: SDK documentation
- **[Advanced](../advanced/overview.md)**: Advanced topics
- **[API Reference](../api-reference/overview.md)**: API usage
