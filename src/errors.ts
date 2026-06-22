// Base errors
export class TurnstileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TurnstileError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TurnstileAuthError extends TurnstileError {
  constructor(message = "Authentication failed") {
    super(message);
    this.name = "TurnstileAuthError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TurnstileRequestError extends TurnstileError {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "TurnstileRequestError";
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TurnstileVerificationError extends TurnstileError {
  recordId: string;

  constructor(message: string, recordId: string) {
    super(message);
    this.name = "TurnstileVerificationError";
    this.recordId = recordId;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Legacy aliases — kept for backward compatibility with existing SDK exports
export class TurnstileAIError extends TurnstileError {}

export class TurnstileAIAuthError extends TurnstileAuthError {}

export class TurnstileAIAPIError extends TurnstileRequestError {
  constructor(statusCode: number, message = "API request failed") {
    super(message, statusCode);
    this.name = "TurnstileAIAPIError";
  }
}

export class TurnstileAIVerificationError extends TurnstileVerificationError {
  receiptId: string;

  constructor(receiptId: string, message = "Receipt verification failed") {
    super(message, receiptId);
    this.name = "TurnstileAIVerificationError";
    this.receiptId = receiptId;
  }
}