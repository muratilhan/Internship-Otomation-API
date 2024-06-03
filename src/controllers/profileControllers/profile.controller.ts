import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import resultCodes from "../../enums/resultCodes";
import { AuthenticationError } from "../../errors/AuthenticationError";
import { BadRequestError } from "../../errors/BadRequestError";

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.id;

    if (!userId) {
      throw new AuthenticationError(errorCodes.NOT_AUTHENTICATE);
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        user_type: true,
        name: true,
        last_name: true,
        tc_number: true,
        school_number: true,
      },
    });

    if (!userInfo) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    return res.status(200).json({ data: userInfo });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.id;
    const { name, lastName, tcNumber } = req.body;

    if (!userId) {
      throw new AuthenticationError(errorCodes.NOT_AUTHENTICATE);
    }
    const userInfo = await prisma.user.findUnique({ where: { id: userId } });

    const updatedUser = await prisma.user.update({
      where: { id: userInfo.id },
      data: {
        updatedBy: {
          connect: {
            id: userId,
          },
        },
        name: name,
        last_name: lastName,
        tc_number: tcNumber,
      },
    });

    return res.status(200).json({ message: resultCodes.UPDATE_SUCCESS });
  } catch (error) {
    next(error);
  }
};
