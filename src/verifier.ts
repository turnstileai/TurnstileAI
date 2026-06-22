import type { ComputeReceipt, OfflineVerificationResult, ReceiptPublicKey } from "./types";
import type { InclusionProof } from "./receipts";

/**
 * The canonical fields that are signed by TurnstileAI for every receipt.
 * These are serialised deterministically before signing.
 */
export interface ReceiptSignaturePayload {
  createdAt: string;
  id: string;
  inputTokens: number;
  model: string;
  outputTokens: number;
  promptHash: string;
  provider: string;
  responseHash: string;
}

/**
 * Build the canonical deterministic string from a receipt that was signed.
 * Field order is fixed — any change breaks the signature.
 */
export function buildSignaturePayload(receipt: ComputeReceipt): string {
  const payload: ReceiptSignaturePayload = {
    createdAt: receipt.createdAt ?? "",
    id: receipt.id,
    inputTokens: receipt.inputTokens ?? receipt.tokens,
    model: receipt.model,
    outputTokens: receipt.outputTokens ?? 0,
    promptHash: receipt.promptHash ?? "",
    provider: receipt.provider,
    responseHash: receipt.responseHash ?? "",
  };

  // Keys are sorted alphabetically — order is already correct above
  return JSON.stringify(payload);
}

/**
 * Verify a receipt's Ed25519 signature offline using a known public key.
 *
 * Uses the Web Crypto API (browser + Node 18+).
 * The public key must be fetched from GET /keys or pinned in your app.
 *
 * @param receipt   - The ComputeReceipt to verify
 * @param publicKey - A ReceiptPublicKey from GET /keys matching receipt.keyId
 */
export async function verifyReceiptSignature(
  receipt: ComputeReceipt,
  publicKey: ReceiptPublicKey
): Promise<OfflineVerificationResult> {
  if (!receipt.signature) {
    return {
      valid: false,
      reason: "Receipt has no signature field.",
      receiptId: receipt.id,
      checkedAt: new Date().toISOString(),
    };
  }

  if (!receipt.keyId) {
    return {
      valid: false,
      reason: "Receipt has no keyId — cannot select the correct public key.",
      receiptId: receipt.id,
      checkedAt: new Date().toISOString(),
    };
  }

  if (publicKey.id !== receipt.keyId) {
    return {
      valid: false,
      reason: `Public key ID mismatch. Receipt uses keyId "${receipt.keyId}" but supplied key is "${publicKey.id}".`,
      receiptId: receipt.id,
      checkedAt: new Date().toISOString(),
    };
  }

  if (publicKey.status === "revoked") {
    return {
      valid: false,
      reason: `Public key "${publicKey.id}" has been revoked. Do not trust receipts signed with this key.`,
      receiptId: receipt.id,
      keyId: publicKey.id,
      checkedAt: new Date().toISOString(),
    };
  }

  try {
    const payload = buildSignaturePayload(receipt);
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);

    const keyBytes = base64UrlDecode(publicKey.publicKey);
    const sigBytes = base64UrlDecode(receipt.signature);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "Ed25519" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify("Ed25519", cryptoKey, sigBytes, data);

    return {
      valid,
      reason: valid ? "Signature verified." : "Signature is invalid.",
      receiptId: receipt.id,
      keyId: publicKey.id,
      payload,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      valid: false,
      reason: `Verification error: ${err instanceof Error ? err.message : String(err)}`,
      receiptId: receipt.id,
      checkedAt: new Date().toISOString(),
    };
  }
}

/**
 * Verify a Merkle inclusion proof for a receipt.
 *
 * Reconstructs the Merkle root from the leaf hash and proof path,
 * then checks it matches the batch root.
 *
 * @param proof - The InclusionProof from GET /receipts/:id/proof
 */
export async function verifyInclusionProof(
  proof: InclusionProof
): Promise<{ valid: boolean; computedRoot: string; expectedRoot: string; reason: string }> {
  try {
    let current = proof.receiptHash;

    for (let i = 0; i < proof.proof.length; i++) {
      const sibling = proof.proof[i];
      const isLeft = (proof.leafIndex >> i) % 2 === 0;
      const combined = isLeft
        ? await sha256Hex(current + sibling)
        : await sha256Hex(sibling + current);
      current = combined;
    }

    const valid = current === proof.batchRoot;

    return {
      valid,
      computedRoot: current,
      expectedRoot: proof.batchRoot,
      reason: valid
        ? "Inclusion proof verified. Receipt is in the batch."
        : `Computed root "${current}" does not match batch root "${proof.batchRoot}".`,
    };
  } catch (err) {
    return {
      valid: false,
      computedRoot: "",
      expectedRoot: proof.batchRoot,
      reason: `Proof verification error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function base64UrlDecode(input: string): Uint8Array {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}