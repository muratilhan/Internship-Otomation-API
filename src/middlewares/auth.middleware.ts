import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import defaultConfig from "../config";
import { AuthenticationError } from "../errors/AuthenticationError";
import errorCodes from "../enums/errorCodes";

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    defaultConfig.jwtSecret
  );

  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    throw new AuthenticationError(errorCodes.NOT_AUTHENTICATE);
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    throw new AuthenticationError(errorCodes.NOT_VALID_TOKEN);
  }

  try {
    const payload = jwt.verify(token, defaultConfig.jwtSecret);
    req.user = payload;
    console.log(payload);
    next();
    return;
  } catch (e) {
    // ...
    console.error(e);
    res.status(401);
    res.send("Not authorized");
    return;
  }
};
