# Routing Policies

TurnstileAI can route requests using different policies.

## Common policies

| Policy | Key | Purpose |
|---|---|---|
| Cheapest | `cheapest` | Lowest estimated cost |
| Fastest | `fastest` | Lowest latency |
| Highest reputation | `highest-reputation` | More trusted providers |
| Private attested | `private-attested` | Restricted private paths |
| Fixed provider | `fixed-provider` | Force a chosen provider |

## Set a default policy

```ts
const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!,
  defaultPolicy: "highest-reputation"
});
```

## Override per request

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

## When to use each one

- Use `cheapest` for cost-sensitive workloads.
- Use `fastest` for low-latency flows.
- Use `highest-reputation` when reliability matters most.
- Use `fixed-provider` when you need strict control.
