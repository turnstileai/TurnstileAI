"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsResource = void 0;
const errors_1 = require("./errors");
class ReceiptsResource {
    constructor(request) {
        this.request = request;
    }
    /**
     * Fetch a receipt by ID.
     */
    async get(receiptId) {
        return this.request(`/receipts/${receiptId}`, {
            method: "GET",
        });
    }
    /**
     * Verify a receipt via the TurnstileAI API.
     * Returns structured verification result including signature and anchor status.
     */
    async verify(receiptId) {
        const result = await this.request(`/receipts/${receiptId}/verify`, { method: "POST" });
        if (result.status !== "verified" && result.signatureValid === false) {
            throw new errors_1.TurnstileAIVerificationError(receiptId);
        }
        return result;
    }
    /**
     * List recent receipts with optional filters.
     */
    async list(params) {
        const qs = new URLSearchParams();
        if (params?.limit)
            qs.set("limit", String(params.limit));
        if (params?.offset)
            qs.set("offset", String(params.offset));
        if (params?.model)
            qs.set("model", params.model);
        if (params?.provider)
            qs.set("provider", params.provider);
        const suffix = qs.toString() ? `?${qs.toString()}` : "";
        return this.request(`/receipts${suffix}`, {
            method: "GET",
        });
    }
    /**
     * Fetch the Merkle inclusion proof for a receipt.
     * The proof can be used with verifyInclusionProof() for offline verification.
     */
    async getInclusionProof(receiptId) {
        return this.request(`/receipts/${receiptId}/proof`, { method: "GET" });
    }
    /**
     * Fetch TurnstileAI public keys for offline signature verification.
     */
    async getPublicKeys() {
        return this.request("/keys", { method: "GET" });
    }
}
exports.ReceiptsResource = ReceiptsResource;
//# sourceMappingURL=receipts.js.map