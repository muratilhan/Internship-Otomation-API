import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";
import errorCodes from "../enums/errorCodes";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("err", error);
  if (error instanceof CustomError) {
    return res.status(error.StatusCode).json({ message: error.serialize() });
  }

  return res
    .status(500)
    .json({ message: { errorCode: errorCodes.UNEXPECTED } });
};
