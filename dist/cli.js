#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const errors_1 = require("./errors");
const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];
function readKey() {
    const inline = args.find((arg) => arg.startsWith("--key="));
    if (inline)
        return inline.replace("--key=", "");
    if (process.env.TURNSTILEAI_API_KEY)
        return process.env.TURNSTILEAI_API_KEY;
    if (process.env.TURNSTILE_API_KEY)
        return process.env.TURNSTILE_API_KEY;
    console.error("Missing API key. Use --key=ts_... or set TURNSTILEAI_API_KEY");
    process.exit(1);
}
function help() {
    console.log(`
turnstileai <command>

Commands:
  auth check
  receipt get <id>
  receipt verify <id>
  providers list
  usage overview

Examples:
  turnstileai auth check --key=ts_live_xxx
  turnstileai receipt verify rcpt_123 --key=ts_live_xxx
  turnstileai usage overview
`);
}
async function main() {
    if (!command || command === "--help" || command === "-h") {
        help();
        return;
    }
    const apiKey = readKey();
    const client = new client_1.TurnstileAI({ apiKey });
    try {
        if (command === "auth" && subcommand === "check") {
            console.log("Authentication ok");
            return;
        }
        if (command === "receipt" && subcommand === "get") {
            const id = args[2];
            if (!id) {
                console.error("Usage: turnstileai receipt get <id>");
                process.exit(1);
            }
            const receipt = await client.receipts.get(id);
            console.log(JSON.stringify(receipt, null, 2));
            return;
        }
        if (command === "receipt" && subcommand === "verify") {
            const id = args[2];
            if (!id) {
                console.error("Usage: turnstileai receipt verify <id>");
                process.exit(1);
            }
            const result = await client.receipts.verify(id);
            console.log(`status: ${result.status}`);
            console.log(`signatureValid: ${result.signatureValid}`);
            console.log(`anchorMatched: ${result.anchorMatched}`);
            return;
        }
        if (command === "providers" && subcommand === "list") {
            const providers = await client.providers.list();
            for (const p of providers) {
                console.log(`${p.label}  ${p.trustTier}  ${p.uptimePercent}% uptime  ${p.avgLatencyMs}ms`);
            }
            return;
        }
        if (command === "usage" && subcommand === "overview") {
            const usage = await client.usage.overview("month");
            console.log(JSON.stringify(usage, null, 2));
            return;
        }
        help();
    }
    catch (err) {
        if (err instanceof errors_1.TurnstileAuthError) {
            console.error(`Auth error: ${err.message}`);
            process.exit(1);
        }
        if (err instanceof errors_1.TurnstileRequestError) {
            console.error(`Request error ${err.statusCode}: ${err.message}`);
            process.exit(1);
        }
        console.error(String(err));
        process.exit(1);
    }
}
main();
//# sourceMappingURL=cli.js.map