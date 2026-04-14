export class UnknownError extends Error {
  constructor(cause?: unknown) {
    super("Unknown error", { cause });
    this.name = "UnknownError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}
