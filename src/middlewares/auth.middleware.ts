import jwt from "jsonwebtoken";
import defaultConfig from "../config";
import { AuthenticationError } from "../errors/AuthenticationError";
import errorCodes from "../enums/errorCodes";

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    defaultConfig.jwtSecret
  );

  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization || req.headers.Authorization;

  if (!bearer) {
    throw new AuthenticationError(errorCodes.NOT_AUTHENTICATE);
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    throw new AuthenticationError(errorCodes.NOT_VALID_TOKEN);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.id = decoded.UserInfo.id;
    req.email = decoded.UserInfo.email;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};
