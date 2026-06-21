# Introduction

TurnstileAI is a verifiable inference gateway. Route model calls across AI providers and receive a signed compute receipt with every response — containing the model, provider, token usage, latency, cost, hashes, and optional on-chain proof.

## Why TurnstileAI?

AI applications are spending real money on inference with no audit trail. TurnstileAI inserts a verification layer between your app and any provider so every request is measured, signed, and provable.

- **Signed receipts** — every response gets a cryptographic proof of execution.
- **Intelligent routing** — choose the cheapest, fastest, or highest-reputation provider path.
- **On-chain anchoring** — Solana memo anchors for public verifiability.
- **Agent-safe** — spend ceilings and route controls on sub-keys.
- **OpenAI-compatible** — one base URL change, no workflow rewrite.

## Core concepts

### Gateway

The TurnstileAI gateway sits between your application and upstream model providers. It receives your request, applies routing and policy logic, executes inference, and returns both the model response and a verification record.

### Compute receipt

A compute receipt is the signed record created for a request. It captures what model was used, which provider served it, how long it took, how many tokens were consumed, how much it cost, and whether the output was anchored or verified.

### Routing policy

A routing policy controls how TurnstileAI selects the execution path for a request. Policies can optimize for cost, speed, trust, privacy, or fixed-provider behaviour.

### Anchor

An anchor is an optional public checkpoint of receipt metadata. In the Solana flow, TurnstileAI can write a memo-linked reference so a request has a verifiable public trail.

## Typical workflow

1. Your app sends a chat completion request to TurnstileAI.
2. The gateway selects a provider based on policy.
3. The upstream model executes the inference.
4. TurnstileAI records usage, latency, and hashes.
5. A signed receipt is generated.
6. Optional anchor metadata is attached.
7. Your app receives the model output and receipt together.

## Who this is for

- Teams building AI products with real inference spend.
- Agents and automations that need budget controls.
- Developers who want OpenAI-compatible integration with stronger verification.
- Apps that want auditable AI outputs and provider visibility.
