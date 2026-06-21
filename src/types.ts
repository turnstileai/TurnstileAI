export type RouteMode =
  | "cost-first"
  | "speed-first"
  | "trust-first"
  | "attested-only"
  | "provider-pinned"
  | "budget-guarded";

export type LedgerMode = "none" | "solana";

export interface TurnstileConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  defaultRouteMode?: RouteMode;
  defaultLedgerMode?: LedgerMode;
}

export interface InferenceOptions {
  checkpoint?: boolean;
  ledger?: LedgerMode;
  routeMode?: RouteMode;
  provider?: string;
  maxSpendUsd?: number;
  tags?: string[];
}

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
}

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

export interface TurnstileApiErrorBody {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface TurnstileChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface TurnstileChatRequest {
  model: string;
  messages: TurnstileChatMessage[];
  receipt?: boolean;
  anchor?: "solana" | "off-chain" | "none";
  routeMode?: RouteMode;
  provider?: string;
  maxSpendUsd?: number;
  temperature?: number;
  maxTokens?: number;
}

export interface TurnstileChatResult {
  id: string;
  model: string;
  provider: string;
  output: string;
  record: RunRecord | null;
  verification: VerificationResult | null;
}