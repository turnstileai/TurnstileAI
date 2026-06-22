#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const verifier_1 = require("./verifier");
function parseArgs(argv) {
    const command = [];
    const flags = {};
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--json") {
            flags.json = true;
            continue;
        }
        if (arg === "--api-key") {
            flags.apiKey = argv[i + 1];
            i++;
            continue;
        }
        if (arg === "--base-url") {
            flags.baseURL = argv[i + 1];
            i++;
            continue;
        }
        command.push(arg);
    }
    return { command, flags };
}
function getApiKey(flags) {
    return flags.apiKey || process.env.TURNSTILE_API_KEY || "";
}
function printJson(data) {
    console.log(JSON.stringify(data, null, 2));
}
function printUsage() {
    console.log(`
TurnstileAI CLI

Usage:
  turnstileai receipts get <receiptId> [--api-key KEY] [--base-url URL] [--json]
  turnstileai receipts proof <receiptId> [--api-key KEY] [--base-url URL] [--json]
  turnstileai receipts verify <receiptId> [--api-key KEY] [--base-url URL] [--json]
  turnstileai keys list [--api-key KEY] [--base-url URL] [--json]
`);
}
async function main() {
    const { command, flags } = parseArgs(process.argv.slice(2));
    if (command.length === 0) {
        printUsage();
        process.exit(1);
    }
    const apiKey = getApiKey(flags);
    const client = new client_1.TurnstileAI({
        apiKey,
        ...(flags.baseURL ? { baseURL: flags.baseURL } : {}),
    });
    const [resource, action, id] = command;
    try {
        if (resource === "receipts" && action === "get" && id) {
            const receipt = await client.receipts.get(id);
            if (flags.json)
                return printJson(receipt);
            console.log(`Receipt: ${receipt.id}`);
            console.log(`Provider: ${receipt.provider}`);
            console.log(`Model: ${receipt.model}`);
            console.log(`Verified: ${String(receipt.verified)}`);
            return;
        }
        if (resource === "receipts" && action === "proof" && id) {
            const proof = await client.receipts.getInclusionProof(id);
            if (flags.json)
                return printJson(proof);
            console.log(`Receipt: ${id}`);
            console.log(`Batch ID: ${proof.batchId}`);
            console.log(`Leaf Index: ${proof.leafIndex}`);
            console.log(`Batch Root: ${proof.batchRoot}`);
            console.log(`Proof Length: ${proof.proof.length}`);
            return;
        }
        if (resource === "receipts" && action === "verify" && id) {
            const receipt = await client.receipts.get(id);
            const proof = await client.receipts.getInclusionProof(id);
            const keys = await client.receipts.getPublicKeys();
            const publicKey = keys.find((k) => k.id === receipt.keyId);
            if (!publicKey) {
                throw new Error(`No public key found for keyId: ${receipt.keyId}`);
            }
            const signature = await (0, verifier_1.verifyReceiptSignature)(receipt, publicKey);
            const inclusion = await (0, verifier_1.verifyInclusionProof)(proof);
            const result = {
                receiptId: receipt.id,
                keyId: receipt.keyId,
                signatureValid: signature.valid,
                inclusionValid: inclusion.valid,
                verified: signature.valid && inclusion.valid,
                signatureReason: signature.reason,
                inclusionReason: inclusion.reason,
            };
            if (flags.json)
                return printJson(result);
            console.log(`Receipt: ${result.receiptId}`);
            console.log(`Key ID: ${result.keyId}`);
            console.log(`Signature: ${result.signatureValid ? "valid" : "invalid"}`);
            console.log(`Inclusion Proof: ${result.inclusionValid ? "valid" : "invalid"}`);
            console.log(`Verified: ${result.verified ? "yes" : "no"}`);
            return;
        }
        if (resource === "keys" && action === "list") {
            const keys = await client.receipts.getPublicKeys();
            if (flags.json)
                return printJson(keys);
            for (const key of keys) {
                console.log(`${key.id}  ${key.status}  ${key.algorithm}`);
            }
            return;
        }
        printUsage();
        process.exit(1);
    }
    catch (err) {
        if (flags.json) {
            printJson({
                error: err instanceof Error ? err.message : String(err),
            });
            process.exit(1);
        }
        console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=cli.js.map