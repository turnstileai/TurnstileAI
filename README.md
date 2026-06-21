# TurnstileAI

<p align="center">
  <strong>A verification-first AI gateway for trustable completions, receipts, and on-chain proof.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solana-Built%20on%20Solana-6EC1FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Verification-First-FFFFFF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Early%20Build-8FD3FF?style=for-the-badge" />
</p>

## Overview

TurnstileAI is a Solana-based verification layer for AI inference. It is designed to make model outputs easier to inspect, verify, and trust through receipts, proof-aware routing, and audit-friendly records.

## Features

- Verification-first AI request flow.
- Receipt-oriented inference responses.
- Solana-compatible on-chain proof direction.
- Provider-aware routing and record visibility.
- SDK and gateway architecture designed for integration into real apps.

## Why it matters

Most AI products return output without giving developers a clean way to verify where it came from or how it was produced. TurnstileAI is built to add a stronger trust layer around inference.

## Quickstart

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILEAI_API_KEY!
});

const result = await client.chat({
  model: "openrouter/llama-3.1-70b",
  messages: [
    { role: "user", content: "Explain zero-knowledge rollups simply." }
  ],
  receipt: true,
  anchor: "solana"
});

console.log(result.output);
console.log(result.record);
console.log(result.verification);
```

## Core ideas

- Trustable completions.
- Verification receipts.
- On-chain proof pathways.
- Better auditability for AI outputs.
- Developer-first integration flow.

## Roadmap

- SDK expansion.
- Gateway refinement.
- Stronger proof and receipt flows.
- Better verification UX.
- More complete docs and examples.

## Repository

- npm package: `@turnstileai/sdk`
- GitHub: [turnstileai/TurnstileAI](https://github.com/turnstileai/TurnstileAI)

## License

MIT
