# Requirements

## Functional Requirements

### Client Requirements

* Modern browser with:
  * WebRTC support
  * WebCrypto API
  * ES6 JavaScript

### Infrastructure Requirements

* Cloudflare account with:
  * Realtime enabled
  * Optional Durable Objects
* GitHub Pages for static hosting

---

## Security Requirements

### Must

* HTTPS-only deployment
* Client-side encryption
* Ephemeral session keys

### Optional (future)

* Perfect forward secrecy
* Password-protected rooms
