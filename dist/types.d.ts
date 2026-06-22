export interface TurnstileAIConfig {
    apiKey: string;
    baseURL?: string;
    defaultPolicy?: string;
    defaultAnchor?: string;
}
export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}
export interface ChatCompletionRequest {
    model: string;
    messages: ChatMessage[];
    extra_body?: {
        receipt?: boolean;
        policy?: string;
        anchor?: string;
    };
}
export interface ReceiptAnchor {
    chain: string;
    transactionId: string;
    explorerUrl?: string;
}
export interface ComputeReceipt {
    id: string;
    model: string;
    provider: string;
    tokens: number;
    latencySeconds: number;
    costUsd: number;
    promptHash?: string;
    responseHash?: string;
    signature: string;
    verified: boolean;
    anchor?: ReceiptAnchor | null;
}
export interface ChatCompletionChoice {
    message: {
        role: "assistant";
        content: string;
    };
}
export interface ChatCompletionResponse {
    choices: ChatCompletionChoice[];
    compute_receipt?: ComputeReceipt;
}
export interface ReceiptVerificationResponse {
    status: string;
    signatureValid: boolean;
    anchorMatched: boolean;
}
