import OpenAI from "openai";
import type { TurnstileConfig, RunRecord, VerificationResult, ProviderHealth, UsageOverview } from "./types";
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
        get: (receiptId: string) => Promise<RunRecord>;
        verify: (receiptId: string) => Promise<VerificationResult>;
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