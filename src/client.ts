<<<<<<< HEAD
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
=======
import OpenAI from "openai";
import {
  TurnstileAuthError,
  TurnstileRequestError,
} from "./errors";
import type {
  TurnstileConfig,
  RunRecord,
  VerificationResult,
  ProviderHealth,
  UsageOverview,
} from "./types";

const DEFAULT_BASE_URL = "https://api.turnstileai.com/v1";

export class TurnstileAI {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly http: OpenAI;

  public readonly chat: OpenAI["chat"];
  public readonly completions: OpenAI["completions"];
  public readonly models: OpenAI["models"];

  constructor(config: TurnstileConfig) {
    if (!config.apiKey) {
      throw new TurnstileAuthError("Missing TurnstileAI API key.");
    }

    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL ?? DEFAULT_BASE_URL;
    this.timeout = config.timeout ?? 60000;

    this.http = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
      timeout: this.timeout,
      defaultHeaders: {
        "X-TurnstileAI-SDK": "@turnstileai/sdk",
      },
    });

    this.chat = this.http.chat;
    this.completions = this.http.completions;
    this.models = this.http.models;
  }

  public records = {
    get: async (recordId: string): Promise<RunRecord> => {
      return this.request<RunRecord>(`/records/${recordId}`);
    },

    list: async (params?: {
      limit?: number;
      offset?: number;
      model?: string;
      provider?: string;
    }): Promise<RunRecord[]> => {
      const qs = new URLSearchParams();
      if (params?.limit) qs.set("limit", String(params.limit));
      if (params?.offset) qs.set("offset", String(params.offset));
      if (params?.model) qs.set("model", params.model);
      if (params?.provider) qs.set("provider", params.provider);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return this.request<RunRecord[]>(`/records${suffix}`);
    },

    verify: async (recordId: string): Promise<VerificationResult> => {
      return this.request<VerificationResult>(`/records/${recordId}/verify`);
    },
  };

  public providers = {
    list: async (): Promise<ProviderHealth[]> => {
      return this.request<ProviderHealth[]>("/providers");
    },

    get: async (providerId: string): Promise<ProviderHealth> => {
      return this.request<ProviderHealth>(`/providers/${providerId}`);
    },
  };

  public usage = {
    overview: async (period: "day" | "week" | "month" = "month"): Promise<UsageOverview> => {
      return this.request<UsageOverview>(`/usage/overview?period=${period}`);
    },
  };

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseURL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "X-TurnstileAI-SDK": "@turnstileai/sdk",
        ...(init?.headers ?? {}),
      },
    });

    if (res.status === 401) {
      throw new TurnstileAuthError("Invalid or expired TurnstileAI API key.");
    }

    if (!res.ok) {
      let body: any = {};
      try {
        body = await res.json();
      } catch {}
      throw new TurnstileRequestError(
        body?.message ?? `Request failed with status ${res.status}`,
        res.status,
        body?.code
      );
    }

    return res.json() as Promise<T>;
  }
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c
}