# Mock Mode

Mock mode is useful for local development and testing.

It lets you work without depending on a live backend for every step.

## Enable mock mode

```bash
export TURNSTILEAI_MOCK=true
```

## Example

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: "ts_test_local"
});
```

## Typical behavior

In mock mode, the SDK can return:

- Simulated completions.
- Test receipts.
- Predictable verification results.
- Fake anchor data for local workflows.

## When to use it

- Local development.
- SDK testing.
- UI flows that need stable responses.
