<<<<<<< HEAD
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
=======
export class TurnstileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TurnstileError";
  }
}

export class TurnstileAuthError extends TurnstileError {
  constructor(message: string) {
    super(message);
    this.name = "TurnstileAuthError";
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
  }
}

export class TurnstileVerificationError extends TurnstileError {
  recordId: string;

  constructor(message: string, recordId: string) {
    super(message);
    this.name = "TurnstileVerificationError";
    this.recordId = recordId;
  }
>>>>>>> 5531b75e9745b637b2f4cfe96769787bdf64e51c
}