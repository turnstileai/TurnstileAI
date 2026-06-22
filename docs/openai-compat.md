# OpenAI Compatibility

TurnstileAI works with an OpenAI-style request pattern.

In many cases, the main change is the base URL and API key.

## Example

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

console.log(response.choices.message.content);
console.log(response.compute_receipt);
```

## Why this helps

- Smaller migration effort.
- Familiar request shape.
- Easier testing with existing code patterns.
