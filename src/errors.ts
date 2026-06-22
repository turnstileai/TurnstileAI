export class TurnstileAIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TurnstileAIError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TurnstileAIAuthError extends TurnstileAIError {
  constructor(message = "Authentication failed") {
    super(message);
    this.name = "TurnstileAIAuthError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TurnstileAIAPIError extends TurnstileAIError {
  statusCode: number;

  constructor(statusCode: number, message = "API request failed") {
    super(message);
    this.name = "TurnstileAIAPIError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TurnstileAIVerificationError extends TurnstileAIError {
  receiptId: string;

  constructor(receiptId: string, message = "Receipt verification failed") {
    super(message);
    this.name = "TurnstileAIVerificationError";
    this.receiptId = receiptId;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}