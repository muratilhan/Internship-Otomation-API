import { CustomError } from "./CustomError";

export class AuthenticationError extends CustomError {
  StatusCode = 401;
  constructor(public errorCode: string) {
    super(errorCode);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  serialize(): Object {
    return { errorCode: this.errorCode };
  }
}
