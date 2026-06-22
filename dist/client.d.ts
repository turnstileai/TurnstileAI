import OpenAI from "openai";
import type { TurnstileConfig, ComputeReceipt, OfflineVerificationResult, ReceiptPublicKey, RunRecord, VerificationResult, ProviderHealth, UsageOverview } from "./types";
import type { InclusionProof } from "./receipts";
export declare class TurnstileAI {
    private readonly apiKey;
    private readonly baseURL;
    private readonly timeout;
    private readonly http;
    readonly chat: OpenAI["chat"];
    readonly completions: OpenAI["completions"];
    readonly models: OpenAI["models"];
    constructor(config: TurnstileConfig);
    receipts: {
        get: (receiptId: string) => Promise<ComputeReceipt>;
        verify: (receiptId: string) => Promise<OfflineVerificationResult>;
        getInclusionProof: (receiptId: string) => Promise<InclusionProof>;
        getPublicKeys: () => Promise<ReceiptPublicKey[]>;
    };
    records: {
        get: (recordId: string) => Promise<RunRecord>;
        list: (params?: {
            limit?: number;
            offset?: number;
            model?: string;
            provider?: string;
        }) => Promise<RunRecord[]>;
        verify: (recordId: string) => Promise<VerificationResult>;
    };
    providers: {
        list: () => Promise<ProviderHealth[]>;
        get: (providerId: string) => Promise<ProviderHealth>;
    };
    usage: {
        overview: (period?: "day" | "week" | "month") => Promise<UsageOverview>;
    };
    private request;
}
//# sourceMappingURL=client.d.ts.map