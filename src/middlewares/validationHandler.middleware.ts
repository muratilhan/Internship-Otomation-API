import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../errors/BadRequestError";
import errorCodes from "../enums/errorCodes";

export function validateRequestSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  console.log("validation", errors);

  if (!errors.isEmpty()) {
    const fields = extractFieldFromValidation(errors.array());
    throw new BadRequestError(errorCodes.INVALID_INPUT, fields);
  }

  next();
}

const extractFieldFromValidation = (errors) => {
  const paths: string[] = [];

  errors.map((error) => {
    if (!paths.includes(error.path)) {
      paths.push(error.path);
    }
  });

  return paths;
};
