import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  TurnstileAIConfig
} from "./types";
import {
  TurnstileAIAPIError,
  TurnstileAIAuthError
} from "./errors";
import { ReceiptsResource } from "./receipts";

export class TurnstileAI {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly defaultPolicy?: string;
  private readonly defaultAnchor?: string;

  readonly receipts: ReceiptsResource;

  constructor(config: TurnstileAIConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || "https://api.turnstileai.com/v1";
    this.defaultPolicy = config.defaultPolicy;
    this.defaultAnchor = config.defaultAnchor;
    this.receipts = new ReceiptsResource(this.request.bind(this));
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        ...(init?.headers || {})
      }
    });

    if (response.status === 401) {
      throw new TurnstileAIAuthError("Invalid API key");
    }

    if (!response.ok) {
      throw new TurnstileAIAPIError(
        response.status,
        `TurnstileAI API request failed with status ${response.status}`
      );
    }

    return response.json() as Promise<T>;
  }

  chat = {
    completions: {
      create: async (
        body: ChatCompletionRequest
      ): Promise<ChatCompletionResponse> => {
        return this.request<ChatCompletionResponse>("/chat/completions", {
          method: "POST",
          body: JSON.stringify({
            ...body,
            extra_body: {
              ...body.extra_body,
              policy: body.extra_body?.policy ?? this.defaultPolicy,
              anchor: body.extra_body?.anchor ?? this.defaultAnchor
            }
          })
        });
      }
    }
  };
}