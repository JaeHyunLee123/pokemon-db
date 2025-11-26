export class UsedEmailError extends Error {
  constructor() {
    super("Used email");
    this.name = "UsedEmailError";
  }
}
