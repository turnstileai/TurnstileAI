# Error Handling

The SDK can expose different error types so you can handle failures clearly.

## Example

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

## Good practice

- Handle auth errors separately.
- Log verification failures clearly.
- Show user-facing errors in a clean format.
- Avoid swallowing provider or network errors silently.
