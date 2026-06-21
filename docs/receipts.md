# Compute Receipts

A compute receipt is a signed record of a request.

You get one when `receipt: true` is included in the request body.

## Common fields

| Field | Description |
|---|---|
| `id` | Receipt ID |
| `timestamp` | Completion time |
| `model` | Model used |
| `provider` | Provider used |
| `tokens` | Total tokens |
| `latencySeconds` | Request latency |
| `costUsd` | Estimated cost |
| `promptHash` | Hash of prompt payload |
| `responseHash` | Hash of response payload |
| `signature` | Signature over receipt data |
| `anchor` | Optional anchor data |
| `verified` | Verification status |

## Example

```ts
const response = await client.chat.completions.create({
  model: "openai/gpt-4o-mini",
  messages: [
    { role: "user", content: "Hello" }
  ],
  extra_body: {
    receipt: true
  }
});

console.log(response.compute_receipt);
```

## Retrieve a receipt

```ts
const receipt = await client.receipts.get("rcpt_123");
```

## Verify a receipt

```ts
const result = await client.receipts.verify("rcpt_123");

console.log(result.signatureValid);
console.log(result.status);
```
