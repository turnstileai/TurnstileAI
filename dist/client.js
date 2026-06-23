"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnstileAI = void 0;
const openai_1 = __importDefault(require("openai"));
const errors_1 = require("./errors");
const DEFAULT_BASE_URL = "https://gateway.turnstileai.net/api";
const DEFAULT_MAX_RETRIES = 2;
const RETRYABLE_STATUSES = [429, 500, 502, 503, 504];
class TurnstileAI {
    constructor(config) {
        this.receipts = {
            get: async (receiptId) => {
                return this.request(`/receipts/${receiptId}`);
            },
            verify: async (receiptId) => {
                return this.request(`/receipts/${receiptId}/verify`, {
                    method: "POST"
                });
            },
            getInclusionProof: async (receiptId) => {
                return this.request(`/receipts/${receiptId}/proof`);
            },
            getPublicKeys: async () => {
                return this.request("/keys");
            }
        };
        this.records = {
            get: async (recordId) => {
                return this.request(`/records/${recordId}`);
            },
            list: async (params) => {
                const qs = new URLSearchParams();
                if (params?.limit)
                    qs.set("limit", String(params.limit));
                if (params?.offset)
                    qs.set("offset", String(params.offset));
                if (params?.model)
                    qs.set("model", params.model);
                if (params?.provider)
                    qs.set("provider", params.provider);
                const suffix = qs.toString() ? `?${qs.toString()}` : "";
                return this.request(`/records${suffix}`);
            },
            verify: async (recordId) => {
                return this.request(`/records/${recordId}/verify`);
            }
        };
        this.providers = {
            list: async () => {
                return this.request("/providers");
            },
            get: async (providerId) => {
                return this.request(`/providers/${providerId}`);
            }
        };
        this.usage = {
            overview: async (period = "month") => {
                return this.request(`/usage/overview?period=${period}`);
            }
        };
        if (!config.apiKey) {
            throw new errors_1.TurnstileAuthError("Missing TurnstileAI API key.");
        }
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL ?? DEFAULT_BASE_URL;
        this.timeout = config.timeout ?? 60000;
        this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
        this.http = new openai_1.default({
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
    async request(path, init, attempt = 0) {
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
            throw new errors_1.TurnstileAuthError("Invalid or expired TurnstileAI API key.");
        }
        if (!res.ok) {
            const shouldRetry = RETRYABLE_STATUSES.includes(res.status) && attempt < this.maxRetries;
            if (shouldRetry) {
                const delay = Math.pow(2, attempt) * 300;
                await new Promise((r) => setTimeout(r, delay));
                return this.request(path, init, attempt + 1);
            }
            let body = {};
            try {
                body = await res.json();
            }
            catch { }
            throw new errors_1.TurnstileRequestError(body?.message ?? `Request failed with status ${res.status}`, res.status, body?.code);
        }
        return res.json();
    }
}
exports.TurnstileAI = TurnstileAI;
//# sourceMappingURL=client.js.map