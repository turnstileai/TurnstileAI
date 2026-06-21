#!/usr/bin/env node

import { TurnstileAI } from "./client";
import { TurnstileAuthError, TurnstileRequestError } from "./errors";

const args: string[] = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];

function readKey(): string {
  const inline = args.find((arg: string) => arg.startsWith("--key="));
  if (inline) return inline.replace("--key=", "");
  if (process.env.TURNSTILEAI_API_KEY) return process.env.TURNSTILEAI_API_KEY;

  console.error("Missing API key. Use --key=ts_... or set TURNSTILEAI_API_KEY");
  process.exit(1);
}

function help() {
  console.log(`
turnstileai <command>

Commands:
  auth check
  record get <id>
  record list
  record verify <id>
  providers list
  usage overview

Examples:
  turnstileai auth check --key=ts_live_xxx
  turnstileai record verify rr_123 --key=ts_live_xxx
  turnstileai usage overview
`);
}

async function main() {
  if (!command || command === "--help" || command === "-h") {
    help();
    return;
  }

  const apiKey = readKey();
  const client = new TurnstileAI({ apiKey });

  try {
    if (command === "auth" && subcommand === "check") {
      console.log("Authentication ok");
      return;
    }

    if (command === "record" && subcommand === "get") {
      const id = args[2];
      if (!id) {
        console.error("Usage: turnstileai record get <id>");
        process.exit(1);
      }
      const record = await client.records.get(id);
      console.log(JSON.stringify(record, null, 2));
      return;
    }

    if (command === "record" && subcommand === "list") {
      const records = await client.records.list({ limit: 10 });
      for (const item of records) {
        console.log(
          `${item.id}  ${item.model}  ${item.provider}  ${item.totalTokens} tokens  $${item.costUsd.toFixed(5)}`
        );
      }
      return;
    }

    if (command === "record" && subcommand === "verify") {
      const id = args[2];
      if (!id) {
        console.error("Usage: turnstileai record verify <id>");
        process.exit(1);
      }
      const result = await client.records.verify(id);
      console.log(`signature: ${result.signatureOk}`);
      console.log(`digest: ${result.digestOk}`);
      console.log(`ledger: ${result.ledgerOk}`);
      console.log(`status: ${result.status}`);
      console.log(result.message);
      return;
    }

    if (command === "providers" && subcommand === "list") {
      const providers = await client.providers.list();
      for (const p of providers) {
        console.log(
          `${p.label}  ${p.trustTier}  ${p.uptimePercent}% uptime  ${p.avgLatencyMs}ms`
        );
      }
      return;
    }

    if (command === "usage" && subcommand === "overview") {
      const usage = await client.usage.overview("month");
      console.log(JSON.stringify(usage, null, 2));
      return;
    }

    help();
  } catch (err) {
    if (err instanceof TurnstileAuthError) {
      console.error(`Auth error: ${err.message}`);
      process.exit(1);
    }

    if (err instanceof TurnstileRequestError) {
      console.error(`Request error ${err.statusCode}: ${err.message}`);
      process.exit(1);
    }

    console.error(String(err));
    process.exit(1);
  }
}

main();