"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnstileAIVerificationError = exports.TurnstileAIAPIError = exports.TurnstileAIAuthError = exports.TurnstileAIError = exports.TurnstileVerificationError = exports.TurnstileRequestError = exports.TurnstileAuthError = exports.TurnstileError = void 0;
// Base errors
class TurnstileError extends Error {
    constructor(message) {
        super(message);
        this.name = "TurnstileError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.TurnstileError = TurnstileError;
class TurnstileAuthError extends TurnstileError {
    constructor(message = "Authentication failed") {
        super(message);
        this.name = "TurnstileAuthError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.TurnstileAuthError = TurnstileAuthError;
class TurnstileRequestError extends TurnstileError {
    constructor(message, statusCode, code) {
        super(message);
        this.name = "TurnstileRequestError";
        this.statusCode = statusCode;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.TurnstileRequestError = TurnstileRequestError;
class TurnstileVerificationError extends TurnstileError {
    constructor(message, recordId) {
        super(message);
        this.name = "TurnstileVerificationError";
        this.recordId = recordId;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.TurnstileVerificationError = TurnstileVerificationError;
// Legacy aliases — kept for backward compatibility with existing SDK exports
class TurnstileAIError extends TurnstileError {
}
exports.TurnstileAIError = TurnstileAIError;
class TurnstileAIAuthError extends TurnstileAuthError {
}
exports.TurnstileAIAuthError = TurnstileAIAuthError;
class TurnstileAIAPIError extends TurnstileRequestError {
    constructor(statusCode, message = "API request failed") {
        super(message, statusCode);
        this.name = "TurnstileAIAPIError";
    }
}
exports.TurnstileAIAPIError = TurnstileAIAPIError;
class TurnstileAIVerificationError extends TurnstileVerificationError {
    constructor(receiptId, message = "Receipt verification failed") {
        super(message, receiptId);
        this.name = "TurnstileAIVerificationError";
        this.receiptId = receiptId;
    }
}
exports.TurnstileAIVerificationError = TurnstileAIVerificationError;
//# sourceMappingURL=errors.js.map