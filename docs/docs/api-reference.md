# API Reference

This page gives a short overview of the main SDK surfaces.

## Client

```ts
const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!,
  defaultPolicy: "cheapest",
  defaultAnchor: "none"
});
```

## Chat completions

```ts
await client.chat.completions.create({
  model: "openai/gpt-4o-mini",
  messages: [
    { role: "user", content: "Hello" }
  ],
  extra_body: {
    receipt: true,
    policy: "fastest",
    anchor: "solana"
  }
});
```

## Receipts

```ts
await client.receipts.get("rcpt_123");
await client.receipts.verify("rcpt_123");
```

## Main areas

- `client.chat.completions.create(...)`
- `client.receipts.get(...)`
- `client.receipts.verify(...)`
