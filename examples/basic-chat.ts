import { TurnstileAI } from "@turnstileai/sdk";

async function main() {
  const apiKey = process.env.TURNSTILE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing TURNSTILE_API_KEY");
  }

  const client = new TurnstileAI({
    apiKey
  });

  const response = await client.chat.completions.create({
    model: "openrouter/llama-3.1-70b",
    messages: [
      {
        role: "user",
        content: "Explain AI trading signals in simple terms."
      }
    ],
    extra_body: {
      receipt: true,
      policy: "cheapest"
    }
  });

  console.log("Response:");
  console.log(response.choices[0].message.content);

  console.log("\nReceipt:");
  console.log(response.compute_receipt);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
