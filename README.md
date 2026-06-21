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

```bash
export TURNSTILE_API_KEY=ts_live_xxx
```

Then create a client:

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});
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
```

## Receipts

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
  }
}
```

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
