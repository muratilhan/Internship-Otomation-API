import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("hebele", error.name, error.message);
  if (error instanceof CustomError) {
    return res.status(error.StatusCode).json({ message: error.serialize() });
  }

  return res.status(404).json({ message: "not found" });
};
