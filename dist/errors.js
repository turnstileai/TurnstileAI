"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnstileAIVerificationError = exports.TurnstileAIAPIError = exports.TurnstileAIAuthError = exports.TurnstileAIError = void 0;
class TurnstileAIError extends Error {
    constructor(message) {
        super(message);
        this.name = "TurnstileAIError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.TurnstileAIError = TurnstileAIError;
class TurnstileAIAuthError extends TurnstileAIError {
    constructor(message = "Authentication failed") {
        super(message);
        this.name = "TurnstileAIAuthError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.TurnstileAIAuthError = TurnstileAIAuthError;
class TurnstileAIAPIError extends TurnstileAIError {
    constructor(statusCode, message = "API request failed") {
        super(message);
        this.name = "TurnstileAIAPIError";
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.TurnstileAIAPIError = TurnstileAIAPIError;
class TurnstileAIVerificationError extends TurnstileAIError {
    constructor(receiptId, message = "Receipt verification failed") {
        super(message);
        this.name = "TurnstileAIVerificationError";
        this.receiptId = receiptId;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.TurnstileAIVerificationError = TurnstileAIVerificationError;
