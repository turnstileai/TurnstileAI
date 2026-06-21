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
}