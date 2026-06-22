"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsResource = void 0;
const errors_1 = require("./errors");
class ReceiptsResource {
    constructor(request) {
        this.request = request;
    }
    async get(id) {
        return this.request(`/receipts/${id}`, {
            method: "GET"
        });
    }
    async verify(id) {
        const result = await this.request(`/receipts/${id}/verify`, {
            method: "POST"
        });
        if (result.status !== "verified" && result.signatureValid === false) {
            throw new errors_1.TurnstileAIVerificationError(id);
        }
        return result;
    }
}
exports.ReceiptsResource = ReceiptsResource;
