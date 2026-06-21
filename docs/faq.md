# FAQ

## What is TurnstileAI?

TurnstileAI is a gateway for verified AI inference. It routes requests and returns signed compute receipts.

## Does it replace model providers?

No. It sits in front of providers and adds routing and verification.

## Do I need to rewrite my app?

Not always. If you already use an OpenAI-style flow, the migration can stay simple.

## Why use receipts?

Receipts help you inspect cost, latency, provider choice, and verification status after a request completes.

## Is anchoring required?

No. Anchoring is optional.

## Is this useful for agents?

Yes. It can help when you want usage controls, auditability, or restricted keys.
