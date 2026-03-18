---
sidebar_position: 1
---

# Introduction

Welcome to **Vocus** - an embeddable community feedback platform that helps you gather, organize, and act on user feedback directly within your application.

## What is Vocus?

Vocus is a self-hosted feedback management system that provides:

- **Embeddable Widget**: A lightweight JavaScript widget that integrates seamlessly into your existing application
- **Flexible Authentication**: Support for multiple auth modes including Host SSO, platform auth, hybrid, and anonymous
- **Forum Features**: Thread creation, comments, voting, and categorization
- **Moderation Tools**: User banning, rate limiting, and content management
- **Developer-Friendly API**: RESTful API with comprehensive documentation

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

- **[Quickstart](./quickstart.md)**: Get up and running in 5 minutes
- **[Installation](./installation.md)**: Detailed installation instructions
- **[Architecture](../architecture/overview.md)**: Understand how Vocus works
- **[Widget Integration](../widgets/overview.md)**: Embed the widget in your app

## Community & Support

- **GitHub**: [vocus/vocus](https://github.com/vocus/vocus)
- **Documentation**: This local instance
- **Issues**: Report bugs and request features on GitHub

## License

Vocus is open-source software licensed under the MIT license.
