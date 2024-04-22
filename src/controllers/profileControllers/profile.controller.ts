import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { AuthenticationError } from "../../errors/AuthenticationError";

export const getMyProfile = async (req, res, next) => {
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
    studentId: null,
    tcNumber: null,
    email: null,
    avatarImg: null,
  };
  userDto.name = userInfo.name;
  userDto.lastName = userInfo.last_name;
  userDto.studentId = userInfo.school_number;
  userDto.tcNumber = userInfo.tc_number;
  userDto.email = userInfo.email;
  userDto.avatarImg = ""; // not for now

  return res.json(userDto);
};

export const updateMyProfile = async (req, res, next) => {
  const userId = req.id;
  const { name, lastName, tcNumber, avatarImg } = req.body;

  if (!userId) {
    throw new AuthenticationError(errorCodes.NOT_AUTHENTICATE);
  }
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });

  const updatedUser = await prisma.user.update({
    where: { id: userInfo.id },
    data: {
      name: name,
      last_name: lastName,
      tc_number: tcNumber,
      // avatarImg
    },
  });

  res.json({ message: "Profile updated succesfully" });
};
