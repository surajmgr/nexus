---
sidebar_position: 1
---

# Quickstart

Get Vocus running quickly in your application with these steps.

## Step 1: Create a Project

1. Log in to your Vocus account.
2. Create a new project in your workspace:
   - Choose a name for your feedback board.
   - Select a slug (URL-friendly identifier).
   - Set the authentication mode (e.g., Hybrid or Open).
   - Decide whether to allow anonymous submissions.
3. Copy the `publicKey` for your project — you’ll need it to embed the widget.

## Step 2: Embed the Widget

Add the widget to your application by including this HTML snippet:

```html
<div id="vocus-widget"></div>

<script src="https://app.vocus.com/vocus-embed.js"></script>

<script>
  window.VocusWidget?.init({
    publicKey: "pk_your_project_public_key",
    container: "#vocus-widget",
    apiBase: "https://app.vocus.com",
  });
</script>
```
