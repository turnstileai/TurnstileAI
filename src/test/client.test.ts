import test from "node:test";
import assert from "node:assert/strict";
import { TurnstileAI } from "../client";

test("TurnstileAI client exposes chat", () => {
  const client = new TurnstileAI({
    apiKey: "ts_test_123"
  });

  assert.ok(client.chat);
});

test("TurnstileAI client exposes receipts", () => {
  const client = new TurnstileAI({
    apiKey: "ts_test_123"
  });

  assert.ok(client.receipts);
});