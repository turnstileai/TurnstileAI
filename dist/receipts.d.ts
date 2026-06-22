import { ComputeReceipt, ReceiptVerificationResponse } from "./types";
export declare class ReceiptsResource {
    private readonly request;
    constructor(request: <T>(path: string, init?: RequestInit) => Promise<T>);
    get(id: string): Promise<ComputeReceipt>;
    verify(id: string): Promise<ReceiptVerificationResponse>;
}
//# sourceMappingURL=receipts.d.ts.map