import OpenAI from "openai";
import {
  TurnstileAuthError,
  TurnstileRequestError,
} from "./errors";
import type {
  TurnstileConfig,
  ComputeReceipt,
  OfflineVerificationResult,
  ReceiptPublicKey,
  RunRecord,
  VerificationResult,
  ProviderHealth,
  UsageOverview
} from "./types";
import type { InclusionProof } from "./receipts";

const DEFAULT_BASE_URL = "https://gateway.turnstileai.net/api";
const DEFAULT_MAX_RETRIES = 2;
const RETRYABLE_STATUSES = [429, 500, 502, 503, 504];

export class TurnstileAI {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
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
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;

    this.http = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      defaultHeaders: {
        "X-TurnstileAI-SDK": "@turnstileai/sdk",
      },
    });

    this.chat = this.http.chat;
    this.completions = this.http.completions;
    this.models = this.http.models;
  }

  public receipts = {
    get: async (receiptId: string): Promise<ComputeReceipt> => {
      return this.request<ComputeReceipt>(`/receipts/${receiptId}`);
    },

    verify: async (receiptId: string): Promise<OfflineVerificationResult> => {
      return this.request<OfflineVerificationResult>(`/receipts/${receiptId}/verify`, {
        method: "POST"
      });
    },

    getInclusionProof: async (receiptId: string): Promise<InclusionProof> => {
      return this.request<InclusionProof>(`/receipts/${receiptId}/proof`);
    },

    getPublicKeys: async (): Promise<ReceiptPublicKey[]> => {
      return this.request<ReceiptPublicKey[]>("/keys");
    }
  };

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
    }
  };

  public providers = {
    list: async (): Promise<ProviderHealth[]> => {
      return this.request<ProviderHealth[]>("/providers");
    },

    get: async (providerId: string): Promise<ProviderHealth> => {
      return this.request<ProviderHealth>(`/providers/${providerId}`);
    }
  };

  public usage = {
    overview: async (
      period: "day" | "week" | "month" = "month"
    ): Promise<UsageOverview> => {
      return this.request<UsageOverview>(`/usage/overview?period=${period}`);
    }
  };

  private async request<T>(
    path: string,
    init?: RequestInit,
    attempt = 0
  ): Promise<T> {
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
      const shouldRetry =
        RETRYABLE_STATUSES.includes(res.status) && attempt < this.maxRetries;

      if (shouldRetry) {
        const delay = Math.pow(2, attempt) * 300;
        await new Promise((r) => setTimeout(r, delay));
        return this.request<T>(path, init, attempt + 1);
      }

      let body: any = {};
      try { body = await res.json(); } catch {}

      throw new TurnstileRequestError(
        body?.message ?? `Request failed with status ${res.status}`,
        res.status,
        body?.code
      );
    }

    return res.json() as Promise<T>;
  }
}