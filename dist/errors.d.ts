export declare class TurnstileError extends Error {
    constructor(message: string);
}
export declare class TurnstileAuthError extends TurnstileError {
    constructor(message?: string);
}
export declare class TurnstileRequestError extends TurnstileError {
    statusCode: number;
    code?: string;
    constructor(message: string, statusCode: number, code?: string);
}
export declare class TurnstileVerificationError extends TurnstileError {
    recordId: string;
    constructor(message: string, recordId: string);
}
export declare class TurnstileAIError extends TurnstileError {
}
export declare class TurnstileAIAuthError extends TurnstileAuthError {
}
export declare class TurnstileAIAPIError extends TurnstileRequestError {
    constructor(statusCode: number, message?: string);
}
export declare class TurnstileAIVerificationError extends TurnstileVerificationError {
    receiptId: string;
    constructor(receiptId: string, message?: string);
}
//# sourceMappingURL=errors.d.ts.map