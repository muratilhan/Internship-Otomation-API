import { CustomError } from "./CustomError";

export class AuthorizationError extends CustomError {
  StatusCode = 401;
  constructor(public errorCode: string) {
    super(errorCode);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }

  serialize(): Object {
    return { errorCode: this.errorCode };
  }
}
