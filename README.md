# TurnstileAI SDK

<<<<<<< HEAD
TypeScript SDK for verified AI inference, routing, and signed compute receipts.

Each receipt can include a verifiable request hash, response hash, model/provider metadata, TurnstileAI signature, and optional on-chain inclusion proof so anyone can independently check integrity after the call.

## Installation
=======
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

TypeScript SDK for TurnstileAI.

TurnstileAI routes AI requests, records execution details, and returns signed compute receipts so you can inspect what happened after each call.

## Why use TurnstileAI

- Route requests across providers.
- Get signed receipts with model, provider, usage, latency, and cost.
- Apply routing policies for speed, cost, or reliability.
- Keep an audit trail for agents and production workloads.
- Use an OpenAI-style integration pattern.

## Install
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c

```bash
npm install @turnstileai/sdk
```

<<<<<<< HEAD
## Requirements

- Node.js 18 or later.
- A valid TurnstileAI API key.

=======
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c
## Quick start

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});

const response = await client.chat.completions.create({
<<<<<<< HEAD
  model: "openai/gpt-4o-mini",
  messages: [
    { role: "user", content: "Explain receipt verification simply." }
  ],
  extra_body: {
    receipt: true,
    policy: "fastest",
=======
  model: "openrouter/llama-3.1-70b",
  messages: [
    { role: "user", content: "Explain Solana finality simply." }
  ],
  extra_body: {
    receipt: true,
    policy: "cheapest",
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c
    anchor: "solana"
  }
});

console.log(response.choices.message.content);
console.log(response.compute_receipt);
```

<<<<<<< HEAD
## Configuration

Create a client with your API key:

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!,
  baseURL: "https://api.turnstileai.com/v1",
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

## Chat completions

Use the client to send chat completion requests.
=======
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

```bash
export TURNSTILE_API_KEY=ts_live_xxx
```

Then create a client:
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});
<<<<<<< HEAD

const response = await client.chat.completions.create({
  model: "openai/gpt-4o-mini",
  messages: [
    { role: "system", content: "You are concise." },
    { role: "user", content: "Summarize Solana finality in 3 bullet points." }
  ],
  extra_body: {
    receipt: true
  }
});

console.log(response.choices.message.content);
console.log(response.compute_receipt?.id);
=======
```

## Routing policies

TurnstileAI can choose providers using different policies.

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
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c
```

## Receipts

<<<<<<< HEAD
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
=======
A compute receipt is a signed record of a request.

Typical fields include:

- Receipt ID.
- Model.
- Provider.
- Token usage.
- Latency.
- Cost.
- Prompt hash.
- Response hash.
- Signature.
- Optional anchor data.
- Verification status.

Retrieve and verify a receipt later:

```ts
const receipt = await client.receipts.get("rcpt_123");
const result = await client.receipts.verify("rcpt_123");

console.log(result.status);
```

## OpenAI compatibility

If you already use an OpenAI-style flow, the integration can stay familiar.

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.TURNSTILE_API_KEY!,
  baseURL: "https://api.turnstileai.com/v1"
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
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c
```

## Error handling

<<<<<<< HEAD
The SDK exports custom error classes so you can handle failures cleanly.

=======
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c
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
<<<<<<< HEAD
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
=======
  const response = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "user", content: "Give me a concise answer." }
    ]
  });
} catch (err) {
  if (err instanceof TurnstileAIAuthError) {
    console.error("Invalid API key");
  } else if (err instanceof TurnstileAIAPIError) {
    console.error(`API error ${err.statusCode}: ${err.message}`);
  } else if (err instanceof TurnstileAIVerificationError) {
    console.error(`Verification failed for receipt ${err.receiptId}`);
  } else {
    console.error("Unknown error", err);
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c
  }
}
```

<<<<<<< HEAD
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

## CLI

If you wire the CLI into your published package later, the current commands are designed around receipt lookup and verification:

```bash
turnstileai receipt:get <receiptId>
turnstileai receipt:verify <receiptId>
```

Set your API key before using the CLI:

```bash
export TURNSTILE_API_KEY=your_key_here
```

On Windows Command Prompt:

```cmd
set TURNSTILE_API_KEY=your_key_here
```

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
=======
## Documentation

- [Introduction](./docs/introduction.md)
- [Quickstart](./docs/quickstart.md)
- [Authentication](./docs/authentication.md)
- [Routing Policies](./docs/routing.md)
- [Compute Receipts](./docs/receipts.md)
- [OpenAI Compatibility](./docs/openai-compat.md)
- [Mock Mode](./docs/mock-mode.md)
- [Error Handling](./docs/errors.md)
- [CLI](./docs/cli.md)
- [API Reference](./docs/api-reference.md)
- [Architecture](./docs/architecture.md)
- [FAQ](./docs/faq.md)

## API overview

Main SDK areas:

- `client.chat.completions.create(...)`
- `client.receipts.get(...)`
- `client.receipts.verify(...)`

## CLI

```bash
npx turnstileai receipts verify rcpt_123 --key=ts_live_xxx
npx turnstileai receipts get rcpt_123 --key=ts_live_xxx
npx turnstileai providers list --key=ts_live_xxx
npx turnstileai usage overview --key=ts_live_xxx
```

## Notes

- Keep production keys out of source control.
- Use test keys for development.
- Use receipts when you want better auditability.
- Use GitHub for the full docs set, and let this README point to them.

## License

MIT
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c
