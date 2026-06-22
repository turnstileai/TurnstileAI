export declare class TurnstileAIError extends Error {
    constructor(message: string);
}
export declare class TurnstileAIAuthError extends TurnstileAIError {
    constructor(message?: string);
}
export declare class TurnstileAIAPIError extends TurnstileAIError {
    statusCode: number;
    constructor(statusCode: number, message?: string);
}
export declare class TurnstileAIVerificationError extends TurnstileAIError {
    receiptId: string;
    constructor(receiptId: string, message?: string);
}
