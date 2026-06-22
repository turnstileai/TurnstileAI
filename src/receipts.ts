import { ComputeReceipt, ReceiptVerificationResponse } from "./types";
import { TurnstileAIVerificationError } from "./errors";

export class ReceiptsResource {
  constructor(
    private readonly request: <T>(path: string, init?: RequestInit) => Promise<T>
  ) {}

  async get(id: string): Promise<ComputeReceipt> {
    return this.request<ComputeReceipt>(`/receipts/${id}`, {
      method: "GET"
    });
  }

  async verify(id: string): Promise<ReceiptVerificationResponse> {
    const result = await this.request<ReceiptVerificationResponse>(
      `/receipts/${id}/verify`,
      {
        method: "POST"
      }
    );

    if (result.status !== "verified" && result.signatureValid === false) {
      throw new TurnstileAIVerificationError(id);
    }

    return result;
  }
}