---
sidebar_position: 1
---

# Introduction

Vocus is an embeddable community feedback platform that helps you gather, organize, and act on user feedback directly within your application. It is a feedback management system that provides:

- A lightweight JavaScript widget that integrates seamlessly into your existing application
- Support for multiple auth modes including Host SSO, platform auth, hybrid, and anonymous
- Thread creation, comments, voting, and categorization
- User banning, rate limiting, and content management
- RESTful API with comprehensive documentation

## Key Features

### Customizable Widget

Embed a beautiful, responsive feedback widget into your application with minimal code. Customize colors, branding, and behavior to match your application's design.

### Flexible Authentication

Choose from four authentication modes:

- **HOST_SSO**: Use your existing user authentication via JWT
- **PLATFORM_AUTH**: Use Vocus's built-in authentication system
- **HYBRID**: Accept both platform and host authentication
- **ANONYMOUS**: Allow feedback without authentication (with browser ID tracking)

### Rich Forum Features

- Thread creation with categories and tags
- Comments with nested replies (planned)
- Upvote/downvote system
- Status tracking (Open, Planned, In Progress, Answered, Closed)

### Moderation & Security

- User banning capabilities
- Rate limiting per project and identity
- Content moderation tools
- Secure JWT validation

## Quick Example

```javascript
// Initialize the widget in your HTML
<div id="vocus-widget"></div>

<script src="https://your-vocus-instance.com/vocus-embed.js"></script>
<script>
  window.VocusWidget?.init({
    publicKey: "pk_your_project_key",
    container: "#vocus-widget",
    userToken: "optional_jwt_token"
  });
</script>
```

## Next Steps

- **[Quickstart](./getting-started/quickstart.md)**: Get up and running in 5 minutes
- **[Installation](./internal/getting-started/installation.md)**: Detailed installation instructions
- **[Architecture](./internal/architecture/overview.md)**: Understand how Vocus works
- **[Widget Integration](./internal/widgets/overview.md)**: Embed the widget in your app
