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

export class NoUserError extends Error {
  constructor() {
    super("No user");
    this.name = "NoUserError";
  }
}

export class IncorrectPasswordError extends Error {
  constructor() {
    super("Incorrect password");
    this.name = "IncorrectPasswordError";
  }
}
