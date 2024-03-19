import { CustomError } from "./CustomError";

export class DatabaseError extends CustomError {
  StatusCode = 500;
  constructor(public errorCode: string) {
    super(errorCode);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
  serialize(): Object {
    return { errorCode: this.errorCode };
  }
}
