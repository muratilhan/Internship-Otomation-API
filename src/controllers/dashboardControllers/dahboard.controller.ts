import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { AuthenticationError } from "../../errors/AuthenticationError";

export const getDashboardProfile = async (req, res, next) => {
  const userId = req.id;

  if (!userId) {
    throw new AuthenticationError(errorCodes.NOT_AUTHENTICATE);
  }

  const userInfo = await prisma.user.findUnique({ where: { id: userId } });

  if (!userInfo) {
    return res.json({});
  }

  const userDto = {
    name: null,
    lastName: null,
    avatarImg: null,
  };
  userDto.name = userInfo.name;
  userDto.lastName = userInfo.last_name;
  userDto.avatarImg = ""; // not for now

  return res.json({ userDto });
};
