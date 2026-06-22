export { TurnstileAI } from "./client";
export { ReceiptsResource } from "./receipts";

export {
  TurnstileAIError,
  TurnstileAIAuthError,
  TurnstileAIAPIError,
  TurnstileAIVerificationError,
} from "./errors";

export {
  verifyReceiptSignature,
  verifyInclusionProof,
  buildSignaturePayload,
} from "./verifier";

export type {
  TurnstileAIConfig,
  ChatMessage,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChoice,
  ComputeReceipt,
  ReceiptAnchor,
  ReceiptVerificationResponse,
  OfflineVerificationResult,
  ReceiptPublicKey,
} from "./types";

export type { ReceiptSignaturePayload } from "./verifier";
export type { InclusionProof } from "./receipts";