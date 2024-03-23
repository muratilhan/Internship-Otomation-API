import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";
import { hashPassword } from "../../handlers/auth.handler";

export const newUser = async (req, res, next) => {
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

    res.status(201).json({ message: "User succesfully created" });
  } catch (e) {
    next(e);
  }
};
