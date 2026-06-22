// ─── Shared primitives ───────────────────────────────────────────────────────

export type RouteMode =
  | "cost-first"
  | "speed-first"
  | "trust-first"
  | "attested-only"
  | "provider-pinned"
  | "budget-guarded"
  | "fastest"
  | "cheapest"
  | "highest-reputation"
  | "private-attested"
  | "fixed-provider";

export type LedgerMode = "none" | "solana";

// ─── Config ──────────────────────────────────────────────────────────────────

export interface TurnstileConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  defaultRouteMode?: RouteMode;
  defaultLedgerMode?: LedgerMode;
}

// Alias for backward compatibility
export type TurnstileAIConfig = TurnstileConfig & {
  defaultPolicy?: string;
  defaultAnchor?: string;
};

// ─── Chat completions ─────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  extra_body?: {
    receipt?: boolean;
    policy?: string;
    anchor?: string;
  };
}

export interface ChatCompletionChoice {
  message: {
    role: "assistant";
    content: string;
  };
}

export interface ChatCompletionResponse {
  choices: ChatCompletionChoice[];
  compute_receipt?: ComputeReceipt;
}

// ─── Receipts ─────────────────────────────────────────────────────────────────

export interface ReceiptAnchor {
  chain: string;
  transactionId: string;
  explorerUrl?: string;
}

export interface ComputeReceipt {
  id: string;
  model: string;
  provider: string;
  tokens: number;
  latencySeconds: number;
  costUsd: number;
  promptHash?: string;
  responseHash?: string;
  signature: string;
  verified: boolean;
  anchor?: ReceiptAnchor | null;
}

export interface ReceiptVerificationResponse {
  status: string;
  signatureValid: boolean;
  anchorMatched: boolean;
}

// ─── Run records ──────────────────────────────────────────────────────────────

export interface LedgerCheckpoint {
  chain: "solana";
  txId: string;
  slot: number;
  explorerUrl: string;
  confirmedAt: string | null;
}

export interface RunRecord {
  id: string;
  createdAt: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  costUsd: number;
  requestDigest: string;
  responseDigest: string;
  signature: string;
  routeMode: RouteMode;
  verified: boolean;
  ledgerCheckpoint: LedgerCheckpoint | null;
  metadata?: Record<string, unknown>;
}

export interface VerificationResult {
  recordId: string;
  signatureOk: boolean;
  digestOk: boolean;
  ledgerOk: boolean | null;
  status: "verified" | "pending" | "failed";
  message: string;
  // Aliases for backward compatibility
  signatureValid?: boolean;
  anchorMatched?: boolean;
}

// ─── Providers ────────────────────────────────────────────────────────────────

export interface ProviderHealth {
  id: string;
  label: string;
  uptimePercent: number;
  avgLatencyMs: number;
  errorRatePercent: number;
  attested: boolean;
  trustTier: "A+" | "A" | "B+" | "B" | "C";
  lastUpdatedAt: string;
}

// ─── Usage ────────────────────────────────────────────────────────────────────

export interface UsageOverview {
  period: "day" | "week" | "month";
  requests: number;
  verifiedRuns: number;
  totalTokens: number;
  totalCostUsd: number;
  averageLatencyMs: number;
  from: string;
  to: string;
}

// ─── Inference options ────────────────────────────────────────────────────────

export interface InferenceOptions {
  checkpoint?: boolean;
  ledger?: LedgerMode;
  routeMode?: RouteMode;
  provider?: string;
  maxSpendUsd?: number;
  tags?: string[];
}

// ─── Error body ───────────────────────────────────────────────────────────────

export interface TurnstileApiErrorBody {
  code?: string;
  message?: string;
  details?: unknown;
}

// ─── Chat (extended) ──────────────────────────────────────────────────────────

export interface TurnstileChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface TurnstileChatRequest {
  model: string;
}