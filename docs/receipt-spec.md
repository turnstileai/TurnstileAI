\# Receipt Verification Spec



This document describes how TurnstileAI signs compute receipts and how to verify them offline.



\## Signature Payload



Every receipt is signed over a deterministic JSON string. The fields are fixed in alphabetical order:



```json

{

&#x20; "createdAt": "<ISO 8601 timestamp>",

&#x20; "id": "<receipt UUID>",

&#x20; "inputTokens": <number>,

&#x20; "model": "<model identifier>",

&#x20; "outputTokens": <number>,

&#x20; "promptHash": "<sha256 hex of the prompt>",

&#x20; "provider": "<provider name>",

&#x20; "responseHash": "<sha256 hex of the response>"

}

```



The payload is serialised with `JSON.stringify()` — no pretty-printing, no trailing newline. Field order is fixed. Any deviation produces a different payload and will fail signature verification.



\## Signing Algorithm



Receipts are signed with \*\*Ed25519\*\*. The signature is base64url-encoded and stored in `receipt.signature`. The key ID used for signing is stored in `receipt.keyId`.



\## Verifying a Signature



1\. Fetch the matching public key from `GET /keys` using `receipt.keyId`.

2\. Build the canonical payload string with `buildSignaturePayload(receipt)`.

3\. Decode the public key and signature from base64url.

4\. Verify with `crypto.subtle.verify("Ed25519", ...)`.



Use the SDK helper:



```ts

import { verifyReceiptSignature, getPublicKeys } from "turnstileai";



const keys = await client.receipts.getPublicKeys();

const key = keys.find(k => k.id === receipt.keyId);



const result = await verifyReceiptSignature(receipt, key);

console.log(result.valid); // true

```



\## Inclusion Proofs



Every receipt is committed to a Merkle tree. The batch root is published on-chain. You can verify a receipt is included in a batch without trusting TurnstileAI servers.



\### Proof Structure



```ts

{

&#x20; receiptHash: string;  // SHA-256 of the canonical receipt JSON

&#x20; leafIndex: number;    // Position in the Merkle tree

&#x20; proof: string\[];      // Sibling hashes from leaf to root

&#x20; batchRoot: string;    // Expected Merkle root

&#x20; batchId: string;

}

```



\### Verification Algorithm



Starting from the leaf hash, walk up the tree:

for each sibling at level i:

if leafIndex bit i is 0: current = sha256(current + sibling)

if leafIndex bit i is 1: current = sha256(sibling + current)



If the final `current` matches `batchRoot`, the receipt is in the batch.



Use the SDK helper:



```ts

import { verifyInclusionProof } from "turnstileai";



const proof = await client.receipts.getInclusionProof(receiptId);

const result = await verifyInclusionProof(proof);

console.log(result.valid); // true

```



\## Key Rotation



Public keys have a `status` field: `"active"` or `"revoked"`. Always check the status before trusting a verification result. Revoked keys must not be used — even if the signature is mathematically valid.



