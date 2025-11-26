export class UnknownSignUpError extends Error {
  constructor(cause?: unknown) {
    super("Unknown sign up error", { cause });
    this.name = "UnknownSignUpError";
  }
}
