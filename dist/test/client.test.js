"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const client_1 = require("../client");
(0, node_test_1.default)("TurnstileAI client exposes chat", () => {
    const client = new client_1.TurnstileAI({
        apiKey: "ts_test_123"
    });
    strict_1.default.ok(client.chat);
});
(0, node_test_1.default)("TurnstileAI client exposes receipts", () => {
    const client = new client_1.TurnstileAI({
        apiKey: "ts_test_123"
    });
    strict_1.default.ok(client.receipts);
});
//# sourceMappingURL=client.test.js.map