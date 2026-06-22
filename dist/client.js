"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnstileAI = void 0;
const errors_1 = require("./errors");
const receipts_1 = require("./receipts");
class TurnstileAI {
    constructor(config) {
        this.chat = {
            completions: {
                create: async (body) => {
                    return this.request("/chat/completions", {
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
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || "https://api.turnstileai.com/v1";
        this.defaultPolicy = config.defaultPolicy;
        this.defaultAnchor = config.defaultAnchor;
        this.receipts = new receipts_1.ReceiptsResource(this.request.bind(this));
    }
    async request(path, init) {
        const response = await fetch(`${this.baseURL}${path}`, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
                ...(init?.headers || {})
            }
        });
        if (response.status === 401) {
            throw new errors_1.TurnstileAIAuthError("Invalid API key");
        }
        if (!response.ok) {
            throw new errors_1.TurnstileAIAPIError(response.status, `TurnstileAI API request failed with status ${response.status}`);
        }
        return response.json();
    }
}
exports.TurnstileAI = TurnstileAI;
