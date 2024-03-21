import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
  StatusCode = 400;
  constructor(public errorCode: string, public fields?: Array<string>) {
    super(errorCode);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serialize(): Object {
    return { errorCode: this.errorCode, fields: this.fields };
  }
}
