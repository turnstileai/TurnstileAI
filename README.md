# TurnstileAI SDK

TypeScript SDK for TurnstileAI.

TurnstileAI routes AI requests, records execution details, and returns signed compute receipts so you can inspect what happened after each call.

## Why use TurnstileAI

- Route requests across providers.
- Get signed receipts with model, provider, usage, latency, and cost.
- Apply routing policies for speed, cost, or reliability.
- Keep an audit trail for agents and production workloads.
- Use an OpenAI-style integration pattern.

## Install

```bash
npm install @turnstileai/sdk
```

## Quick start

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});

const response = await client.chat.completions.create({
  model: "openrouter/llama-3.1-70b",
  messages: [
    { role: "user", content: "Explain Solana finality simply." }
  ],
  extra_body: {
    receipt: true,
    policy: "cheapest",
    anchor: "solana"
  }
});

console.log(response.choices.message.content);
console.log(response.compute_receipt);
```

## What you get back

When receipts are enabled, the response includes the model output plus receipt metadata you can inspect later.

```ts
console.log(response.compute_receipt.id);
console.log(response.compute_receipt.provider);
console.log(response.compute_receipt.tokens);
console.log(response.compute_receipt.costUsd);
```

## Authentication

Set your API key as an environment variable:

