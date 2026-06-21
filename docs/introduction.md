# Introduction

TurnstileAI is a gateway for verified AI inference.

It sits between your app and model providers. It routes requests, records what happened, and returns a signed compute receipt with the response.

## What it does

- Routes requests across providers.
- Records model, provider, usage, latency, and cost.
- Returns a signed receipt for each request.
- Can attach optional anchor data for public verification.
- Works with OpenAI-style request flows.

## Why it exists

AI apps spend money on inference every day. In many setups, it is hard to prove which provider handled a request, how much it cost, or what happened during execution.

TurnstileAI adds a verification layer. That makes inference easier to inspect, audit, and reason about later.

## Core ideas

### Gateway

The gateway receives your request, applies routing rules, sends the request to a provider, and returns the response.

### Compute receipt

A compute receipt is a signed record of the request. It can include the model, provider, token usage, latency, cost, hashes, and verification data.

### Routing policy

A routing policy decides how a request is sent. You might optimize for cost, speed, trust, or a fixed provider.

### Anchor

An anchor is an optional public reference tied to receipt metadata. This can be used when you want a stronger public trail for verification.

## Typical flow

1. Your app sends a request to TurnstileAI.
2. TurnstileAI selects a provider based on policy.
3. The provider runs the model call.
4. TurnstileAI records usage and metadata.
5. A signed receipt is created.
6. The response and receipt are returned together.

## Who it is for

- Teams building products with AI inference costs.
- Developers who want better visibility into model traffic.
- Agents and automations that need usage controls.
- Apps that want verifiable inference records.
