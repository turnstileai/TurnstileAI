# Quickstart

This guide gets you from install to first request quickly.

## 1. Install the SDK

```bash
npm install @turnstileai/sdk
```

## 2. Set your API key

```bash
export TURNSTILE_API_KEY=ts_live_xxx
```

## 3. Create a client

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});
```

## 4. Send a request

```ts
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

## 5. Read the receipt

```ts
console.log(response.compute_receipt.id);
console.log(response.compute_receipt.provider);
console.log(response.compute_receipt.tokens);
console.log(response.compute_receipt.costUsd);
```

## 6. Verify later

```ts
const result = await client.receipts.verify("rcpt_123");

console.log(result.status);
```
