# Architecture

TurnstileAI sits between client applications and model providers.

Its job is to route requests, record metadata, and return a verified result.

## High-level flow

```text
Application
  -> TurnstileAI SDK or API
  -> Routing and policy layer
  -> Provider adapter
  -> Upstream model provider
  -> Receipt generator
  -> Optional anchor
  -> Response with receipt
```

## Main parts

### SDK or API layer

Receives requests from your app.

### Routing layer

Chooses how a request should be handled.

### Provider adapter

Talks to upstream providers.

### Receipt generator

Builds the signed record for the request.

### Anchor layer

Adds optional public verification metadata.
