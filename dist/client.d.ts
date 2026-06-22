import { ChatCompletionRequest, ChatCompletionResponse, TurnstileAIConfig } from "./types";
import { ReceiptsResource } from "./receipts";
export declare class TurnstileAI {
    private readonly apiKey;
    private readonly baseURL;
    private readonly defaultPolicy?;
    private readonly defaultAnchor?;
    readonly receipts: ReceiptsResource;
    constructor(config: TurnstileAIConfig);
    private request;
    chat: {
        completions: {
            create: (body: ChatCompletionRequest) => Promise<ChatCompletionResponse>;
        };
    };
}
