import prisma from "../db";
import errorCodes from "../enums/errorCodes";
import {
  comparePasswords,
  createJWT,
  hashPassword,
} from "../middlewares/auth.middleware";
import { BadRequestError } from "../errors/BadRequestError";
import { AuthenticationError } from "../errors/AuthenticationError";

export const createNewUser = async (req, res, next) => {
  try {
    const isUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (isUser) {
      throw new BadRequestError(errorCodes.USER_ALREADY_SIGNUP);
    }

    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        last_name: req.body.last_name,
        password: await hashPassword(req.body.password),
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      throw new AuthenticationError(errorCodes.INVALID_CREDENTIALS);
    }

    const token = createJWT(user);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
