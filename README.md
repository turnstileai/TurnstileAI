# TurnstileAI SDK

<p align="left">
  <a href="https://www.npmjs.com/package/@turnstileai/sdk">
    <img src="https://img.shields.io/badge/npm-package-EAF4FF?style=for-the-badge&labelColor=D8EBFF&color=EAF4FF&logo=npm&logoColor=2563EB" alt="npm package" />
  </a>
  <a href="./docs/introduction.md">
    <img src="https://img.shields.io/badge/docs-available-EAF4FF?style=for-the-badge&labelColor=D8EBFF&color=EAF4FF&logo=gitbook&logoColor=2563EB" alt="docs available" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-EAF4FF?style=for-the-badge&labelColor=D8EBFF&color=EAF4FF&logo=open-source-initiative&logoColor=2563EB" alt="MIT license" />
  </a>
  <a href="https://github.com/turnstileai/TurnstileAI">
    <img src="https://img.shields.io/badge/open-source-EAF4FF?style=for-the-badge&labelColor=D8EBFF&color=EAF4FF&logo=github&logoColor=2563EB" alt="open source" />
  </a>
  <a href="https://github.com/turnstileai/TurnstileAI">
    <img src="https://img.shields.io/badge/TypeScript-SDK-EAF4FF?style=for-the-badge&labelColor=D8EBFF&color=EAF4FF&logo=typescript&logoColor=2563EB" alt="TypeScript SDK" />
  </a>
</p>

TypeScript SDK for TurnstileAI, focused on signed compute receipts, request integrity, and OpenAI-compatible client workflows.

Each compute receipt can include request and response hashes, model and provider metadata, usage data, TurnstileAI signatures, and optional inclusion proof data for independent verification.

## Why TurnstileAI

- Standardize AI request and receipt handling in one SDK.
- Verify signed compute receipts offline.
- Validate Merkle inclusion proofs for anchored batches.
- Keep a typed audit trail for agent and production workloads.
- Use an OpenAI-style integration pattern.

## Installation

```bash
npm install @turnstileai/sdk
```

## Requirements

- Node.js 18 or later.
- A valid TurnstileAI API key.

## Quick start

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});

const response = await client.chat.completions.create({
  model: "openai/gpt-4o-mini",
  messages: [
    { role: "user", content: "Explain receipt verification simply." }
  ],
  extra_body: {
    receipt: true,
    policy: "fastest",
    anchor: "solana"
  }
});

console.log(response.compute_receipt);
```

## Configuration

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!,
  baseURL: "https://gateway.turnstileai.net/api",
  defaultPolicy: "highest-reputation",
  defaultAnchor: "solana"
});
```

### Config options

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Your TurnstileAI API key. |
| `baseURL` | `string` | No | Override the default API base URL. |
| `defaultPolicy` | `string` | No | Default routing policy for requests. |
| `defaultAnchor` | `string` | No | Default anchor target for requests. |

## Verification

The SDK includes helpers for receipt verification and inclusion proof validation.

### Verify a receipt signature

```ts
import {
  verifyReceiptSignature,
  buildSignaturePayload
} from "@turnstileai/sdk";

const payload = buildSignaturePayload(receipt);
const result = await verifyReceiptSignature(receipt, publicKey);

console.log(payload);
console.log(result.valid);
```

### Verify an inclusion proof

```ts
import { verifyInclusionProof } from "@turnstileai/sdk";

const proof = await client.receipts.getInclusionProof(receiptId);
const result = await verifyInclusionProof(proof);

console.log(result.valid);
```

See `docs/receipt-spec.md` for the full verification format.

## Routing policies

TurnstileAI supports provider routing policies for different execution goals.

| Policy | Key | Use case |
|---|---|---|
| Cheapest | `cheapest` | Reduce cost |
| Fastest | `fastest` | Lower latency |
| Highest reputation | `highest-reputation` | Favor reliability |
| Private attested | `private-attested` | Restrict execution path |
| Fixed provider | `fixed-provider` | Force one provider |

Example:

```ts
await client.chat.completions.create({
  model: "openai/gpt-4o-mini",
  messages: [
    { role: "user", content: "Summarize this in five bullets." }
  ],
  extra_body: {
    receipt: true,
    policy: "fastest"
  }
});
```

## Receipts

The SDK includes a receipts resource for fetching and verifying compute receipts.

### Get a receipt

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});

const receipt = await client.receipts.get("rcpt_123");

console.log(receipt.id);
console.log(receipt.provider);
console.log(receipt.verified);
```

### Verify a receipt

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});

const result = await client.receipts.verify("rcpt_123");

console.log(result.status);
console.log(result.signatureValid);
console.log(result.anchorMatched);
```

## OpenAI compatibility

If you already use an OpenAI-style flow, the integration stays familiar.

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.TURNSTILE_API_KEY!,
  baseURL: "https://gateway.turnstileai.net/api"
});

const response = await client.chat.completions.create({
  model: "openrouter/llama-3.1-70b",
  messages: [
    { role: "user", content: "Explain receipt verification simply." }
  ],
  extra_body: {
    receipt: true,
    policy: "highest-reputation",
    anchor: "solana"
  }
});
```

## Mock mode

Mock mode is useful for local development and testing.

```bash
export TURNSTILEAI_MOCK=true
```

```ts
const client = new TurnstileAI({
  apiKey: "ts_test_local"
});
```

## Error handling

```ts
import {
  TurnstileAI,
  TurnstileAIAuthError,
  TurnstileAIAPIError,
  TurnstileAIVerificationError
} from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});

try {
  await client.receipts.verify("rcpt_123");
} catch (err) {
  if (err instanceof TurnstileAIAuthError) {
    console.error("Authentication failed:", err.message);
  } else if (err instanceof TurnstileAIAPIError) {
    console.error(`API error ${err.statusCode}: ${err.message}`);
  } else if (err instanceof TurnstileAIVerificationError) {
    console.error(`Verification failed for ${err.receiptId}: ${err.message}`);
  } else if (err instanceof Error) {
    console.error("Unknown error:", err.message);
  }
}
```

## Public API

The package exports:

- `TurnstileAI`
- `ReceiptsResource`
- `TurnstileAIError`
- `TurnstileAIAuthError`
- `TurnstileAIAPIError`
- `TurnstileAIVerificationError`

It also exports these types:

- `TurnstileAIConfig`
- `ChatMessage`
- `ChatCompletionRequest`
- `ChatCompletionResponse`
- `ChatCompletionChoice`
- `ComputeReceipt`
- `ReceiptAnchor`
- `ReceiptVerificationResponse`

## Development

Build the package:

```bash
npm run build
```

Preview what npm will publish:

```bash
npm publish --dry-run
```

## License

MIT