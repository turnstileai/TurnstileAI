#!/usr/bin/env node

import { TurnstileAI } from "./client";
import {
  TurnstileAIAPIError,
  TurnstileAIAuthError,
  TurnstileAIVerificationError
} from "./errors";

async function main() {
  const apiKey = process.env.TURNSTILE_API_KEY;

  if (!apiKey) {
    console.error("Missing TURNSTILE_API_KEY");
    process.exit(1);
  }

  const client = new TurnstileAI({ apiKey });
  const args = process.argv.slice(2);
  const command = args[0];
  const id = args[1];

  try {
    if (command === "receipt:get") {
      if (!id) {
        console.error("Usage: turnstileai receipt:get <receiptId>");
        process.exit(1);
      }

      const receipt = await client.receipts.get(id);
      console.log(JSON.stringify(receipt, null, 2));
      return;
    }

    if (command === "receipt:verify") {
      if (!id) {
        console.error("Usage: turnstileai receipt:verify <receiptId>");
        process.exit(1);
      }

      const result = await client.receipts.verify(id);
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    console.log("TurnstileAI CLI");
    console.log("");
    console.log("Commands:");
    console.log("  receipt:get <receiptId>");
    console.log("  receipt:verify <receiptId>");
  } catch (err: unknown) {
    if (err instanceof TurnstileAIAuthError) {
      console.error(`Auth error: ${err.message}`);
      process.exit(1);
    }

    if (err instanceof TurnstileAIAPIError) {
      console.error(`API error ${err.statusCode}: ${err.message}`);
      process.exit(1);
    }

    if (err instanceof TurnstileAIVerificationError) {
      console.error(`Verification error for receipt ${err.receiptId}: ${err.message}`);
      process.exit(1);
    }

    if (err instanceof Error) {
      console.error(`Unknown error: ${err.message}`);
      process.exit(1);
    }

    console.error("Unknown non-error thrown");
    process.exit(1);
  }
}

main();