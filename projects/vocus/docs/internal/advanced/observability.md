---
sidebar_position: 6
---

# Observability

Logging and monitoring for production deployments.

## Logging

### Log Levels

```bash
LOG_LEVEL="debug"  # debug, info, warn, error
```

### Structured Logging

```typescript
console.log({
  level: 'info',
  type: 'request',
  method: c.req.method,
  path: c.req.path,
  status: c.res.status,
  duration: Date.now() - start,
  projectId: project.id,
});
```

## Metrics to Track

### API Metrics

- Request count by endpoint
- Response time percentiles (p50, p95, p99)
- Error rate by type
- Rate limit hits

### Business Metrics

- Threads created per day
- Comments per thread
- Vote participation rate
- Active users (DAU/MAU)

### Auth Metrics

- Auth mode distribution
- SSO failure rate
- Session duration
- Anonymous vs authenticated ratio

## Monitoring Tools

### Application Monitoring

- Sentry for error tracking
- Datadog for metrics
- New Relic for APM

### Log Aggregation

- Logtail
- Papertrail
- ELK Stack

## Alerts

Recommended alerts:
- Error rate > 1%
- Response time p95 > 500ms
- Database connection failures
- Rate limit spikes

## Dashboard

Key dashboard panels:
- Requests per minute
- Error rate over time
- Top endpoints by volume
- Auth mode breakdown
- Widget load success rate
