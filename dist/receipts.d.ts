import { ComputeReceipt, ReceiptVerificationResponse, ReceiptPublicKey } from "./types";
export declare class ReceiptsResource {
    private readonly request;
    constructor(request: <T>(path: string, init?: RequestInit) => Promise<T>);
    /**
     * Fetch a receipt by ID.
     */
    get(receiptId: string): Promise<ComputeReceipt>;
    /**
     * Verify a receipt via the TurnstileAI API.
     * Returns structured verification result including signature and anchor status.
     */
    verify(receiptId: string): Promise<ReceiptVerificationResponse>;
    /**
     * List recent receipts with optional filters.
     */
    list(params?: {
        limit?: number;
        offset?: number;
        model?: string;
        provider?: string;
    }): Promise<ComputeReceipt[]>;
    /**
     * Fetch the Merkle inclusion proof for a receipt.
     * The proof can be used with verifyInclusionProof() for offline verification.
     */
    getInclusionProof(receiptId: string): Promise<InclusionProof>;
    /**
     * Fetch TurnstileAI public keys for offline signature verification.
     */
    getPublicKeys(): Promise<ReceiptPublicKey[]>;
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
//# sourceMappingURL=receipts.d.ts.map