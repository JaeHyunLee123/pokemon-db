export class UsedEmailError extends Error {
  constructor() {
    super("Used email");
    this.name = "UsedEmailError";
  }
}

export class VerifyFailError extends Error {
  constructor() {
    super("Verify fail");
    this.name = "VerifyFailError";
  }
}
