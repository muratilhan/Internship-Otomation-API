export abstract class CustomError extends Error {
  constructor(public errorCode: string) {
    super(errorCode);
  }
  abstract StatusCode: number;
  abstract serialize(): Object;
}
