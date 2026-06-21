# Authentication

TurnstileAI uses API keys to authenticate requests.

## Key types

| Prefix | Use |
|---|---|
| `ts_live_` | Production traffic |
| `ts_test_` | Development and testing |
| `ts_agent_` | Restricted agent access |

## Example

```ts
import { TurnstileAI } from "@turnstileai/sdk";

const client = new TurnstileAI({
  apiKey: process.env.TURNSTILE_API_KEY!
});
```

## Environment variable

```bash
export TURNSTILE_API_KEY=ts_live_xxx
```

## Good practice

- Keep keys in environment variables.
- Do not commit keys to source control.
- Use test keys in development.
- Rotate keys when needed.
- Use restricted keys for agents and automations.
