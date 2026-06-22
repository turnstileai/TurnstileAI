import {
  ComputeReceipt,
  ReceiptVerificationResponse,
  OfflineVerificationResult,
  ReceiptPublicKey,
} from "./types";
import {
  TurnstileAIVerificationError,
} from "./errors";

export class ReceiptsResource {
  constructor(
    private readonly request: <T>(path: string, init?: RequestInit) => Promise<T>
  ) {}

  /**
   * Fetch a receipt by ID.
   */
  async get(receiptId: string): Promise<ComputeReceipt> {
    return this.request<ComputeReceipt>(`/receipts/${receiptId}`, {
      method: "GET",
    });
  }

  /**
   * Verify a receipt via the TurnstileAI API.
   * Returns structured verification result including signature and anchor status.
   */
  async verify(receiptId: string): Promise<ReceiptVerificationResponse> {
    const result = await this.request<ReceiptVerificationResponse>(
      `/receipts/${receiptId}/verify`,
      { method: "POST" }
    );

    if (result.status !== "verified" && result.signatureValid === false) {
      throw new TurnstileAIVerificationError(receiptId);
    }

    return result;
  }

  /**
   * List recent receipts with optional filters.
   */
  async list(params?: {
    limit?: number;
    offset?: number;
    model?: string;
    provider?: string;
  }): Promise<ComputeReceipt[]> {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.offset) qs.set("offset", String(params.offset));
    if (params?.model) qs.set("model", params.model);
    if (params?.provider) qs.set("provider", params.provider);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return this.request<ComputeReceipt[]>(`/receipts${suffix}`, {
      method: "GET",
    });
  }

  /**
   * Fetch the Merkle inclusion proof for a receipt.
   * The proof can be used with verifyInclusionProof() for offline verification.
   */
  async getInclusionProof(receiptId: string): Promise<InclusionProof> {
    return this.request<InclusionProof>(
      `/receipts/${receiptId}/proof`,
      { method: "GET" }
    );
  }

  /**
   * Fetch TurnstileAI public keys for offline signature verification.
   */
  async getPublicKeys(): Promise<ReceiptPublicKey[]> {
    return this.request<ReceiptPublicKey[]>("/keys", { method: "GET" });
  }
}

export interface InclusionProof {
  receiptId: string;
  receiptHash: string;
  leafIndex: number;
  batchId: string;
  batchRoot: string;
  proof: string[];
  anchorChain: "solana" | null;
  anchorTx: string | null;
  anchorSlot: number | null;
  anchoredAt: string | null;
}